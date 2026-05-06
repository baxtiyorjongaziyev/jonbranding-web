<<<<<<< HEAD
# Contribution Guidelines for jonbranding-web

Thank you for your interest in contributing to the **jonbranding-web** project! These guidelines are designed to ensure a smooth and efficient collaboration.

## Getting Started
1. **Fork the repository**: Click on the "Fork" button on the repository’s page.
2. **Clone your fork**: Use the command `git clone https://github.com/<your-username>/jonbranding-web.git`. Replace `<your-username>` with your GitHub username.
3. **Create a new branch**: It’s best practice to create a new branch for your changes. Use the command `git checkout -b your-branch-name`.

## Making Changes
- Follow the project's coding style and conventions.
- Update relevant documentation as needed.
- Write clear, concise commit messages (e.g., "Fix typo in installation instructions").
- Ensure your changes work well with existing functionality.

## Running the Project Locally
To run the project locally:
1. Install the dependencies: `npm install` or `yarn install`.
2. Start the development server: `npm run dev` or `yarn dev`.

Visit `http://localhost:3000` to view the project in your web browser.

## Testing Your Changes
- If applicable, add unit tests to cover your changes and ensure everything works as intended.
- Run the tests using `npm test` or `yarn test` to confirm.

## Submitting Your Changes
1. **Push your changes**: Use `git push origin your-branch-name` to push your changes to your fork.
2. **Create a Pull Request**: Go to the original repository and click on the "Pull Requests" tab. Click the "New Pull Request" button and choose your branch.
3. **Fill out the Pull Request Template**: If applicable, fill in any required information to help the maintainers review your changes swiftly.

## Code of Conduct
We expect all contributors to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expected behavior.

Thank you for your contributions! We appreciate your help in improving the **jonbranding-web** project!
=======
# Contributing to JonBranding-Web

Welcome to the frontend development of JonBranding! This project powers our digital presence and client interactions.

## 🚀 Getting Started

1. **Clone Locally**: 
   ```bash
   git clone https://github.com/baxtiyorjongaziyev/jonbranding-web.git
   cd jonbranding-web
   ```
2. **Setup Environment**:
   ```bash
   npm install
   cp .env.example .env.local
   ```
   *Fill in your .env.local with valid credentials.*
3. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🛠 Development Guidelines

### Code Style
- We use **Prettier** for formatting.
- We use **ESLint** for linting.
- Follow **React best practices** and **TailwindCSS** conventions.

### Branching Strategy
- `main`: Production-ready code.
- `dev`: Active development and integration.
- `feature/*`: New UI features or sections.
- `bugfix/*`: Bug fixes.

### Commit Messages
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: ...` for new features.
- `fix: ...` for bug fixes.
- `docs: ...` for documentation.
- `style: ...` for UI/CSS changes.

## 🧪 Testing

Before submitting a Pull Request, ensure that the build succeeds:
```bash
npm run build
```

## 📬 Submitting a Pull Request

1. Create a branch for your changes.
2. Commit your changes with descriptive messages.
3. Push to your fork.
4. Open a Pull Request against the `dev` branch.
5. Ensure the Vercel/Firebase preview build passes.

---

*Let's build a premium web experience together.*
>>>>>>> 1a2dc9d (feat: finalize website audit - security, performance, and documentation)
