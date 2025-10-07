import jwt, { SignOptions, JwtPayload, Secret } from 'jsonwebtoken';

type StringValue = `${number}${'d' | 'h' | 'm' | 's'}` | `${number}`;

interface TokenPayload extends JwtPayload {
  userId: string;
  userType: string;
}

export class TokenService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET ?? '';
  private static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? '';
  private static readonly JWT_EXPIRY = (process.env.JWT_EXPIRY ?? '1h') as StringValue;
  private static readonly JWT_REFRESH_EXPIRY = (process.env.JWT_REFRESH_EXPIRY ?? '7d') as StringValue;

  private static getSignOptions(expiresIn: StringValue): SignOptions {
    return {
      algorithm: 'HS256' as const,
      expiresIn
    };
  }

  static validateSecrets(): void {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT secrets must be configured in environment variables');
    }
  }

  static generateAccessToken(payload: Pick<TokenPayload, 'userId' | 'userType'>): string {
    this.validateSecrets();
    return jwt.sign(
      payload,
      this.JWT_SECRET as Secret,
      this.getSignOptions(this.JWT_EXPIRY)
    );
  }

  static generateRefreshToken(payload: Pick<TokenPayload, 'userId' | 'userType'>): string {
    this.validateSecrets();
    return jwt.sign(
      payload,
      this.JWT_REFRESH_SECRET as Secret,
      this.getSignOptions(this.JWT_REFRESH_EXPIRY)
    );
  }

  static verifyAccessToken(token: string): TokenPayload {
    this.validateSecrets();
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET as Secret);
      if (typeof decoded === 'string' || !('userId' in decoded) || !('userType' in decoded)) {
        throw new Error('Invalid token payload');
      }
      return decoded as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw error;
      }
      throw error instanceof Error ? error : new Error('Invalid token');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    this.validateSecrets();
    try {
      const decoded = jwt.verify(token, this.JWT_REFRESH_SECRET as Secret);
      if (typeof decoded === 'string' || !('userId' in decoded) || !('userType' in decoded)) {
        throw new Error('Invalid refresh token payload');
      }
      return decoded as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw error;
      }
      throw error instanceof Error ? error : new Error('Invalid refresh token');
    }
  }

  static isTokenExpired(decodedToken: TokenPayload): boolean {
    const exp = decodedToken.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  static isTokenExpiringSoon(decodedToken: TokenPayload, thresholdSeconds = 300): boolean {
    const exp = decodedToken.exp;
    if (!exp) return true;
    return (exp * 1000) - Date.now() < thresholdSeconds * 1000;
  }
}
