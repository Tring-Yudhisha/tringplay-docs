import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import clsx from 'clsx';

export default function Layout({ children, sidebarItems }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
            />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 p-4 md:pl-8">
                <Sidebar items={sidebarItems} isOpen={isSidebarOpen} />
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
                    <div className="mx-auto w-full min-w-0">
                        {children}
                    </div>
                    {/* Right Sidebar Placeholder (TOC) */}
                    <div className="hidden text-sm xl:block">
                        {/* <TOC /> */}
                    </div>
                </main>
            </div>
        </div>
    );
}
