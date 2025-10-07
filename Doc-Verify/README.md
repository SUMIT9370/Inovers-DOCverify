<<<<<<< HEAD
# DOCverify - Document Verification System

DOCverify is a secure document verification system built with Next.js and TypeScript, featuring multi-portal authentication for different user types (Students, Institutes, Companies, Government, and Admin).

## Features

- 🔐 Multi-portal Authentication System
  - Student Portal
  - Institute Portal
  - Company Portal
  - Government Portal
  - Admin Portal
- 🛡️ Secure JWT Authentication
  - Access & Refresh Tokens
  - Token Expiry Management
- 📄 Document Verification
  - File Upload & Management
  - Document Status Tracking
  - Real-time Verification Process
- 💼 Dashboard for Each User Type
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.x or later
- npm or yarn package manager
- Git

## Environment Setup

1. Create a `.env` file in the root directory:
```env
# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Add other environment variables as needed
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/SUMIT9370/Inovers-DOCverify.git
cd Inovers-DOCverify/Doc-Verify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## GitHub Codespaces Development

1. Click the "Code" button on the repository
2. Select "Open with Codespaces"
3. Once the environment is ready, open a terminal and run:
```bash
cd Doc-Verify
npm install
npm run dev
```

## Project Structure

```
Doc-Verify/
├── src/
│   ├── components/     # React components
│   │   ├── UI/        # Reusable UI components
│   │   └── Figma/     # Figma-exported components
│   ├── pages/         # Next.js pages
│   ├── server/        # Server-side code
│   │   └── utils/     # Utilities (JWT, etc.)
│   ├── styles/        # Global styles
│   └── hooks/         # Custom React hooks
├── public/            # Static files
└── ... config files
```

## Security Features

- ✅ JWT-based Authentication with Refresh Tokens
- 🔒 Secure Password Handling
- 🛑 Rate Limiting
- 🛡️ CSRF Protection
- 🔍 Input Validation

## Built With

- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Sumit - [Your Contact Information]
Project Link: https://github.com/SUMIT9370/Inovers-DOCverify
=======
# Doc Verify

>>>>>>> 35c628e86430f42a57242584cbfe0bbf0c88b4f6
