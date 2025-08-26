import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      userId: user.userId, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(credentials: LoginCredentials): Promise<AuthResponse | null> {
  const user = await prisma.user.findUnique({
    where: { userId: credentials.userId }
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(credentials.password, user.password);
  if (!isValid) {
    return null;
  }

  const token = generateToken(user);
  return { user, token };
}

export async function createUser(data: RegisterData): Promise<AuthResponse> {
  const hashedPassword = await hashPassword(data.password);
  
  const user = await prisma.user.create({
    data: {
      userId: data.userId,
      email: data.email,
      password: hashedPassword,
      country: data.country,
      language: data.language || 'ES',
    }
  });

  const token = generateToken(user);
  return { user, token };
}
