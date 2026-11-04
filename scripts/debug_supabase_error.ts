import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://heiujpytsdeiggxwwbzt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaXVqcHl0c2RlaWdneHd3Ynp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDM1NTcsImV4cCI6MjEwOTE3OTU1N30.uP0K_OxEycQ5WGh9tvZHxTzPag6lureTrB7a58_rA7g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabase() {
    console.log('Testing Students Table...');
    const { data: students, error: studentsError } = await supabase.from('students').select('*').limit(1);
    if (studentsError) console.error('Students Error:', studentsError);
    else console.log('Students Success:', students);

    console.log('Testing Registrations Table...');
    const { data: regs, error: regsError } = await supabase.from('registrations').select('*').limit(1);
    if (regsError) console.error('Registrations Error:', regsError);
    else console.log('Registrations Success:', regs);
}

testSupabase();
