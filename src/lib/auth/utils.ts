import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function getApiSession() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { session: null, errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  
  return { session, errorResponse: null };
}

export async function getApiRole(allowedRoles: string[]) {
  const { session, errorResponse } = await getApiSession();
  
  if (errorResponse) {
    return { session: null, errorResponse };
  }
  
  const userRole = session.user?.role;
  
  if (!allowedRoles.includes(userRole)) {
    return { session: null, errorResponse: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  
  return { session, errorResponse: null };
}

export async function getApiAdmin() {
  return getApiRole(["ADMIN", "SUPER_ADMIN"]);
}

export async function getApiInstructor() {
  return getApiRole(["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"]);
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  
  const userRole = session.user?.role;
  
  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }
  
  return session;
}

export async function requireAdmin() {
  return requireRole(["ADMIN", "SUPER_ADMIN"]);
}

export async function requireInstructor() {
  return requireRole(["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"]);
}
