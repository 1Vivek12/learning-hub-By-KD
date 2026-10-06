import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { AuditService } from "@/lib/services/auditService";
import { EmailService } from "@/lib/services/emailService";
import { RateLimiter } from "@/lib/security/rateLimiter";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // IP Registration Rate Limits
    // Burst: 3 per 15 minutes
    const burstLimit = await RateLimiter.consume(`auth:register:burst:${ip}`, 3, 15 * 60 * 1000);
    if (!burstLimit.success) {
      return NextResponse.json({ error: "Too many registrations. Please try again later." }, { status: 429, headers: { 'Retry-After': '900' } });
    }

    // Sustained: 5 per hour
    const sustainedLimit = await RateLimiter.consume(`auth:register:hourly:${ip}`, 5, 60 * 60 * 1000);
    if (!sustainedLimit.success) {
      return NextResponse.json({ error: "Too many registrations. Please try again later." }, { status: 429, headers: { 'Retry-After': '3600' } });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: "STUDENT", // Forced server-side
      },
    });

    await AuditService.log({
      action: "USER_REGISTERED",
      resource: "User",
      resourceId: user.id,
      details: { email: user.email },
    });

    // Send welcome email / notification
    await EmailService.sendWelcomeEmail(user.id, user.email, user.name);

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
