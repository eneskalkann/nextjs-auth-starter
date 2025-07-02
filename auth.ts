import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email },
        })) as any;

        if (!user) {
          throw new Error("User not found. Please register first.");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        return { ...token, id: token.id ?? user.id, role: user.role };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.id, role: token.role },
      };
    },
  },
} satisfies NextAuthOptions;
