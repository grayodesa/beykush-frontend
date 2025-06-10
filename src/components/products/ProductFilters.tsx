'use client';

import { useRouter } from 'next/navigation';

interface ProductFiltersProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  currentCategory?: string;
  currentSort: string;
}

export function ProductFilters({ categories, currentCategory, currentSort }: ProductFiltersProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Фільтри</h3>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Категорії</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/products"
                className={`block py-1 ${!currentCategory ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'}`}
              >
                Всі вина
              </a>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`/products?category=${cat.slug}`}
                  className={`block py-1 ${currentCategory === cat.slug ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  {cat.name} ({cat.count})
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sort */}
        <div>
          <h4 className="font-medium mb-3">Сортування</h4>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="date">Новинки</option>
            <option value="price">Ціна: від низької до високої</option>
            <option value="price-desc">Ціна: від високої до низької</option>
            <option value="name">Назва: А-Я</option>
          </select>
        </div>
      </div>
    </aside>
  );
}