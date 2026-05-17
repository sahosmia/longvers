import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InvoiceForm, { Category, Product, Client, Outlet } from '@/components/invoice-form';

interface CreateInvoiceProps {
    products: Product[];
    clients: Client[];
    categories: Category[];
    outlets: Outlet[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Invoice',
        href: '/invoices/create',
    },
];

export default function CreateInvoice({ products, clients, categories, outlets }: CreateInvoiceProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />
            <InvoiceForm
                products={products}
                clients={clients}
                categories={categories}
                outlets={outlets}
            />
        </AppLayout>
    );
}
