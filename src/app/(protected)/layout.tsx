import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { AuthProvider } from "~/app/_contexts/auth-context";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "../_components/Sidebar";


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
      <SidebarProvider>
        <AppSidebar />
        <div className="w-[100%] flex items-center justify-center">
          {children}
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
