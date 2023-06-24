import NextAuth, { DefaultSession, NextAuthOptions, Session } from "next-auth"
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db, dbUsers } from "@/database";
import { User } from "@/models";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Email', type: 'email', placeholder: 'email@email.com'
        },
        password:{
          label: 'Password', type: 'password', placeholder: 'password'
        }
      },
      async authorize( credentials ) {
        const { email, password } = credentials as { email: string, password: string};
        return await dbUsers.checkUserEmailPassword( email, password );
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  session: {
    maxAge: 2592000, //30 dias
    strategy: 'jwt',
    updateAge: 86400, //cada dia
  },
  callbacks: {
    async jwt({ token, account, user }){
      if( account ){
        token.accessToken = account.access_token;
        switch( account.type ){
          case 'oauth':
            token.user = await dbUsers.oauthToDbUser(user?.email || '', user?.name || '');
          break;
          case 'credentials':
            token.user = user;
          break;
        }
      }
      return token;
    },
    async session({ session, token, user }){
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    }
  }
}

export default NextAuth(authOptions)
