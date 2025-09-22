import { useEffect, useState, useCallback } from 'react';

const KEY = 'home_config_v1';

const defaultConfig = {
  promoText: 'Free shipping over GHS 300 · 30-day returns · Secure checkout',
  hero: {
    headline: 'Discover modern styles for every season',
    sub: 'Curated pieces for every occasion, with sizes and fits that work for you.',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1600&auto=format&fit=crop',
  },
  spotlightCategories: [], // if empty, falls back to first 6 categories
  featuredProductIds: [],  // if empty, falls back to first 8 products
};

export function readHomeConfig() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw);
    return { ...defaultConfig, ...parsed, hero: { ...defaultConfig.hero, ...(parsed.hero || {}) } };
  } catch {
    return defaultConfig;
  }
}

export function writeHomeConfig(cfg) {
  const merged = { ...defaultConfig, ...cfg, hero: { ...defaultConfig.hero, ...(cfg.hero || {}) } };
  localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
}

export function useHomeConfig() {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    setConfig(readHomeConfig());
  }, []);

  const save = useCallback((partial) => {
    setConfig((prev) => writeHomeConfig({ ...prev, ...partial }));
  }, []);

  const saveHero = useCallback((partial) => {
    setConfig((prev) => writeHomeConfig({ ...prev, hero: { ...prev.hero, ...partial } }));
  }, []);

  return { config, save, saveHero };
}
