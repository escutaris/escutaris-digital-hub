
// Re-export all functions from the refactored modules
export { fetchMaterials, fetchMaterialsWithStats, fetchMaterialsAdmin, fetchMaterialLink, registrarBloqueio } from './queries';
export { uploadMaterial, updateMaterial, deleteMaterial } from './mutations';
export type { MaterialUploadData, MaterialUpdateData } from './types';
