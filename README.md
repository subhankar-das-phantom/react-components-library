React Component Showcase: InputField & DataTable

This project is a modern, feature-rich demonstration of two reusable React components:

InputField – a versatile and accessible input component

DataTable – a powerful table component with sorting, selection, and pagination

The application is built with a clean architecture, focusing on scalability, accessibility, and a beautiful user experience with smooth animations powered by Framer Motion.

✨ Live Demo (optional: add deployment link or screenshot here)

✨ Key Features

Two Core Components – A highly customizable InputField and a flexible DataTable

Dark Mode – Seamless theme switching with persistent user preference (localStorage)

Interactive UI – Smooth animations & transitions powered by Framer Motion

Form Validation – Client-side validation in the "Add New Member" form

Dynamic Data Table – Column sorting, row selection, and pagination

Accessibility – ARIA labels, color contrast, and focus management

Component-Based Architecture – Clean separation of concerns for scalability

🛠️ Tech Stack

React 18 – UI library

TypeScript – Static typing

Vite – Lightning-fast build tool & dev server

Tailwind CSS – Utility-first styling

Framer Motion – Declarative animations

Storybook – Component documentation & isolated development

Vitest + Testing Library – Unit testing framework

ESLint & Prettier – Code quality & formatting

🚀 Getting Started
Prerequisites

Make sure you have installed:

Node.js (v18.x or newer)

npm or yarn

Installation

Clone the repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name


Install dependencies:

# Using npm
npm install

# Using yarn
yarn install

Running the Application

Start the development server (default: http://localhost:5173):

npm run dev


Run Storybook (default: http://localhost:6006):

npm run storybook

📁 Project Structure
/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── DataTable/
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTable.stories.tsx
│   │   │   └── DataTable.test.tsx
│   │   └── InputField/
│   │       ├── InputField.tsx
│   │       ├── InputField.stories.tsx
│   │       └── InputField.test.tsx
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles and Tailwind directives
│   └── main.tsx                # Application entry point
├── .eslintrc.cjs               # ESLint configuration
├── package.json                # Project dependencies & scripts
├── postcss.config.js           # PostCSS configuration (Tailwind)
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation

📦 Available Scripts
npm run dev             # Starts development server with Vite
npm run build           # Bundles the app for production
npm run lint            # Runs ESLint for code quality
npm run preview         # Serves the production build locally
npm run storybook       # Starts Storybook for isolated component dev
npm run build-storybook # Builds a static Storybook site
npm run test            # Runs unit tests with Vitest

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a PR.

📄 License

This project is licensed under the MIT License.
See the LICENSE file for details.