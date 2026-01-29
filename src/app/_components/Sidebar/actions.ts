"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/better-auth";


export async function logoutAction() {
    try {
        const headersList = await headers();

        await auth.api.signOut({
            headers: headersList
        });

        redirect("/auth/login");
    } catch (error) {
        console.log({ error })
    }
}