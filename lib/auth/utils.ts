import { auth } from "./config";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }
  return session;
}

export async function getSession() {
  return await auth();
}

export async function requireProSubscription() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user.subscriptionStatus === "pro";
}
