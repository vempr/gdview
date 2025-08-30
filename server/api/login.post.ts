import { loginSchema } from '#shared/zod/auth';
import { ZodError } from 'zod';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const validated = loginSchema.parse(body);
    console.log(validated);
    return 'Credentials parsed successfully!';
  } catch (err) {
    if (err instanceof ZodError) {
      return `Credentials not parsed successfully: ${JSON.stringify(err)} ${JSON.stringify(body)}`;
    }
  }
});
