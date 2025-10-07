export class PasswordValidator {
  static readonly MIN_LENGTH = 8;
  static readonly REQUIRES_UPPERCASE = true;
  static readonly REQUIRES_LOWERCASE = true;
  static readonly REQUIRES_NUMBER = true;
  static readonly REQUIRES_SPECIAL = true;
  static readonly MAX_LENGTH = 128;

  static validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.MIN_LENGTH) {
      errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }

    if (password.length > this.MAX_LENGTH) {
      errors.push(`Password must not exceed ${this.MAX_LENGTH} characters`);
    }

    if (this.REQUIRES_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.REQUIRES_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.REQUIRES_NUMBER && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.REQUIRES_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password must not contain repeating characters');
    }

    if (/^(password|123456|admin|qwerty)/i.test(password)) {
      errors.push('Password is too common or easily guessable');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static generateRequirementsMessage(): string {
    return `Password requirements:
      - Minimum ${this.MIN_LENGTH} characters
      - Maximum ${this.MAX_LENGTH} characters
      ${this.REQUIRES_UPPERCASE ? '- At least one uppercase letter' : ''}
      ${this.REQUIRES_LOWERCASE ? '- At least one lowercase letter' : ''}
      ${this.REQUIRES_NUMBER ? '- At least one number' : ''}
      ${this.REQUIRES_SPECIAL ? '- At least one special character' : ''}
      - Must not contain repeating characters
      - Must not be a common password`;
  }
}