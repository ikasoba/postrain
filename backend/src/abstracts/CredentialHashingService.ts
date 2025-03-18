export interface ICredentialHashingService {
  digest(credential: string): Promise<string>;
  verify(credential: string, hash: string): Promise<boolean>;
}
