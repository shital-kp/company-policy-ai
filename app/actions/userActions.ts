'use server';

import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
    const email = (formData.get('email') as string | null)?.trim().toLowerCase();
    const password = (formData.get('password') as string | null)?.trim();

    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            name: email.split('@')[0],
            password: hashedPassword,
            role: 'EMPLOYEE',
        },
    });

    return {
        success: true,
    };
}