import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                // Anonymous users don't have password, so they can't login with credentials
                if (!user || !user.password || !user.email) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email, // Now guaranteed to be non-null
                    name: user.name,
                    planType: user.planType,
                    storageUsed: user.storageUsed,
                    storageLimit: user.storageLimit,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    editsThisMonth: user.editsThisMonth,
                    editsResetDate: user.editsResetDate,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.planType = user.planType;
                token.storageUsed = user.storageUsed?.toString();
                token.storageLimit = user.storageLimit?.toString();
                token.createdAt = user.createdAt?.toISOString();
                token.updatedAt = user.updatedAt?.toISOString();
                token.editsThisMonth = user.editsThisMonth;
                token.editsResetDate = user.editsResetDate?.toISOString();
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;

                // Fetch fresh user data from database for up-to-date info
                const user = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: {
                        planType: true,
                        storageUsed: true,
                        storageLimit: true,
                        createdAt: true,
                        updatedAt: true,
                        editsThisMonth: true,
                        editsResetDate: true,
                    },
                });

                if (user) {
                    session.user.planType = user.planType;
                    session.user.storageUsed = user.storageUsed.toString();
                    session.user.storageLimit = user.storageLimit.toString();
                    session.user.createdAt = user.createdAt.toISOString();
                    session.user.updatedAt = user.updatedAt.toISOString();
                    session.user.editsThisMonth = user.editsThisMonth;
                    session.user.editsResetDate = user.editsResetDate.toISOString();
                }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
