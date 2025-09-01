import { registerSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';
import { users } from '@@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from './utils/session';
import { hash } from './utils/auth';
import { db } from './utils/database';

export default defineEventHandler(
  async (
    event,
  ): Promise<
    | { success: false; error: string; user: null }
    | {
        success: true;
        error: null;
        user: {
          id: number;
          admin: boolean;
          username: string;
          created_at: Date;
          updated_at: Date;
          password: undefined;
        };
      }
  > => {
    if (event.context.auth.validSessionToken) {
      return {
        success: false,
        user: null,
        error: 'You are already logged in',
      };
    }

    const body = await readBody(event);

    try {
      const validated = registerSchema.parse(body);

      const existingUsers = await db.select().from(users).where(eq(users.username, validated.username));
      if (existingUsers[0]) {
        return {
          success: false,
          user: null,
          error: 'Username already taken',
        };
      }

      const hashedPassword = await hash(validated.password);
      const u = await db
        .insert(users)
        .values({
          username: validated.username,
          password: hashedPassword,
        })
        .returning();
      const user = u[0];

      const session = await createSession(db, user.id);
      setCookie(event, 'session_token', session.token, {
        maxAge: 86400,
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
      });

      return {
        success: true,
        user: {
          ...user,
          password: undefined,
        },
        error: null,
      };
    } catch (err) {
      if (err instanceof ZodError) {
        return {
          success: false,
          user: null,
          error: `Credentials ${JSON.stringify(body)} not parsed successfully: ${JSON.stringify(err)}`,
        };
      } else {
        return {
          success: false,
          user: null,
          error: JSON.stringify(err),
        };
      }
    }
  },
);
