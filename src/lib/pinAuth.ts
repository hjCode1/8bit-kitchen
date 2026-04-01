import { supabase } from './supabase';

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function isPinSet(): Promise<boolean> {
  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'pin_hash')
    .single();
  return !!data;
}

export async function setupPin(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  const { error } = await supabase
    .from('app_config')
    .upsert({ key: 'pin_hash', value: hash });
  if (error) throw error;
}

export async function verifyPin(pin: string): Promise<boolean> {
  const hash = await hashPin(pin);
  const { data } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'pin_hash')
    .single();
  return data?.value === hash;
}
