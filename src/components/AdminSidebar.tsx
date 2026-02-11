'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/products', label: 'Manage Products' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/users', label: 'Users' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-white/10 hidden md:flex flex-col h-[calc(100vh-80px)] sticky top-20">
            <div className="p-8">
                <h2 className="text-xl font-bold tracking-tighter uppercase">Admin Panel</h2>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all relative group rounded-lg
                                ${isActive
                                    ? "text-black dark:text-white bg-gray-100 dark:bg-white/5"
                                    : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black dark:bg-white rounded-r-full" />
                            )}
                            <span className={isActive ? "ml-2" : "group-hover:ml-2 transition-all"}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
