import { z } from 'zod';

const loginNameSchema = z.string().trim().min(1, 'Username is required').max(30, "Username can't be longer than 30 characters");

const loginPasswordSchema = z.string().trim().min(1, 'Password is required').max(255, "Password can't be longer than 255 characters");

export const loginSchema = z.object({
  username: loginNameSchema,
  password: loginPasswordSchema,
});

const registerNameSchema = z
  .string()
  .trim()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters long')
  .max(30, "Username can't be longer than 30 characters");

const registerPasswordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .max(255, "Password can't be longer than 255 characters")
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one digit')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  username: registerNameSchema,
  password: registerPasswordSchema,
});
