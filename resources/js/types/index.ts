import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';


export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}


export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Unit {
    id: number;
    name: string;
    short_name: string;
}

export interface Outlet {
    id: number;
    name: string;
    location: string;
}

export interface OutletProductPrice {
    id: number;
    outlet_id: number;
    product_id: number;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    category?: Category;
    unit_id?: number;
    unit?: Unit;
    price: number;
    outlet_prices?: OutletProductPrice[];
}

export interface Client {
    id: number;
    name: string;
    phone: string;
    address?: string;
    total_orders?: number;
    total_due?: number;
    total_paid?: number;
}

export interface InvoiceItem {
    id: number;
    invoice_id: number;
    product_id: number;
    product?: Product;
    qty: number;
    price: number;
}

export interface Invoice {
    id: number;
    invoice_uuid: string;
    date: string;
    client_id: number;
    client: Client;
    outlet_id: number;
    outlet?: Outlet;
    subtotal: number;
    discount_amount: number;
    discount_type: 'Fixed' | 'Percentage';
    total: number;
    paid: number;
    due: number;
    status: 'Pending' | 'Processing' | 'In House' | 'Delivered' | 'Cancelled';
    items?: InvoiceItem[];
}
