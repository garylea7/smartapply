import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAGIC_LINK_EXPIRY = '15m';
const ACCESS_TOKEN_EXPIRY = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  plan: string;
}

export function generateMagicToken(email: string): string {
  return jwt.sign({ email, type: 'magic_link' }, JWT_SECRET, {
    expiresIn: MAGIC_LINK_EXPIRY,
  });
}

export function generateAccessToken(userId: string, email: string, plan: string): string {
  return jwt.sign({ userId, email, plan }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyMagicToken(token: string): { email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type === 'magic_link') {
      return { email: decoded.email };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateAuthCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateUserId(): string {
  return uuidv4();
}