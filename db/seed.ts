import { users, sessions } from './schema.ts';
import { drizzle } from 'drizzle-orm/node-postgres';

const main = async () => {
  try {
    const db = drizzle(process.env.DATABASE_URL!);
    await db.delete(users);
    await db.delete(sessions);
  } catch (err) {
    console.log('*FAILED TO SEED DATABASE*');
    console.error(err);
  }
};

main();
