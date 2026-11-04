import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://heiujpytsdeiggxwwbzt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaXVqcHl0c2RlaWdneHd3Ynp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDM1NTcsImV4cCI6MjEwOTE3OTU1N30.uP0K_OxEycQ5WGh9tvZHxTzPag6lureTrB7a58_rA7g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
  const tables = ['students', 'registrations', 'bot_subscribers'];
  for (const table of tables) {
    console.log(`\n--- Schema for ${table} ---`);
    // Try to get one row to see columns
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
    } else if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('Table is empty or no columns found.');
    }
  }
}

checkSchema().catch(console.error);
