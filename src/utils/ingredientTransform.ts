import type { Ingredient } from '../type';

export function fromDbIngredient(row: any): Ingredient {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    expirationDate: row.expiration_date,
    quantity: row.quantity,
    unit: row.unit,
    storageZone: row.storage_zone,
    tags: row.tags,
    purchaseDate: row.purchase_date,
    purchaseLocation: row.purchase_location,
    price: row.price,
  };
}

export function toDbIngredient(input: Partial<Ingredient>) {
  return {
    name: input.name,
    icon: input.icon,
    expiration_date: input.expirationDate,
    quantity: input.quantity,
    unit: input.unit,
    storage_zone: input.storageZone,
    tags: input.tags,
    purchase_date: input.purchaseDate,
    purchase_location: input.purchaseLocation,
    price: input.price,
  };
}
