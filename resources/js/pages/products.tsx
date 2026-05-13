import { Head, useForm } from '@inertiajs/react';
import { useState } from "react";
import { Search, Plus, Trash2, Edit3, X } from "lucide-react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Product {
    id: string;
    name: string;
    name_bn: string;
    category: string;
    price: number;
}

interface ProductsProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

const formatCurrency = (n: number) => `৳${n.toLocaleString("en-BD")}`;

export default function Products({ products }: ProductsProps) {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        id: '',
        name: '',
        name_bn: '',
        category: '',
        price: '',
    });

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.name_bn.includes(search) || p.id.toLowerCase().includes(search.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setData({
            id: product.id,
            name: product.name,
            name_bn: product.name_bn,
            category: product.category,
            price: product.price.toString(),
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(route('products.update', editingProduct.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laurnverse - Products" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Products & Services</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{products.length} items in catalog</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                                    <th className="text-left px-5 py-3 font-semibold">ID</th>
                                    <th className="text-left px-3 py-3 font-semibold">Name</th>
                                    <th className="text-left px-3 py-3 font-semibold">Category</th>
                                    <th className="text-right px-3 py-3 font-semibold">Price</th>
                                    <th className="text-center px-3 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id} className="border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-neutral-500">{p.id}</td>
                                        <td className="px-3 py-3">
                                            <div className="font-medium text-neutral-800 dark:text-neutral-200">{p.name}</div>
                                            <div className="text-xs text-neutral-400">{p.name_bn}</div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-right font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(Number(p.price))}</td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => openEditModal(p)} className="p-1.5 text-neutral-400 hover:text-blue-600"><Edit3 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-neutral-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Product ID (Unique)</label>
                                <input
                                    type="text"
                                    value={data.id}
                                    onChange={e => setData('id', e.target.value)}
                                    className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100 disabled:opacity-50"
                                    required
                                    disabled={!!editingProduct}
                                />
                                {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name (English)</label>
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
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Name (Bangla)</label>
                                    <input
                                        type="text"
                                        value={data.name_bn}
                                        onChange={e => setData('name_bn', e.target.value)}
                                        className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100"
                                        required
                                    />
                                    {errors.name_bn && <p className="text-xs text-red-500 mt-1">{errors.name_bn}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Category</label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Gents">Gents</option>
                                        <option value="Ladies">Ladies</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Household">Household</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Price (৳)</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="w-full mt-1 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm bg-transparent dark:text-neutral-100"
                                        required
                                    />
                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    {editingProduct ? 'Update Product' : 'Save Product'}
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
