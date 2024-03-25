import * as bcrypt from 'bcrypt';

export class PasswordService {
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  async generateHash(password: string): Promise<string> {
    const salts = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salts);

    return hash;
  }
}
