import { registerSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '@@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from './utils/session';
import { hash } from './utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const validated = registerSchema.parse(body);
    const db = drizzle(process.env.DATABASE_URL!);

    const existingUsers = await db.select().from(users).where(eq(users.username, validated.username));
    if (existingUsers[0]) {
      return {
        success: false,
        error: 'Username already taken',
      };
    }

    const hashedPassword = await hash(validated.password);
    await db.insert(users).values({
      username: validated.username,
      password: hashedPassword,
    });

    const session = await createSession(db);
    setCookie(event, 'session_token', session.token, {
      maxAge: 86400,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
    });

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    if (err instanceof ZodError) {
      return `Credentials not parsed successfully: ${JSON.stringify(err)} ${JSON.stringify(body)}`;
    } else {
      return JSON.stringify(err);
    }
  }
});
