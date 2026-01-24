"use server";

import { redirect } from "next/navigation";
import { auth } from "~/server/better-auth";


export async function logoutAction() {
    await auth.api.signOut();

    redirect("/auth/login");
}