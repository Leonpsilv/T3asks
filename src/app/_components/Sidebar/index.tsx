"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "~/components/ui/sidebar";
import { Calendar, Home, User2Icon, MenuIcon } from "lucide-react"
import { cn } from "~/lib/utils";

import img from "public/favicon.svg"
import Image from "next/image";
import { logoutAction } from "./actions";

interface AppSidebarProps {
    className?: string;
}

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Tarefas",
        url: "/tasks",
        icon: Calendar,
    },
    {
        title: "Usuários",
        url: "#",
        icon: User2Icon,
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

    return (
        <Sidebar
            collapsible="icon"
            className={cn(
                className,
            )}
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarHeader>
                        <div
                            onClick={() => setOpen(!open)}
                            className="flex items-center justify-center"
                        >
                            <Image
                                src={img}
                                alt="Logo em formato de folha"
                                className="w-[30px]"
                            />
                            {open &&
                                <span>
                                    T3asks
                                </span>}

                        </div>
                    </SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter
                    className=""
                    onClick={async () => await logoutAction()}
                >
                    Sair
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
}
