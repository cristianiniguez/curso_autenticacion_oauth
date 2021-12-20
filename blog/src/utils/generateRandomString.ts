function generateRandomString(length: number) {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz132456789';
  const randomString = Array(length)
    .fill(() => possibleChars.charAt(Math.floor(Math.random() * possibleChars.length)))
    .join('');
  return randomString;
}

module.exports = generateRandomString;
