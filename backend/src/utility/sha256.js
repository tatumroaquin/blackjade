import { createHash } from 'crypto';

export default function sha256(...args) {
  const SHA256 = createHash('sha256');
  SHA256.update(
    args
      .map((arg) => JSON.stringify(arg))
      .sort()
      .join(' ')
  );
  return SHA256.digest('hex')
}
