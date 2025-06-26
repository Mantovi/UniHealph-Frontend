import api from './axios';

export async function linkSubSpecialtiesToSpecialty(specialtyId: number, subIds: number[]) {
  await api.post(`/api/specialties/${specialtyId}/sub`, subIds);
}

export async function linkCategoriesToSubSpecialty(subId: number, categoryIds: number[]) {
  await api.post(`/api/sub-specialties/${subId}/category`, categoryIds);
}

export async function linkProductTypesToCategory(categoryId: number, typeIds: number[]) {
  await api.post(`/api/categories/${categoryId}/product-type`, typeIds);
}

export async function linkProductsToProductType(typeId: number, productIds: number[]) {
  await api.post(`/api/product-types/${typeId}/products`, productIds);
}
