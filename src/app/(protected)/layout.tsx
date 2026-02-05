import { redirect } from "next/navigation";
import { AuthProvider } from "~/app/_contexts/authContext";
import { SidebarProvider } from "~/components/ui/sidebar";
import { getSession } from "~/server/better-auth/server";
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
