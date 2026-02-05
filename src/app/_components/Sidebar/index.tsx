"use client";

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
    SidebarTrigger,
    useSidebar,
} from "~/components/ui/sidebar";
import { Calendar, Home, LogOutIcon, User2Icon } from "lucide-react";
import { cn } from "~/lib/utils";

import img from "public/icons/white_icon.svg";
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
];

export function AppSidebar({ className }: AppSidebarProps) {
    const {
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
    } = useSidebar();

    const toast = useAppToast();

    async function handleLogout() {
        try {
            await logoutAction();
            toast.success("Deslogado com sucesso!");
        } catch (e) {
            console.error({ e })
            const error = "Erro inesperado. Tente novamente em alguns minutos."
            toast.error(error);
        }
    }

    function handleLogoutSubmit() {
        void handleLogout();
    };

    return (
        <>
            <div className="fixed top-[5px] left-[5px] z-50 flex items-center md:hidden bg-green-700 text-white rounded-md p-2 shadow">
                <SidebarTrigger />
            </div>

            <Sidebar
                collapsible="icon"
                className={cn("!border-r-0", className)}
            >
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarHeader>
                            <div
                                onClick={() => {
                                    if (isMobile) {
                                        setOpenMobile(!openMobile);
                                    } else {
                                        setOpen(!open);
                                    }
                                }}
                                className="flex items-center justify-center gap-2 cursor-pointer hover:bg-[#0c0625] rounded-md p-2"
                            >
                                <Image
                                    src={img}
                                    alt="Logo em formato de folha"
                                    className="!w-[33px]"
                                />
                                {!!open &&
                                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">
                                        T3asks
                                    </span>}

                            </div>
                        </SidebarHeader>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            size="lg"
                                            className="[&>svg]:size-5"
                                            onClick={() => {
                                                if (isMobile) {
                                                    setOpenMobile(false);
                                                }
                                            }}
                                        >
                                            <a href={item.url} className="flex items-center gap-2">
                                                {item.icon}
                                                {open && (
                                                    <span className="font-semibold">
                                                        {item.title}
                                                    </span>
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarFooter className="w-full absolute bottom-0 mb-6 flex justify-center">
                        <div
                            onClick={handleLogoutSubmit}
                            className="w-[calc(100%-20px)] hover:bg-[#0c0625] p-2 rounded-md cursor-pointer flex justify-center"
                        >
                            <LogOutIcon />
                        </div>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
        </>
    );
}
