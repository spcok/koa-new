import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';

interface SyncState {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  pullFromCloud: () => Promise<void>;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  lastSyncedAt: null,
  pullFromCloud: async () => {
    set({ isSyncing: true });
    try {
      const { data, error } = await supabase.from('animals').select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        await db.transaction(async (tx) => {
          for (const record of data) {
            const columns = [
              'id', 'entity_type', 'parent_mob_id', 'census_count', 'name', 'species', 
              'latin_name', 'category', 'location', 'image_url', 'distribution_map_url', 
              'hazard_rating', 'is_venomous', 'weight_unit', 'flying_weight_g', 'winter_weight_g', 
              'average_target_weight', 'date_of_birth', 'is_dob_unknown', 'gender', 'microchip_id', 
              'ring_number', 'has_no_id', 'red_list_status', 'description', 'special_requirements', 
              'critical_husbandry_notes', 'ambient_temp_only', 'target_day_temp_c', 'target_night_temp_c', 
              'water_tipping_temp', 'target_humidity_min_percent', 'target_humidity_max_percent', 
              'misting_frequency', 'acquisition_date', 'acquisition_type', 'origin', 'origin_location', 
              'lineage_unknown', 'sire_id', 'dam_id', 'is_boarding', 'is_quarantine', 'display_order', 
              'archived', 'archive_reason', 'archive_type', 'archived_at', 'is_deleted', 'created_by', 
              'modified_by', 'created_at', 'updated_at'
            ];
            
            const values = columns.map(col => record[col]);
            const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
            const updateSet = columns.map(col => `${col} = EXCLUDED.${col}`).join(', ');

            const query = `
              INSERT INTO animals (${columns.join(', ')})
              VALUES (${placeholders})
              ON CONFLICT (id) DO UPDATE SET ${updateSet};
            `;

            await tx.query(query, values);
          }
        });
      }
      set({ lastSyncedAt: new Date(), isSyncing: false });
    } catch (err) {
      console.error('Error pulling from cloud:', err);
      set({ isSyncing: false });
    }
  }
}));