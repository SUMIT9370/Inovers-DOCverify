// Environment variables used in the frontend
export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
};

// Validation and error messages
export const messages = {
  errors: {
    DEFAULT: 'An unexpected error occurred. Please try again.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    VALIDATION: {
      REQUIRED: 'This field is required.',
      EMAIL: 'Please enter a valid email address.',
      PASSWORD: 'Password must be at least 6 characters long.',
    },
  },
};