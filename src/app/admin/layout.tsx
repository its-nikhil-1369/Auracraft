import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const adminEntry = await isAdmin();

    if (!adminEntry) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex pt-20">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
