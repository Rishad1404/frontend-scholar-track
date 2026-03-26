"use server";

import { cookies } from "next/headers";

export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
) => {
    try {
        const cookieStore = await cookies();

        cookieStore.set(name, value, {
            httpOnly : true,
            secure : true,
            sameSite : "strict",
            path : "/",
            maxAge : maxAgeInSeconds,
        })
    } catch (error) {
        // cookies().set is only allowed in Server Actions or Route Handlers.
        // If we're running in a context where setting cookies is not allowed
        // (for example, middleware or certain server component lifecycles),
        // skip setting the cookie but log a warning for debugging.
        console.warn(`Skipping setCookie(${name}) - not allowed in this context`, error);
    }
}

export const getCookie = async (name : string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export const deleteCookie = async (name : string) => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(name);
    } catch (error) {
        // Same reasoning as setCookie: silently skip when not allowed.
        console.warn(`Skipping deleteCookie(${name}) - not allowed in this context`, error);
    }
}