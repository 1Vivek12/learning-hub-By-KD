import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();

        // Dynamically import RateLimiter to avoid circular dependencies if any
        const { RateLimiter } = await import('@/lib/security/rateLimiter');

        const forwardedFor = req?.headers?.['x-forwarded-for'];
        const ip = forwardedFor ? (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0]).trim() : '127.0.0.1';

        // 1. IP-level Rate Limit (10 per 15 mins)
        const ipLimit = await RateLimiter.consume(`auth:login:ip:${ip}`, 10, 15 * 60 * 1000);
        if (!ipLimit.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        // 2. Account-level Rate Limit (10 per 15 mins) - Hashed to avoid plaintext email in DB
        // Hash the email to keep PII out of rate limit table
        const emailHash = await (async () => {
          const crypto = await import('crypto');
          return crypto.createHash('sha256').update(normalizedEmail).digest('hex');
        })();
        
        const accountLimit = await RateLimiter.consume(`auth:login:account:${emailHash}`, 10, 15 * 60 * 1000);
        if (!accountLimit.success) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        // Reset account-level limit on successful login
        await RateLimiter.reset(`auth:login:account:${emailHash}`);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id ?? token.sub;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
};
