import { db } from '../server/api/utils/database';
import { users } from './schema.ts';
import { reset } from 'drizzle-seed';
import * as schema from './schema.ts';

const main = async () => {
  try {
    await reset(db, schema);
    await db.insert(users).values({
      username: 'admin',
      password: 'admin',
      admin: true,
    });
  } catch (err) {
    console.log('*FAILED TO SEED DATABASE*');
    console.error(err);
  }
};

main();
