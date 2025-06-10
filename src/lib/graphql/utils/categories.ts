import { ProductCategory } from '../types';

/**
 * Filters and deduplicates product categories based on language
 * Prioritizes Ukrainian categories (without language suffix in slug)
 * Falls back to categories without language suffixes
 * 
 * @param categories - Array of product categories from GraphQL
 * @returns Filtered and deduplicated categories
 */
export function filterUniqueCategories(categories: ProductCategory[]): ProductCategory[] {
  if (!categories || categories.length === 0) return [];

  // Group categories by base name (without language suffix)
  const categoryGroups = new Map<string, ProductCategory[]>();

  categories.forEach(category => {
    // Extract base name by removing language suffixes
    const slug = category.slug || '';
    let baseName = slug;
    
    // Remove common language suffixes
    const languageSuffixes = ['-en', '-ru', '-uk'];
    for (const suffix of languageSuffixes) {
      if (slug.endsWith(suffix)) {
        baseName = slug.slice(0, -suffix.length);
        break;
      }
    }

    // For special cases where we have both with and without suffix
    // Group categories with similar names together
    const nameVariations: Record<string, string> = {
      'passion': 'passion',
      'super-beykush': 'super-beykush',
      'super-bejkush': 'super-beykush',
      'super-bejkush-ru': 'super-beykush',
      'fantasy': 'fantasy',
      'fantazyya': 'fantasy',
      'fantasy-en': 'fantasy',
      'artania': 'artania',
      'artanyya': 'artania',
      'beykush': 'beykush',
      'beykush-en': 'beykush',
      'bejkush': 'beykush',
      'beykush-reserve': 'beykush-reserve',
      'bejkush-rezerv': 'beykush-reserve',
      'bejkush-rezerv-ru': 'beykush-reserve',
      'klub': 'klub',
      'klub-ru': 'klub',
      'club': 'klub',
      'sety': 'sety',
      'sety-2': 'sety',
      'sets': 'sety',
      'tasting': 'tasting',
      'degustacziya': 'tasting',
      'degustacziya-ru': 'tasting',
    };

    // Normalize the base name further
    if (nameVariations[slug]) {
      baseName = nameVariations[slug];
    } else if (nameVariations[baseName]) {
      baseName = nameVariations[baseName];
    }
    
    if (!categoryGroups.has(baseName)) {
      categoryGroups.set(baseName, []);
    }
    categoryGroups.get(baseName)!.push(category);
  });

  // Select the best category from each group
  const uniqueCategories: ProductCategory[] = [];
  
  categoryGroups.forEach((group, baseName) => {
    if (group.length === 1) {
      uniqueCategories.push(group[0]);
    } else {
      // Priority order:
      // 1. Category without language suffix in slug (Ukrainian version)
      // 2. Category with the highest product count
      // 3. First category in the group
      
      let selectedCategory = group[0];
      
      // Find category without language suffix or with Ukrainian name
      const ukrainianPriority = ['beykush', 'bejkush', 'artanyya', 'artania', 'fantazyya', 'sety', 'klub', 'degustacziya'];
      const ukCategory = group.find(cat => 
        ukrainianPriority.includes(cat.slug) || 
        (!cat.slug.endsWith('-en') && !cat.slug.endsWith('-ru') && !cat.slug.includes('-uk'))
      );
      
      if (ukCategory) {
        selectedCategory = ukCategory;
      } else {
        // Select the one with highest count
        selectedCategory = group.reduce((prev, curr) => 
          (curr.count || 0) > (prev.count || 0) ? curr : prev
        );
      }
      
      uniqueCategories.push(selectedCategory);
    }
  });

  // Sort by count (descending) and then by name
  return uniqueCategories.sort((a, b) => {
    const countDiff = (b.count || 0) - (a.count || 0);
    if (countDiff !== 0) return countDiff;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Maps category names to consistent Ukrainian names
 * This helps with categories that have different names in different languages
 */
export function normalizeCategoryName(category: ProductCategory): string {
  const nameMap: Record<string, string> = {
    'passion': 'Passion',
    'super beykush': 'Супер Бейкуш',
    'super-beykush': 'Супер Бейкуш',
    'fantasy': 'Фантазія',
    'collection of the past harvests': 'Колекція минулих врожаїв',
    'beykush reserve': 'Бейкуш Резерв',
    'artania': 'Артанія',
    'sets': 'Сети',
    'club': 'Клуб',
    'beykush': 'Бейкуш',
    'tasting': 'Дегустація',
  };

  const normalizedName = category.name.toLowerCase().trim();
  return nameMap[normalizedName] || category.name;
}