"use client";

import { signOut } from "next-auth/react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

/**
 * Signs out of both halves: the backend session first, then the local one.
 *
 * The order matters — `/api/logout` reads the access token out of the NextAuth
 * cookie, so clearing that cookie first would leave the backend session open.
 * The local sign-out runs either way; a customer who clicked "Log out" must end
 * up signed out of this browser even if the backend never answered.
 */
export function useLogout() {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async (callbackUrl = "/login?reason=signed-out") => {
    setLoggingOut(true);

    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Could not reach the logout route:", error);
    }

    toast.success("Signed out. See you soon!");
    await signOut({ callbackUrl });
  }, []);

  return { logout, loggingOut };
}
