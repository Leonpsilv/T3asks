import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { AuthProvider } from "~/app/_contexts/auth-context";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <AuthProvider session={session}>
      {children}
    </AuthProvider>
  );
}
