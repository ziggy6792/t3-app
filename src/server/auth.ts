/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CognitoProvider from "next-auth/providers/cognito";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  debug: true,
  secret: "+xoOfHJuQtCgEahUvJq4SJGB5rLJPeO/M28RbzkRUgo=",
  // callbacks: {
  //   session: ({ session, user }) => ({
  //     ...session,
  //     user: {
  //       ...session.user,
  //       id: user.id,
  //     },
  //   }),
  // },
  // adapter: PrismaAdapter(db),
  providers: [
    // CognitoProvider({
    //   clientId: "1om2i227s52mkpl4t256637ba5",
    //   clientSecret: process.env.COGNITO_CLIENT_SECRET,
    //   issuer: process.env.COGNITO_ISSUER,
    // }),
    CognitoProvider({
      name: "cognito",
      clientId: "2suj11499pf203d7a1tamsfql0",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      clientSecret: "1gngqg7isk11789gm84k5lnuuvk1cn3g8nf4i5041ukprgfdse3i",
      // issuer: "next-auth-demo.auth.ap-southeast-1.amazoncognito.com",
      issuer:
        "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_2tevBbomk",
      // client: {
      //   token_endpoint_auth_method: "none",
      // },
    }),

    // "AWS_USER_POOLS_ID": "ap-southeast-1_RNMlC2yGY",
    // "AWS_USER_POOLS_WEB_CLIENT_ID": "1om2i227s52mkpl4t256637ba5",
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
