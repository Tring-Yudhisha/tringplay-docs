import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  Link,
} from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import Layout from './components/Layout';
import CodeBlock from './components/CodeBlock';
import { ThemeProvider } from './context/ThemeContext';

const modules = import.meta.glob('./docs/*.mdx');

const lazyDocMap = {};
const sidebarItems = { General: [], API: [] };

// -------------------------
// Build sidebar + lazy map
// -------------------------
for (const path in modules) {
  const name = path.split('/').pop().replace('.mdx', '');
  const label = name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const link = { path: `/docs/${name}`, label };

  lazyDocMap[name] = React.lazy(modules[path]);

  if (name === 'authentication-flow' || name === 'media-flow' || name === 'subscription-flow') {
    sidebarItems.API.push(link);
  } else if (name !== 'api-reference') {
    sidebarItems.General.push(link);
  }
}

// -------------------------
// Sorting helper
// -------------------------
const sortByOrder = (order) => (a, b) => {
  const slugA = a.path.split('/').pop();
  const slugB = b.path.split('/').pop();

  const indexA = order.indexOf(slugA);
  const indexB = order.indexOf(slugB);

  if (indexA === -1 && indexB === -1) return 0;
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};

// -------------------------
// Custom sort orders
// -------------------------
const generalOrder = [
  'getting-started',
  'core-concepts',
  'architecture',
  'authentication',
];

const apiOrder = [
  'media-flow',
  'authentication-flow',
  'subscription-flow'
];

sidebarItems.General.sort(sortByOrder(generalOrder));
sidebarItems.API.sort(sortByOrder(apiOrder));

// -------------------------
// Flatten for pagination
// -------------------------
const navItems = [
  ...sidebarItems.General,
  ...sidebarItems.API,
];

// -------------------------
// MDX components
// -------------------------
const components = {
  pre: ({ children }) => <>{children}</>,
  code: CodeBlock,
};

// =====================================================
// DocPage
// =====================================================
function DocPage() {
  const { slug } = useParams();
  const Content = lazyDocMap[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const currentIndex = navItems.findIndex(
    (item) => item.path === `/docs/${slug}`
  );

  const prev = navItems[currentIndex - 1];
  const next = navItems[currentIndex + 1];

  if (!Content) {
    return <div className="p-8">404 – Document not found</div>;
  }

  return (
    <div
      className="
        prose max-w-none
        text-slate-800 dark:text-slate-200
        prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400
        prose-p:text-gray-600 dark:prose-p:text-gray-400
        prose-a:text-pink-600 hover:prose-a:text-pink-500
        prose-strong:text-slate-900 dark:prose-strong:text-white
      "
    >
      <Suspense
        key={slug}
        fallback={
          <div className="flex items-center justify-center min-h-[80vh] w-[70vw]">
            <svg
              className="animate-spin h-10 w-10 text-black dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        }
      >
        <Content />
      </Suspense>

      <div className="mt-10 flex justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
        {prev ? (
          <Link
            to={prev.path}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            ← {prev.label}
          </Link>
        ) : (
          <div />
        )}

        {next && (
          <Link
            to={next.path}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {next.label} →
          </Link>
        )}
      </div>
    </div>
  );
}

// =====================================================
// App
// =====================================================
function App() {
  return (
    <ThemeProvider>
      <Router>
        <MDXProvider components={components}>
          <Layout sidebarItems={sidebarItems}>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/docs/getting-started" replace />}
              />
              <Route path="/docs/:slug" element={<DocPage />} />
              <Route path="*" element={<div className="p-8">Page Not Found</div>} />
            </Routes>
          </Layout>
        </MDXProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;