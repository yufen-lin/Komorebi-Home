export type Role = 'owner' | 'guest' | 'visitor';

export interface NavigationItem {
  label: string;
  icon: string;
  path: string;
  roles?: ('owner' | 'guest')[];
  visible?: boolean;
}

export type StorageZone = 'refrigerated' | 'roomTemp' | 'frozen' | 'produce';

export type IngredientTag =
  | 'frequent'
  | 'standby'
  | 'beef'
  | 'pork'
  | 'chicken'
  | 'otherMeat'
  | 'fruit'
  | 'seafood'
  | 'vegetables'
  | 'dairy'
  | 'starch'
  | 'frozenFood'
  | 'eggSoy'
  | 'other';

export type PurchaseLocation =
  | 'carrefour'
  | 'pxmart'
  | 'costco'
  | 'lopia'
  | 'home'
  | 'wetMarket'
  | 'other';

export interface Ingredient {
  id?: string;
  name: string;
  icon: string;
  expirationDate?: string | null;
  quantity: number | null;
  unit: string;
  storageZone: StorageZone;
  tags?: IngredientTag[];
  purchaseDate: string | null;
  purchaseLocation: PurchaseLocation;
  price: number | null;
}

export type ShoppingListItem = Partial<Ingredient> & { checked: boolean };

export type ExpirationStatus = 'expired' | 'danger' | 'warning' | 'safe' | 'normal';

export type StatCardData = {
  icon: string;
  title: string;
  value: string | number;
  trend?: string | number;
  trendDirection?: 'up' | 'down';
  trendImpact?: 'positive' | 'negative';
};
