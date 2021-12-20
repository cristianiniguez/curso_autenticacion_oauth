function generateRandomString(length) {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz132456789';
  const randomString = Array(length)
    .fill((_) => possibleChars.charAt(Math.floor(Math.random() * possibleChars.length)))
    .join('');
  return randomString;
}

module.exports = generateRandomString;
