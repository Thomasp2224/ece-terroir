import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoiplveaodszznofacty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaXBsdmVhb2Rzenpub2ZhY3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMTMxNTksImV4cCI6MjEwMzY4OTE1OX0.m1dytZGQeh7qwdzPTWMKcip0o43ivVzKJpGYIf9vg6Y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function purge() {
  console.log('--- Purge du contenu de démonstration Supabase Cloud ---');

  const { error: evtErr } = await supabase.from('events').delete().neq('id', 'keep_none');
  if (evtErr) console.error('Erreur purge events:', evtErr.message);
  else console.log('✓ Table events vidée.');

  const { error: prodErr } = await supabase.from('products').delete().neq('id', 'keep_none');
  if (prodErr) console.error('Erreur purge products:', prodErr.message);
  else console.log('✓ Table products vidée.');

  const { error: postErr } = await supabase.from('posts').delete().neq('id', 'keep_none');
  if (postErr) console.error('Erreur purge posts:', postErr.message);
  else console.log('✓ Table posts vidée.');

  const { error: chkErr } = await supabase.from('event_checkins').delete().neq('id', 'keep_none');
  if (chkErr) console.error('Erreur purge event_checkins:', chkErr.message);
  else console.log('✓ Table event_checkins vidée.');

  console.log('--- Purge terminée avec succès ! Seuls les profils officiels sont conservés. ---');
}

purge();
