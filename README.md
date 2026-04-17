# Jon Branding Web

Premium web platform for Jon Branding agency, built with Next.js and Firebase.

## 🚀 Features

- **Next.js 14**: Latest stable React framework.
- **Tailwind CSS**: Modern utility-first styling.
- **Firebase Hosting**: High-performance global deployment.
- **Sanity CMS**: Structured content management for professional branding.
- **Autonomous Deployment**: Integrated PowerShell scripts for local development sync.

## 🛠 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Firebase CLI (`npm install -g firebase-tools`)
- PowerShell (for automation scripts)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in Sanity and Firebase credentials.

### Development

Run the development server:
```bash
npm run dev
```

### Deployment

Deploy to Firebase:
```bash
firebase deploy
```

For automatic watcher and deploy on save (Windows):
```powershell
./scripts/start_autodeploy.ps1
```

## 📂 Project Structure

- `src/app`: Next.js App Router pages.
- `src/components`: Reusable UI components.
- `src/locales`: Multi-language support (JSON).
- `scripts/`: Development and deployment automation.
- `audit/`: Site audits and migration logs.

## 🛡 License

Proprietary - Jon Branding Agency.
