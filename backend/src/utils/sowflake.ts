export class Snowflake {
  static generate() {
    const timestamp = BigInt(Date.now());
    const randoms = crypto.getRandomValues(new Uint8Array(2));

    return (((timestamp & (1n<<48n)-1n) << 16n) | BigInt(randoms[0] | (randoms[1] << 8)));
  }
}
