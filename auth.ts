import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth/config";

/**
 * The signed-in session, read on the server.
 *
 * v4 has no `auth()` of its own — it reads the session through
 * `getServerSession(authOptions)`. Wrapping it here keeps one import for every
 * server caller (`import { auth } from "@/auth"`) and one place to pass the
 * options, rather than repeating them at each call site.
 */
export const auth = () => getServerSession(authOptions);
