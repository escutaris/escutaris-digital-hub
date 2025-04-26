
import { createClient } from '@supabase/supabase-js';

// Get the URL and key from environment variables or use fallback values
// Only for development purpose, you should set these in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please add them to your Supabase connection.');
  // Instead of throwing an error, we'll create a mock client for development
  // This allows the app to render without crashing
  const mockClient = {
    from: () => ({
      select: () => ({
        order: () => ({
          or: () => ({
            eq: () => ({ data: [], error: null })
          }),
          eq: () => ({ data: [], error: null }),
          data: [],
          error: null
        }),
        eq: () => ({ data: [], error: null }),
        data: [],
        error: null
      }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) }),
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: { Key: '' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => ({ data: null, error: null }),
      })
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    }
  };
  
  export { mockClient as supabase };
  
  // Define types for our materials
  export type Material = {
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    is_new: boolean;
    created_at: string;
    category: 'material' | 'legislacao' | 'ferramenta';
  };
  
  // Create mock implementations of helper functions
  export const fetchMaterials = async (): Promise<Material[]> => {
    console.warn('Using mock fetchMaterials function. Connect to Supabase for real data.');
    return []; // Return empty array instead of throwing error
  };
  
  export const uploadMaterial = async (): Promise<Material> => {
    console.warn('Using mock uploadMaterial function. Connect to Supabase for real data.');
    throw new Error('Supabase connection not configured');
  };
  
  export const updateMaterial = async (): Promise<void> => {
    console.warn('Using mock updateMaterial function. Connect to Supabase for real data.');
    throw new Error('Supabase connection not configured');
  };
  
  export const deleteMaterial = async (): Promise<void> => {
    console.warn('Using mock deleteMaterial function. Connect to Supabase for real data.');
    throw new Error('Supabase connection not configured');
  };
} else {
  // If environment variables are present, create the real client
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Define types for our materials
  export type Material = {
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    is_new: boolean;
    created_at: string;
    category: 'material' | 'legislacao' | 'ferramenta';
  };

  // Helper functions for materials
  export const fetchMaterials = async (
    search: string = '',
    category: string = ''
  ): Promise<Material[]> => {
    let query = supabase.from('materials').select('*').order('created_at', { ascending: false });

    // Apply search filter if provided
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    // Apply category filter if provided and not 'todos'
    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching materials:', error);
      return []; // Return empty array instead of throwing
    }

    return data as Material[];
  };

  // Admin functions
  export const uploadMaterial = async (
    file: File, 
    materialData: Omit<Material, 'id' | 'created_at' | 'file_url'>
  ): Promise<Material> => {
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { error: uploadError, data: fileData } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // 2. Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);
    
    const file_url = publicUrlData.publicUrl;

    // 3. Insert record into the database
    const { data, error } = await supabase
      .from('materials')
      .insert({
        ...materialData,
        file_url
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting material:', error);
      // Delete the uploaded file if the database insert fails
      await supabase.storage.from('materials').remove([filePath]);
      throw error;
    }

    return data as Material;
  };

  export const updateMaterial = async (
    id: string,
    updates: Partial<Omit<Material, 'id' | 'created_at' | 'file_url'>>
  ): Promise<void> => {
    const { error } = await supabase
      .from('materials')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  };

  export const deleteMaterial = async (id: string, filePath: string): Promise<void> => {
    // 1. Delete the database record
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting material:', error);
      throw error;
    }

    // 2. Extract the filename from the full URL
    const fileName = filePath.split('/').pop();
    if (fileName) {
      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([fileName]);
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // We don't throw here because the database record is already deleted
      }
    }
  };
}
