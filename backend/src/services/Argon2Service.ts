import { ICredentialHashingService } from "../abstracts/CredentialHashingService.js";
import { Algorithm, hash, verify } from "@node-rs/argon2";

export class Argon2Service implements ICredentialHashingService {
  constructor() { }

  async digest(credential: string): Promise<string> {
    return await hash(credential, {
      algorithm: Algorithm.Argon2id
    });
  }

  async verify(credential: string, hash: string): Promise<boolean> {
    return await verify(hash, credential, {
      algorithm: Algorithm.Argon2id
    })
  }
}
