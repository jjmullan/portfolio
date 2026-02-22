import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { TablesInsert } from '@shared/model/types/supabase.type';

export async function insertContext(context: TablesInsert<'context'>) {
  const { data, error } = await supabase.from('context').insert(context);
  if (error) throw error;
  return data;
}
