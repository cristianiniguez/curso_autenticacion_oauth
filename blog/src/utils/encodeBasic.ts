function encodeBasic(username: string, password: string) {
  return Buffer.from(`${username}:${password}`).toString('base64');
}

module.exports = encodeBasic;
