export function encodeBase64(data: string) {
  return btoa(String.fromCodePoint(...new TextEncoder().encode(data)));
}

export function decodeBase64(data: string) {
  return new TextDecoder().decode(new Uint8Array(atob(data).split("").map(x => x.charCodeAt(0))));
}
