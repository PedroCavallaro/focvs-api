import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashService {
  async compare(str: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(str, hash)
  }
  async generateHash(str: string): Promise<string> {
    const salts = await bcrypt.genSalt()
    const hash = await bcrypt.hash(str, salts)

    return hash
  }
}
