import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://heiujpytsdeiggxwwbzt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaXVqcHl0c2RlaWdneHd3Ynp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDM1NTcsImV4cCI6MjEwOTE3OTU1N30.uP0K_OxEycQ5WGh9tvZHxTzPag6lureTrB7a58_rA7g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLES = ['students', 'registrations', 'attendance', 'notifications', 'support_tickets', 'leave_requests', 'admins'];

async function compare() {
  console.log('--- Database Comparison ---');
  for (const table of TABLES) {
    let fCount = 0;
    try {
      const fSnap = await getDocs(collection(firestore, table));
      fCount = fSnap.size;
    } catch (e) {
      console.warn(`Firestore ${table} error:`, e.message);
    }

    const { count: sCount } = await supabase.from(table).select('*', { count: 'exact', head: true });
    
    console.log(`${table}: Firestore=${fCount}, Supabase=${sCount}`);
  }
}

compare().catch(console.error);
