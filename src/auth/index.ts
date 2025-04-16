import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  })],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, account, profile }) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
})