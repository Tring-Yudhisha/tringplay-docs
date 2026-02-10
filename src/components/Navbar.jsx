import { Link } from 'react-router-dom';
import { Menu, X, Github } from 'lucide-react';
import { useState } from 'react';
import logo from "../assets/tringplay.svg"
export default function Navbar({ onMenuClick, isSidebarOpen }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 transition-colors">
            <div className="container flex h-14 items-center pl-4 pr-14 md:pl-8">
                <button
                    className="mr-2 inline-flex md:hidden items-center justify-center rounded-md p-2 text-slate-200 hover:bg-slate-800 focus:outline-none"
                    onClick={onMenuClick}
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="mr-4 flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-xl text-indigo-300">
                            <img src={logo} className='h-10' />
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {/* <Link to="/docs/getting-started" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100 text-slate-600 dark:text-slate-400">
                            Documentation
                        </Link>
                        <Link to="/docs/api-reference" className="transition-colors hover:text-slate-900 dark:hover:text-slate-100 text-slate-600 dark:text-slate-400">
                            API
                        </Link> */}
                    </nav>
                </div>

                {/* <div className="flex flex-1 items-center justify-end space-x-2">
                    <ThemeToggle />
                    <a href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Github size={20} />
                    </a>
                </div> */}
            </div>
        </header>
    );
}