import { Head, useForm } from '@inertiajs/react';
import { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Client {
    id: number;
    name: string;
    phone: string;
    address: string;
    total_orders: number;
    total_paid: number;
    total_due: number;
}

interface ClientsProps {
    clients: Client[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/clients',
    },
];

const formatCurrency = (n: number) => `৳${n.toLocaleString("en-BD")}`;

export default function Clients({ clients }: ClientsProps) {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        name: '',
        phone: '',
        address: '',
    });

    const filtered = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
    );

    const openCreateModal = () => {
        setEditingClient(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (client: Client) => {
        setEditingClient(client);
        setData({
            name: client.name,
            phone: client.phone,
            address: client.address,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient) {
            put(route('clients.update', editingClient.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('clients.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this client?')) {
            destroy(route('clients.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Clients</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{clients.length} registered clients</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
                    >
                        <Plus className="w-4 h-4" /> Add Client
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c) => (
                        <div key={c.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-lg transition-shadow duration-300 relative group">
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(c)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-blue-600"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDelete(c.id)} className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{c.name}</h4>
                                    <p className="text-xs text-neutral-400 mt-0.5">{c.phone}</p>
                                    <p className="text-xs text-neutral-400">{c.address}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{c.name.charAt(0)}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-2.5 text-center">
                                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{c.total_orders}</p>
                                    <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Orders</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2.5 text-center">
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(Number(c.total_paid))}</p>
                                    <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Paid</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2.5 text-center">
                                    <p className="text-lg font-bold text-red-500 dark:text-red-400">{formatCurrency(Number(c.total_due))}</p>
                                    <p className="text-[10px] text-red-500 font-medium uppercase tracking-wider">Due</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Client Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{editingClient ? 'Edit Client' : 'New Client'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><X className="w-5 h-5 text-neutral-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Phone</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100"
                                    required
                                />
                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Address</label>
                                <textarea
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100"
                                    rows={3}
                                />
                                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    {editingClient ? 'Update Client' : 'Save Client'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 py-2.5 rounded-xl text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
