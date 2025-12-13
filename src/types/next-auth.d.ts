import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            planType?: string;
            storageUsed?: string;
            storageLimit?: string;
            createdAt?: string;
            updatedAt?: string;
            editsThisMonth?: number;
            editsResetDate?: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        email: string;
        name?: string | null;
        planType?: string;
        storageUsed?: bigint;
        storageLimit?: bigint;
        createdAt?: Date;
        updatedAt?: Date;
        editsThisMonth?: number;
        editsResetDate?: Date;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        planType?: string;
        storageUsed?: string;
        storageLimit?: string;
        createdAt?: string;
        updatedAt?: string;
        editsThisMonth?: number;
        editsResetDate?: string;
    }
}
