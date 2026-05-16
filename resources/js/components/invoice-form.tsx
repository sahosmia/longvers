import { useForm } from '@inertiajs/react';
import { useState, useMemo } from "react";
import { Search, Package, Trash2, Printer, Calendar, CreditCard, Users, UserPlus, Building2 } from "lucide-react";
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    category_id: number;
    category: Category;
    price: number;
}

export interface Client {
    id: number;
    name: string;
    phone: string;
}

export interface Outlet {
    id: number;
    name: string;
}

export interface InvoiceItem {
    productId: number;
    name: string;
    price: number;
    qty: number;
}

export interface Invoice {
    id?: number;
    invoice_uuid: string;
    outlet_id: number;
    date: string;
    client_id: number | string | null;
    total: number;
    paid: string | number;
    due: number;
    status: string;
    method: string;
    remarks: string;
    items: {
        product_id: number;
        qty: number;
        price: number;
        product?: {
            name: string;
        }
    }[];
}

interface InvoiceFormProps {
    invoice?: Invoice;
    products: Product[];
    clients: Client[];
    categories: Category[];
    outlets: Outlet[];
    isEdit?: boolean;
}

const formatCurrency = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const generateInvoiceUuid = () => `INV-${Date.now().toString().slice(-8)}`;

export default function InvoiceForm({ invoice, products, clients, categories, outlets, isEdit = false }: InvoiceFormProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { data, setData, post, put, processing, errors } = useForm({
        invoice_uuid: invoice?.invoice_uuid || generateInvoiceUuid(),
        outlet_id: invoice?.outlet_id || (outlets.length > 0 ? outlets[0].id : null) as number | null,
        date: invoice?.date || new Date().toISOString().split('T')[0],
        client_id: invoice?.client_id || null as string | number | null,
        create_new_client: false,
        new_client_name: '',
        new_client_phone: '',
        new_client_address: '',
        total: invoice?.total || 0,
        paid: invoice?.paid || 0 as string | number,
        due: invoice?.due || 0,
        status: invoice?.status || 'Processing',
        method: invoice?.method || 'Cash',
        remarks: invoice?.remarks || '',
        items: invoice?.items.map(item => ({
            productId: item.product_id,
            name: item.product?.name || 'Unknown Product',
            price: Number(item.price),
            qty: item.qty
        })) || [] as InvoiceItem[],
    });

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const matchCat = selectedCategory === "All" || p.category?.name === selectedCategory;
            const matchSearch = searchTerm.length === 0 || p.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [searchTerm, selectedCategory, products]);

    const addItem = (product: Product) => {
        const existingIdx = data.items.findIndex((i) => i.productId === product.id);
        let newItems = [...data.items];

        if (existingIdx > -1) {
            newItems[existingIdx].qty += 1;
        } else {
            newItems.push({ productId: product.id, name: product.name, price: Number(product.price), qty: 1 });
        }

        const newTotal = newItems.reduce((s, i) => s + i.price * i.qty, 0);
        setData(d => ({
            ...d,
            items: newItems,
            total: newTotal,
            due: newTotal - (Number(d.paid) || 0)
        }));

        setSearchTerm("");
        setShowDropdown(false);
    };

    const updateQty = (idx: number, newQty: number) => {
        if (newQty < 1) return;
        let newItems = [...data.items];
        newItems[idx].qty = newQty;

        const newTotal = newItems.reduce((s, i) => s + i.price * i.qty, 0);
        setData(d => ({
            ...d,
            items: newItems,
            total: newTotal,
            due: newTotal - (Number(d.paid) || 0)
        }));
    };

    const removeItem = (idx: number) => {
        const newItems = data.items.filter((_, i) => i !== idx);
        const newTotal = newItems.reduce((s, i) => s + i.price * i.qty, 0);
        setData(d => ({
            ...d,
            items: newItems,
            total: newTotal,
            due: newTotal - (Number(d.paid) || 0)
        }));
    };

    const handlePaidChange = (val: string) => {
        const paid = Number(val) || 0;
        setData(d => ({
            ...d,
            paid: val,
            due: d.total - paid
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && invoice?.id) {
            put(route('invoices.update', invoice.id));
        } else {
            post(route('invoices.store'));
        }
    };

    const categoryNames = ["All", ...categories.map(c => c.name)];
    const clientOptions = clients.map(c => ({ label: `${c.name} (${c.phone})`, value: c.id }));
    const outletOptions = outlets.map(o => ({ label: o.name, value: o.id }));

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEdit ? 'Edit Invoice' : 'Create Invoice'}</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">POS — quick service entry</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-neutral-400">Invoice No.</p>
                    <Input
                        value={data.invoice_uuid}
                        onChange={e => setData('invoice_uuid', e.target.value)}
                        className="h-8 text-sm font-bold text-neutral-700 dark:text-neutral-300 font-mono text-right"
                    />
                    {errors.invoice_uuid && <p className="text-[10px] text-red-500">{errors.invoice_uuid}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5">
                        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                            <Search className="w-4 h-4" /> Add Service / Product
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {categoryNames.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { setSelectedCategory(c); setShowDropdown(true); }}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        selectedCategory === c ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search product..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            {showDropdown && (searchTerm.length > 0 || selectedCategory !== "All") && (
                                <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
                                    {filtered.length === 0 ? (
                                        <div className="p-4 text-sm text-neutral-400 text-center">No products found</div>
                                    ) : (
                                        filtered.slice(0, 20).map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => addItem(p)}
                                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left border-b border-neutral-50 dark:border-neutral-800 last:border-0"
                                            >
                                                <div>
                                                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{p.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-blue-600">{formatCurrency(Number(p.price))}</span>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Invoice Items ({data.items.length})</h3>
                            {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
                        </div>
                        {data.items.length === 0 ? (
                            <div className="p-10 text-center">
                                <Package className="w-10 h-10 text-neutral-200 dark:text-neutral-800 mx-auto mb-2" />
                                <p className="text-sm text-neutral-400">No items added yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                                            <th className="text-left px-5 py-2.5 font-semibold">#</th>
                                            <th className="text-left px-3 py-2.5 font-semibold">Service</th>
                                            <th className="text-center px-3 py-2.5 font-semibold w-24">Qty</th>
                                            <th className="text-right px-3 py-2.5 font-semibold w-28">Price</th>
                                            <th className="text-right px-3 py-2.5 font-semibold w-28">Total</th>
                                            <th className="text-center px-3 py-2.5 font-semibold w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item, idx: number) => (
                                            <tr key={idx} className="border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                <td className="px-5 py-3 text-neutral-400 font-mono text-xs">{idx + 1}</td>
                                                <td className="px-3 py-3">
                                                    <div className="font-medium text-neutral-800 dark:text-neutral-200">{item.name}</div>
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button type="button" onClick={() => updateQty(idx, item.qty - 1)} className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">−</button>
                                                        <span className="w-8 font-semibold text-neutral-800 dark:text-neutral-200">{item.qty}</span>
                                                        <button type="button" onClick={() => updateQty(idx, item.qty + 1)} className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">+</button>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-right font-medium">{formatCurrency(item.price)}</td>
                                                <td className="px-3 py-3 text-right font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(item.price * item.qty)}</td>
                                                <td className="px-3 py-3 text-center">
                                                    <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-red-400 hover:text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Outlet
                        </h3>
                        <SearchableSelect
                            options={outletOptions}
                            value={data.outlet_id}
                            onChange={(val) => setData('outlet_id', Number(val))}
                            placeholder="Select Outlet"
                            error={errors.outlet_id}
                        />
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Client
                            </h3>
                            {!isEdit && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="create_new_client"
                                        checked={data.create_new_client}
                                        onCheckedChange={(checked) => setData('create_new_client', !!checked)}
                                    />
                                    <Label htmlFor="create_new_client" className="text-xs font-medium cursor-pointer">New Client</Label>
                                </div>
                            )}
                        </div>

                        {!data.create_new_client ? (
                            <div>
                                <SearchableSelect
                                    options={clientOptions}
                                    value={data.client_id}
                                    onChange={(val) => setData('client_id', val)}
                                    placeholder="Select Client"
                                    error={errors.client_id}
                                />
                            </div>
                        ) : (
                            <div className="space-y-3 p-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20">
                                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                                    <UserPlus className="w-3 h-3" /> Inline Client Creation
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new_client_name" className="text-[10px] uppercase tracking-wider text-neutral-500">Name</Label>
                                    <Input
                                        id="new_client_name"
                                        value={data.new_client_name}
                                        onChange={e => setData('new_client_name', e.target.value)}
                                        placeholder="Client Name"
                                        className="h-9 text-xs"
                                    />
                                    {errors.new_client_name && <p className="text-[10px] text-red-500">{errors.new_client_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new_client_phone" className="text-[10px] uppercase tracking-wider text-neutral-500">Phone</Label>
                                    <Input
                                        id="new_client_phone"
                                        value={data.new_client_phone}
                                        onChange={e => setData('new_client_phone', e.target.value)}
                                        placeholder="Phone Number"
                                        className="h-9 text-xs"
                                    />
                                    {errors.new_client_phone && <p className="text-[10px] text-red-500">{errors.new_client_phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new_client_address" className="text-[10px] uppercase tracking-wider text-neutral-500">Address (Optional)</Label>
                                    <Input
                                        id="new_client_address"
                                        value={data.new_client_address}
                                        onChange={e => setData('new_client_address', e.target.value)}
                                        placeholder="Address"
                                        className="h-9 text-xs"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2"><Calendar className="w-4 h-4" /> Order Details</h3>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm bg-transparent dark:text-neutral-100"
                            required
                        />
                         <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm bg-transparent dark:text-neutral-100"
                        >
                            <option value="Processing">Processing</option>
                            <option value="In House">In House</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment</h3>
                        <div className="flex gap-2">
                            {['Cash', 'Bkash', 'Bank'].map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setData('method', m)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${data.method === m ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            placeholder="Paid Amount"
                            value={data.paid}
                            onChange={e => handlePaidChange(e.target.value)}
                            className="w-full border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm bg-transparent dark:text-neutral-100"
                        />
                    </div>

                    <div className="bg-neutral-900 dark:bg-neutral-100 rounded-2xl p-5 text-white dark:text-neutral-900">
                        <h3 className="text-sm font-semibold text-neutral-400 dark:text-neutral-600 mb-4">Invoice Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(data.total)}</span></div>
                            <div className="flex justify-between text-emerald-400"><span>Paid</span><span>{formatCurrency(Number(data.paid) || 0)}</span></div>
                            <div className="flex justify-between text-red-400"><span>Due</span><span>{formatCurrency(data.due)}</span></div>
                            <div className="border-t border-white/10 dark:border-neutral-200 pt-2 mt-2 flex justify-between text-lg font-bold">
                                <span>Total</span><span className="text-blue-400 dark:text-blue-600">{formatCurrency(data.total)}</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50"
                        >
                            <Printer className="w-4 h-4 inline mr-2" /> {processing ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Save & Print')}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
