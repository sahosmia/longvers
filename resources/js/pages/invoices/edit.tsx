import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InvoiceForm, { Category, Product, Client, Outlet, Invoice } from '@/components/invoice-form';

interface EditInvoiceProps {
    invoice: Invoice;
    products: Product[];
    clients: Client[];
    categories: Category[];
    outlets: Outlet[];
}

export default function EditInvoice({ invoice, products, clients, categories, outlets }: EditInvoiceProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Invoices',
            href: '/invoices',
        },
        {
            title: 'Edit Invoice',
            href: `/invoices/${invoice.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice ${invoice.invoice_uuid} - Laurnverse`} />
            <InvoiceForm
                invoice={invoice}
                products={products}
                clients={clients}
                categories={categories}
                outlets={outlets}
                isEdit={true}
            />
        </AppLayout>
    );
}
