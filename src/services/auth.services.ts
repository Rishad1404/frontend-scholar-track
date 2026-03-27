"use server";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("API_BASE_URL is not defined");
}

export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
  try {
    // 1. Grab the cookie store
    const cookieStore = await cookies();
    // 2. Extract the session token
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    // 3. Send BOTH tokens in the Cookie header
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken || ""}`
      }
    });

    if(!res.ok){
        return false;
    }

    const {data} = await res.json();
    const {accessToken, refreshToken: newRefreshToken, sessionToken: newSessionToken} = data;

    if(accessToken){
        await setTokenInCookies("accessToken", accessToken);
    }

    if(newRefreshToken){
        await setTokenInCookies("refreshToken", newRefreshToken);
    }

    // Notice we mapped this to sessionToken based on your backend response!
    if(newSessionToken){
        await setTokenInCookies("better-auth.session_token", newSessionToken, 24 * 60 * 60);
    }

    return true;

  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export async function getUserInfo(){
  const cookieStore=await cookies();
  const accessToken=cookieStore.get("accessToken")?.value;
  const sessionToken=cookieStore.get("better-auth.session_token")?.value;

  if(!accessToken){
    return null;
  }

    const res=await fetch(`${BASE_API_URL}/auth/me`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
             Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
        }
    });

    if(!res.ok){
        return null;
    }

    const {data}=await res.json();
    return data

}


export async function logoutAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  try {
    await fetch(`${BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken || ""}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("better-auth.session_token");

  redirect("/login");
}
