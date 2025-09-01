import { users } from '~~/db/schema';
import { db } from '../api/utils/database';
import { validateSessionToken } from '../api/utils/session';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'session_token') ?? '';
  const validSessionToken = await validateSessionToken(db, sessionToken);

  if (!validSessionToken) {
    event.context.auth = { validSessionToken: null, user: null };
  } else {
    const user = await db.select().from(users).where(eq(users.id, validSessionToken.user_id));

    event.context.auth = {
      validSessionToken,
      user: user[0] || null,
    };
  }
});
