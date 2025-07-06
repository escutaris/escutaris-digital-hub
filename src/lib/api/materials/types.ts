
import type { Material } from "../../types/material";

export type MaterialUploadData = Omit<Material, 'id' | 'created_at' | 'file_url'>;
export type MaterialUpdateData = Partial<Omit<Material, 'id' | 'created_at' | 'file_url'>>;
