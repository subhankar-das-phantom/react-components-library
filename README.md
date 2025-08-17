# React Component Showcase: InputField & DataTable

This project is a modern, feature-rich demonstration of two reusable React components:

-   **InputField** – a versatile and accessible input component
-   **DataTable** – a powerful table component with sorting, selection, and pagination

The application is built with a clean architecture, focusing on scalability, accessibility, and a beautiful user experience with smooth animations powered by Framer Motion.

✨ Live Demo (optional: add deployment link or screenshot here)

✨ Key Features

-   **Two Core Components** – A highly customizable InputField and a flexible DataTable
-   **Dark Mode** – Seamless theme switching with persistent user preference (localStorage)
-   **Interactive UI** – Smooth animations & transitions powered by Framer Motion
-   **Form Validation** – Client-side validation in the "Add New Member" form
-   **Dynamic Data Table** – Column sorting, row selection, and pagination
-   **Accessibility** – ARIA labels, color contrast, and focus management
-   **Component-Based Architecture** – Clean separation of concerns for scalability

🛠️ Tech Stack

-   **React 18** – UI library
-   **TypeScript** – Static typing
-   **Vite** – Lightning-fast build tool & dev server
-   **Tailwind CSS** – Utility-first styling
-   **Framer Motion** – Declarative animations
-   **Storybook** – Component documentation & isolated development
-   **Vitest + Testing Library** – Unit testing framework
-   **ESLint & Prettier** – Code quality & formatting

🚀 Getting Started

### Prerequisites

Make sure you have installed:

-   Node.js (v18.x or newer)
-   npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Running the Application

Start the development server (default: http://localhost:5173):

```bash
npm run dev
```

Run Storybook (default: http://localhost:6006):

```bash
npm run storybook
```

📁 Project Structure

```
.
├── public/
│   └── vite.svg                # Vite logo
├── src/
│   ├── assets/
│   │   └── react.svg           # React logo
│   ├── components/             # Reusable UI components
│   │   ├── DataTable/
│   │   │   ├── DataTable.stories.tsx   # Storybook stories for DataTable
│   │   │   ├── DataTable.test.tsx      # Unit tests for DataTable
│   │   │   ├── DataTable.tsx           # DataTable component implementation
│   │   │   └── index.ts                # Export for DataTable
│   │   └── InputField/
│   │       ├── InputField.stories.tsx  # Storybook stories for InputField
│   │       ├── InputField.test.tsx     # Unit tests for InputField
│   │       ├── InputField.tsx          # InputField component implementation
│   │       └── index.ts                # Export for InputField
│   ├── stories/                # Storybook example stories and assets
│   │   ├── assets/             # Images and assets for Storybook stories
│   │   └── ...                 # Other Storybook example files (Button, Header, Page stories/components)
│   ├── test/
│   │   └── setup.ts            # Vitest setup file
│   ├── App.css                 # Main application CSS
│   ├── App.test.tsx            # Main application tests
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles and Tailwind directives
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite environment type definitions
├── .storybook/                 # Storybook configuration files
│   ├── main.ts
│   ├── preview.ts
│   └── vitest.setup.ts
├── .gitignore                  # Git ignore file
├── eslint.config.js            # ESLint configuration
├── index.html                  # Main HTML file
├── package.json                # Project dependencies & scripts
├── package-lock.json           # Dependency lock file
├── README.md                   # Project documentation
├── tsconfig.app.json           # TypeScript configuration for application
├── tsconfig.json               # Base TypeScript configuration
├── tsconfig.node.json          # TypeScript configuration for Node.js environment
├── vite.config.ts              # Vite configuration
└── vitest.shims.d.ts           # Vitest shims for TypeScript
```

📦 Available Scripts

-   `npm run dev`             # Starts development server with Vite
-   `npm run build`           # Bundles the app for production
-   `npm run lint`            # Runs ESLint for code quality
-   `npm run preview`         # Serves the production build locally
-   `npm run storybook`       # Starts Storybook for isolated component dev
-   `npm run build-storybook` # Builds a static Storybook site
-   `npm run test`            # Runs unit tests with Vitest

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a PR.

📄 License

This project is licensed under the MIT License.
See the LICENSE file for details.
