import NextAuth, { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

export interface IUser {
    email?: string;
    token?: string;
    error?: undefined | string;
    message?: string;
}

export interface IUserAuthSession {
    user: IUser;
}
declare module "next-auth" {
    interface Session {
        user: IUser;
    }
    interface User extends IUser { }
}
