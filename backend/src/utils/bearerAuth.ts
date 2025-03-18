import { err, ok } from "./Result.js";

export const enum BearerAuthErrorKind {
  InvalidAuthType
}

export interface IBearerAuthorizer<T> {
  (token: string): Promise<T>
}

export async function bearerAuth<T>(authorizer: IBearerAuthorizer<T>, payload: string) {
  const matches = payload.match(/^bearer\s+(.+)$/i);
  if (matches == null || matches.length < 2) {
    return err(BearerAuthErrorKind.InvalidAuthType);
  }

  return ok(await authorizer(matches[1]));
}
