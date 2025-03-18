import { User } from "../entities/user.entity.js";

export interface UserAuthenticationService {
  getUserFromPasswordCredential(id: string, password: string): Promise<User | null>;
}
