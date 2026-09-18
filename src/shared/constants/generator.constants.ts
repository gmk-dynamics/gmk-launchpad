export const WEB_COMPONENT_CATEGORIES = ['ui', 'layout', 'navigation', 'modals', 'forms'] as const;

export type WebComponentCategory = (typeof WEB_COMPONENT_CATEGORIES)[number];

export const isWebComponentCategory = (value: string): value is WebComponentCategory => {
  return WEB_COMPONENT_CATEGORIES.includes(value as WebComponentCategory);
};
