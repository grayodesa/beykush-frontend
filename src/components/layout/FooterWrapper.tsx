'use client';

import { Footer } from './Footer';
import { useTranslation } from '@/lib/i18n';

export function FooterWrapper() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t.footer.products,
      links: [
        { label: t.navigation.redWines, href: '/products?category=red' },
        { label: t.navigation.whiteWines, href: '/products?category=white' },
        { label: t.navigation.roseWines, href: '/products?category=rose' },
        { label: t.navigation.sparklingWines, href: '/products?category=sparkling' },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.aboutUs, href: '/about' },
        { label: t.footer.ourStory, href: '/about/story' },
        { label: t.footer.vineyards, href: '/about/vineyards' },
        { label: t.footer.process, href: '/about/process' },
      ],
    },
    {
      title: t.footer.customerCare,
      links: [
        { label: t.footer.contact, href: '/contact' },
        { label: t.footer.shipping, href: '/shipping' },
        { label: t.footer.returns, href: '/returns' },
        { label: t.footer.faq, href: '/faq' },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.footer.privacy, href: '/privacy' },
        { label: t.footer.terms, href: '/terms' },
        { label: t.footer.agePolicy, href: '/age-policy' },
      ],
    },
  ];

  const socialLinks = [
    { platform: 'facebook' as const, href: 'https://facebook.com/beykush' },
    { platform: 'instagram' as const, href: 'https://instagram.com/beykush' },
    { platform: 'youtube' as const, href: 'https://youtube.com/beykush' },
  ];

  return <Footer sections={sections} socialLinks={socialLinks} />;
}
