import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

export default function Sidebar({ items, isOpen }) {
    return (
        <aside
            className={clsx(
                "fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-gray-200 md:sticky md:block",
                isOpen && "block" // Force show on mobile if open
            )}
        >
            <div className="relative overflow-hidden py-6 pr-6 lg:py-8">
                <div className="px-4 md:px-6">
                    {Object.entries(items).map(([category, links]) => (
                        <div key={category} className="pb-4">
                            <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold text-white">
                                {category}
                            </h4>
                            <div className="grid grid-flow-row auto-rows-max text-sm">
                                {links.map((link) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) =>
                                            clsx(
                                                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                                                isActive
                                                    ? "font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                                            )
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
