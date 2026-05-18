import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface IndexProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function Index({ categories }: IndexProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isAutoSlug, setIsAutoSlug] = useState(true);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        name: '',
        slug: '',
        description: '',
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        setIsAutoSlug(true);
        reset();
        setShowModal(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setIsAutoSlug(false);
        setData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('categories.update', editingCategory.id), {
                onSuccess: () => setShowModal(false),
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(route('categories.destroy', id));
        }
    };

    const handleNameChange = (name: string) => {
        setData((prev) => ({
            ...prev,
            name,
            slug: isAutoSlug ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : prev.slug,
        }));
    };

    const handleSlugChange = (slug: string) => {
        setIsAutoSlug(false);
        setData('slug', slug);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Categories</h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage product categories</p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 text-xs uppercase tracking-wider">
                                    <th className="text-left px-5 py-3 font-semibold">Name</th>
                                    <th className="text-left px-5 py-3 font-semibold">Slug</th>
                                    <th className="text-left px-5 py-3 font-semibold">Description</th>
                                    <th className="text-right px-5 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-10 text-center text-neutral-400">
                                            <Tag className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                            No categories found.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-neutral-900 dark:text-neutral-100">{category.name}</div>
                                            </td>
                                            <td className="px-5 py-4 text-neutral-500 dark:text-neutral-400">
                                                {category.slug}
                                            </td>
                                            <td className="px-5 py-4 text-neutral-500 dark:text-neutral-400 max-w-xs truncate">
                                                {category.description || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                                                        <Pencil className="w-4 h-4 text-neutral-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"><X className="w-5 h-5 text-neutral-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Category Name"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    placeholder="category-slug"
                                />
                                {errors.slug && <p className="text-xs text-red-500">{errors.slug}</p>}
                                <p className="text-[10px] text-neutral-400 italic">Leave blank to auto-generate from name</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full min-h-[100px] border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-neutral-100 transition-all"
                                    placeholder="Optional description..."
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    {processing ? 'Saving...' : (editingCategory ? 'Update Category' : 'Save Category')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
