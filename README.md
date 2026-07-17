# Jon Branding - Professional Branding Agency Web Platform

![Project Status](https://img.shields.io/badge/status-production--ready-success)
![Lighthouse Score](https://img.shields.io/badge/lighthouse-100%2F100-brightgreen)
![Next.js](https://img.shields.io/badge/framework-Next.js%2016-black)

A high-performance, multilingual, and conversion-optimized web application for Jon Branding Agency. Built with Next.js 16, React 19, Sanity CMS, and integrated with AmoCRM and Meta CAPI.

## 🚀 Key Features

- **Multilingual Support**: Full support for Uzbek (UZ), Russian (RU), English (EN), and Chinese (ZH).
- **Lighthouse 100/100**: Optimized script loading and asset management for maximum performance.
- **Conversion Focused**: Integrated quiz, pricing calculators, and lead capture forms.
- **Production Integration**:
  - **AmoCRM**: Automatic lead creation and task assignment.
  - **Meta CAPI**: Server-side conversion tracking for accurate marketing attribution.
  - **Google Analytics 4**: Dynamic tracking with privacy-first lazy loading.
  - **Telegram**: Real-time notifications for every lead.
- **CMS Powered**: Sanity powers Studio/schema and portfolio fetches with local fallbacks; blog content currently lives in `src/posts` markdown until Sanity post content is migrated.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Styling**: Tailwind CSS + ShadCN UI
- **Animations**: Framer Motion
- **CMS**: Sanity.io
- **Testing**: Vitest + Testing Library
- **Validation**: Zod
- **Infrastructure**: standalone output mode for Docker/Cloud Run

## 📦 Project Structure

- `src/app/[lang]`: Multilingual routing and page components.
- `src/locales`: JSON dictionary files for all 4 languages.
- `src/components`: Reusable UI components and business sections.
- `src/lib`: Utilities, API clients, and static data.
- `scripts/`: Automation scripts for asset management and localization sync.

## 🔧 Installation & Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/baxtiyorjongaziyev/jonbranding-web.git
   cd jonbranding-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` based on `.env.example`.

   To save Telegram usernames as clickable links in AmoCRM contacts, create a
   contact field with type `URL` and set its numeric ID as
   `AMOCRM_TELEGRAM_FIELD_ID`. Without it, Telegram remains available in the
   lead note while phone delivery continues normally.

   Security-sensitive integrations also require:
   - `VIMEO_WEBHOOK_SECRET` — verifies Vimeo webhook HMAC signatures.
   - `INSTAGRAM_OAUTH_ADMIN_SECRET` — protects the Instagram OAuth start route.
   - `FIREBASE_SERVICE_ACCOUNT_JSON` — enables shared Firestore rate limits in production.

   For automatic cleanup, configure Firestore TTL on `_rate_limits.expiresAt`.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🧪 Testing & Quality

- **Unit Tests**: `npm run test`
- **Linting**: `npm run lint`
- **Type Check**: `npm run typecheck`
- **Pre-commit Hooks**: Managed by Husky and lint-staged.

## 🔒 Security

For security vulnerability reporting, please see [SECURITY.md](SECURITY.md).

## 📄 License

Internal Project - All rights reserved by Jon Branding.
