import React, { Suspense, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import Layout from './components/Layout';
import CodeBlock from './components/CodeBlock';
import { ThemeProvider } from './context/ThemeContext';


const modules = import.meta.glob('./docs/*.mdx');

const lazyDocMap = {};
const sidebarItems = { "General": [], "API": [] };

for (const path in modules) {
  const name = path.split('/').pop().replace('.mdx', '');
  const label = name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const link = { path: `/docs/${name}`, label };

  // Map the lazy component
  lazyDocMap[name] = React.lazy(modules[path]);

  // Sort into sidebar categories
  if (name === 'authentication-flow' || name === 'media-flow') {
    sidebarItems["API"].push(link);
  } else if (name !== 'api-reference') {
    sidebarItems["General"].push(link);
  }
}

// Custom sort order for General items
const generalOrder = ['getting-started', 'core-concepts', 'architecture', 'authentication'];
sidebarItems["General"].sort((a, b) => {
  const slugA = a.path.split('/').pop();
  const slugB = b.path.split('/').pop();
  return generalOrder.indexOf(slugA) - generalOrder.indexOf(slugB);
});

// Flatten items for pagination
const navItems = [...sidebarItems["General"], ...sidebarItems["API"]];

// MDX Components mapping
const components = {
  pre: ({ children }) => <>{children}</>,
  code: CodeBlock,
};

/**
 * DocPage Component
 * Uses the URL param to select the correct pre-defined lazy component.
 */
function DocPage() {
  const { slug } = useParams(); // Grabs the '*' from /docs/*
  const Content = lazyDocMap[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const currentIndex = navItems.findIndex(item => item.path === `/docs/${slug}`);
  const prev = navItems[currentIndex - 1];
  const next = navItems[currentIndex + 1];

  if (!Content) {
    return <div className="p-8">404 - Document not found</div>;
  }

  return (
    <div className="
    prose max-w-none 
    /* Base Text Color */
    text-slate-800 dark:text-slate-200 
    
    /* Heading Colors */
    prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400
    
    /* Paragraph Colors */
    prose-p:text-gray-600 dark:prose-p:text-gray-400
    
    /* Link Colors */
    prose-a:text-pink-600 hover:prose-a:text-pink-500
    
    /* Bold text (strong) */
    prose-strong:text-slate-900 dark:prose-strong:text-white
  ">      {/* The 'key' prop on Suspense ensures that when the slug changes, 
        the old content is fully unmounted and the new one starts fresh.
      */}
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[80vh] w-[70vw]">
            {/* Professional Spinner - Gray track with Black spinning head */}
            <svg className="animate-spin h-10 w-10 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        }
        key={slug}
      >
        <Content />
      </Suspense>

      <div className="mt-10 flex justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
        {prev ? (
          <Link to={prev.path} className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            {/* <span className="text-xs text-slate-500 font-normal mb-1">Previous</span> */}
            <span>&larr; {prev.label}</span>
          </Link>
        ) : <div />}
        {next && (
          <Link to={next.path} className="flex flex-col items-end text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">
            {/* <span className="text-xs text-slate-500 font-normal mb-1">Next</span> */}
            <span>{next.label} &rarr;</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MDXProvider components={components}>
          <Layout sidebarItems={sidebarItems}>
            <Routes>
              {/* Redirect root to your first doc */}
              <Route path="/" element={<Navigate to="/docs/getting-started" replace />} />

              {/* The :slug parameter allows us to capture the filename 
                 and pass it directly to DocPage.
              */}
              <Route path="/docs/:slug" element={<DocPage />} />

              {/* Catch-all for 404s */}
              <Route path="*" element={<div className="p-8">Page Not Found</div>} />
            </Routes>
          </Layout>
        </MDXProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;