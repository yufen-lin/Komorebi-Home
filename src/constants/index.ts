import type { NavigationItem, StorageZone } from '../type';

export const NAVIGATION_LIST: NavigationItem[] = [
  {
    label: 'Home',
    icon: 'mdi-home-outline',
    path: '/',
    visible: true,
  },
  {
    label: 'Fridge',
    icon: 'mdi-fridge-outline',
    path: '/fridge',
    visible: true,
  },
  {
    label: 'To-Buy',
    icon: 'mdi-cart-variant',
    path: '/shopping-list',
    visible: true,
  },
  {
    label: 'Menu',
    icon: 'mdi-food',
    path: '/menu',
    visible: true,
  },
];

export const STORAGE_ZONES: {
  value: StorageZone | 'all';
  label: string;
}[] = [
  { value: 'all', label: '全部' },
  {
    value: 'refrigerated',
    label: '冷藏',
  },
  {
    value: 'roomTemp',
    label: '常溫',
  },
  {
    value: 'frozen',
    label: '冷凍',
  },
  {
    value: 'produce',
    label: '蔬果',
  },
];

const INGREDIENT_TAG_COLORS = {
  meat: { bg: '#fcd6b5', text: '#b85a00' },
  standby: { bg: '#e9c4bc', text: '#bc383c' },
  veggie: { bg: '#cbe5cc', text: '#2d7740' },
  seafood: { bg: '#c1daec', text: '#346484' },
  dairy: { bg: '#f8e3aa', text: '#a87400' },
  gray: { bg: '#d4d2d2', text: '#545454' },
};

export const INGREDIENT_TAG_INFO: Record<string, { label: string; bg: string; text: string }> = {
  beef: { label: '牛肉', ...INGREDIENT_TAG_COLORS.meat },
  pork: { label: '豬肉', ...INGREDIENT_TAG_COLORS.meat },
  chicken: { label: '雞肉', ...INGREDIENT_TAG_COLORS.meat },
  otherMeat: { label: '其他肉類', ...INGREDIENT_TAG_COLORS.meat },

  frequent: { label: '常用', ...INGREDIENT_TAG_COLORS.standby },
  standby: { label: '預備食材', ...INGREDIENT_TAG_COLORS.standby },

  fruit: { label: '水果', ...INGREDIENT_TAG_COLORS.veggie },
  vegetables: { label: '蔬菜', ...INGREDIENT_TAG_COLORS.veggie },

  seafood: { label: '海鮮', ...INGREDIENT_TAG_COLORS.seafood },
  frozenFood: { label: '冷凍食品', ...INGREDIENT_TAG_COLORS.seafood },

  dairy: { label: '乳製品', ...INGREDIENT_TAG_COLORS.dairy },
  starch: { label: '澱粉', ...INGREDIENT_TAG_COLORS.dairy },
  eggSoy: { label: '蛋豆類', ...INGREDIENT_TAG_COLORS.dairy },

  other: { label: '其他', ...INGREDIENT_TAG_COLORS.gray },
};

export const STORAGE_OPTIONS = [
  { key: 'frozen', label: '冷凍區', icon: '❄️' },
  { key: 'refrigerated', label: '冷藏區', icon: '🧊' },
  { key: 'roomTemp', label: '常溫區', icon: '📦' },
  { key: 'produce', label: '蔬果區', icon: '🥬' },
];

export const PURCHASE_LOCATION_OPTIONS = [
  { value: 'carrefour', title: '家樂福' },
  { value: 'pxmart', title: '全聯' },
  { value: 'costco', title: 'Costco' },
  { value: 'lopia', title: 'Lopia' },
  { value: 'home', title: '家' },
  { value: 'wetMarket', title: '菜市場' },
  { value: 'other', title: '其他' },
];

export const TAG_OPTIONS = Object.entries(INGREDIENT_TAG_INFO).map(([value, data]) => ({
  value,
  title: data.label,
}));
