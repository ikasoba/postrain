import { err, ok } from "./Result.js";

export const enum BasicAuthErrorKind {
  InvalidAuthType,
  InvalidPayload
}

export interface IBasicAuthorizer<T> {
  (username: string, password: string): Promise<T>
}

export async function basicAuth<T>(authorizer: IBasicAuthorizer<T>, payload: string) {
  const matches = payload.match(/^basic\s+(.+)$/i);
  if (matches == null || matches.length < 2) {
    return err(BasicAuthErrorKind.InvalidAuthType);
  }

  let cred: string[];

  try {
    cred = Buffer.from(matches[1], "base64").toString("utf-8").split(":");
    if (cred.length != 2) {
      return err(BasicAuthErrorKind.InvalidPayload);
    }
  } catch {
    return err(BasicAuthErrorKind.InvalidPayload);
  }

  return ok(await authorizer(cred[0], cred[1]));
}
