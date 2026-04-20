import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await dbConnect();

          const email = (credentials.email as string).toLowerCase().trim();
          const password = credentials.password as string;

          // Check for admin credentials
          if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
          ) {
            let adminUser = await User.findOne({ email });

            if (!adminUser) {
              adminUser = await User.create({
                name: "Admin",
                email,
                password,
                role: "admin",
                authMethod: "email",
              });
            } else if (adminUser.role !== "admin") {
              adminUser.role = "admin";
              await adminUser.save();
            }

            return {
              id: adminUser._id.toString(),
              name: adminUser.name,
              email: adminUser.email,
              role: "admin" as const,
            };
          }

          const user = await User.findOne({ email });
          if (!user || !user.password) {
            return null;
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) return null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("[AUTH] Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user.role as "user" | "admin") || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
});
