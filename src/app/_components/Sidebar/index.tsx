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
import { Calendar, Home, LogOutIcon, User2Icon } from "lucide-react"
import { cn } from "~/lib/utils";

import img from "public/icons/white_icon.svg"
import Image from "next/image";
import { logoutAction } from "./actions";

interface AppSidebarProps {
    className?: string;
}

const items = [
    {
        title: "Home",
        url: "/",
        icon: <Home size={20} />,
    },
    {
        title: "Tarefas",
        url: "/tasks",
        icon: <Calendar size={20} />,
    },
    {
        title: "Usuários",
        url: "#",
        icon: <User2Icon size={20} />,
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
                            className="flex items-center justify-center gap-[5px] cursor-pointer hover:bg-[#0c0625] rounded-md"
                        >
                            <Image
                                src={img}
                                alt="Logo em formato de folha"
                                className="w-[33px]"
                            />
                            {open &&
                                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">
                                    T3asks
                                </span>}

                        </div>
                    </SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url} className="text-lg3">
                                            {item.icon}
                                            <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter className="absolute bottom-0 w-full mb-10 hover:bg-[#0c0625] p-2 rounded-md cursor-pointer">
                    <LogOutIcon className="m-0 mx-auto" onClick={async () => await logoutAction()}/>
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    );
}
