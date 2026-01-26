"use client"

import { LoaderIcon } from "lucide-react"

import { cn } from "~/lib/utils"

export default function GlobalLoading() {
    return (
        <div className="flex items-center gap-4 ">
            <LoaderIcon
                role="status"
                aria-label="Loading"
                className={cn("size-8 animate-spin text-white")}
            />
        </div>
    )
}
