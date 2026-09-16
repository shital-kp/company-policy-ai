import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const {
	handlers,
	signIn,
	signOut,
	auth,
} = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},

			async authorize(credentials) {
				if (
					!credentials?.email ||
					!credentials?.password
				) {
					return null;
				}

				const email = String(credentials.email)
					.trim()
					.toLowerCase();

				const password = String(credentials.password);

				const user = await prisma.user.findUnique({
					where: {
						email,
					},
				});

				if (!user || !user.password) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

				return {
					id: String(user.id),
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],

	session: {
		strategy: "jwt",
	},

	pages: {
		signIn: "/signin",
	},

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.role = user.role;
			}

			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
				session.user.email = token.email as string;
				session.user.role = token.role as string;
			}

			return session;
		},
	},
});