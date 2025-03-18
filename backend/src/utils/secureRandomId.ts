import crypto from "node:crypto";

export function generateSecureRandomId(size: number) {
  const buf = crypto.createHash("sha3-512").update(crypto.getRandomValues(new Uint8Array(size))).digest();
  
  return buf.toString("base64url");
}

export function generateSecureRandomIdLimited(size: number) {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(size))).toString("base64url");
}
