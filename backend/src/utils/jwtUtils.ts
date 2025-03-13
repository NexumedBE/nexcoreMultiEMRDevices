import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

/**
 * Generate a JWT token
 * @param payload - The payload to embed in the token
 * @returns A signed JWT token
 */
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' }); // This is set top 30 days, but can be changed if needed.  Will see about a month when month has 31 dasy for example
};

/**
 * Verify a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded payload if valid, or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload | string;
  } catch (err) {
    return null; 
  }
};
