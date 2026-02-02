"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "~/components/ui/sidebar";
import { Calendar, Home, LogOutIcon, User2Icon } from "lucide-react"
import { cn } from "~/lib/utils";

import img from "public/icons/white_icon.svg"
import Image from "next/image";
import { logoutAction } from "./actions";
import { useAppToast } from "~/app/_contexts/toastContext";

interface AppSidebarProps {
    className?: string;
}

const items = [
    {
        title: "Home",
        url: "/",
        icon: <Home />,
    },
    {
        title: "Tarefas",
        url: "/tasks",
        icon: <Calendar />,
    },
    {
        title: "Usuários",
        url: "/users",
        icon: <User2Icon />,
    },
]

export function AppSidebar({
    className,
}: AppSidebarProps) {
    const {
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
    } = useSidebar()

    const toast = useAppToast();

    async function handleLogout() {
        try {
            await logoutAction();
            toast.success("Deslogado com sucesso!");
        } catch (error) {
            toast.error("Erro inesperado ao deslogar!", error);
        }
    }

    return (
        <Sidebar
            collapsible="icon"
            className={cn(
                "!border-r-0",
                className,
            )}
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarHeader>
                        <div
                            onClick={() => setOpen(!open)}
                            className="flex items-center justify-center gap-[5px] cursor-pointer hover:bg-[#0c0625] rounded-md"
                        >
                            <Image
                                src={img}
                                alt="Logo em formato de folha"
                                className="!w-[33px]"
                            />
                            {!!open &&
                                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">
                                    T3asks
                                </span>}

                        </div>
                    </SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size={"lg"} className="[&>svg]:size-5">
                                        <a href={item.url} className="text-lg3">
                                            {item.icon}
                                            {open && <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">{item.title}</span>}
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter className="w-full absolute bottom-0 mb-10 flex items-center justify-center">
                    <div className=" w-[calc(100%-20px)] hover:bg-[#0c0625] p-2 rounded-md cursor-pointer">
                        <LogOutIcon className="m-0 mx-auto" onClick={async () => await handleLogout()} />

                    </div>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
}
