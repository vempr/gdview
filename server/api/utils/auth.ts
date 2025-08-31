import { scrypt } from 'crypto';

export async function hash(s: string): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(s, process.env.PASSWORD_SALT!, 32, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}
