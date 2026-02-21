import { supabase } from '@shared/lib/supabase/supabaseClient';
import type { ContextInsert } from '@shared/model/types/supabase.type';

export async function insertContext(context: ContextInsert) {
  const { data, error } = await supabase.from('context').insert(context);
  if (error) throw error;
  return data;
}
