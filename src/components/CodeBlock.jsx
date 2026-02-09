import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export default function CodeBlock({ children, className }) {
    const language = className ? className.replace(/language-/, '') : 'javascript';
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative group rounded-md overflow-hidden my-4">
            <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                    onClick={onCopy}
                    className="rounded-md border border-gray-600 bg-gray-700/50 p-1.5 text-gray-300 hover:bg-gray-700 hover:text-white"
                    aria-label="Copy code"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: '0.375rem', padding: '1.5rem' }}
                wrapLongLines={true}
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}
