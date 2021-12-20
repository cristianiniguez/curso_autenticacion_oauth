import dotenv from 'dotenv';

dotenv.config();

const config = {
  authJwtSecret: process.env.AUTH_JWT_SECRET as string,
};

export default config;
