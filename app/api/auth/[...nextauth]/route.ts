import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth/config";

// v4 hands back one handler for both verbs rather than a `handlers` object.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
