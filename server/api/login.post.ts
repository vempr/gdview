import { loginSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';
import { drizzle } from 'drizzle-orm/node-postgres';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const validated = loginSchema.parse(body);
    const db = drizzle(process.env.DATABASE_URL!);

    return 'Credentials parsed and database connected successfully!';
  } catch (err) {
    if (err instanceof ZodError) {
      return `Credentials not parsed successfully: ${JSON.stringify(err)} ${JSON.stringify(body)}`;
    } else {
      return JSON.stringify(err);
    }
  }
});
