'use client';

import { Header } from './Header';
import { LanguageSwitcher } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export function HeaderWrapper() {
  const { t } = useTranslation();
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const menuItems = [
    {
      label: 'ПРО НАС',
      children: [
        { label: 'Про винарню', href: '/about' },
        { label: 'Наша історія', href: '/history' },
        { label: 'Команда', href: '/team' },
      ],
    },
    {
      label: 'ВИННИЙ КЛУБ',
      href: '/wine-club',
    },
    {
      label: 'МАГАЗИН',
      href: '/products',
    },
  ];

  return (
    <div className="relative">
      <Header
        logo={null}
        menuItems={menuItems}
        cartItemCount={cartItemCount}
        onCartClick={() => console.log('Cart clicked')}
        onSearchClick={() => console.log('Search clicked')}
      />
      <div className="absolute top-4 right-24 z-50">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
