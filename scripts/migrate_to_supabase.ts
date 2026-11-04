import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

// 1. Load Firebase Config
const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// 2. Load Supabase Config
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://heiujpytsdeiggxwwbzt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaXVqcHl0c2RlaWdneHd3Ynp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDM1NTcsImV4cCI6MjEwOTE3OTU1N30.uP0K_OxEycQ5WGh9tvZHxTzPag6lureTrB7a58_rA7g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLLECTIONS = [
  'students',
  'registrations',
  'attendance',
  'notifications',
  'support_tickets',
  'leave_requests',
  'admins',
  'bot_subscribers'
];

async function migrate() {
  console.log('🚀 Starting migration from Firestore to Supabase...');

  for (const colName of COLLECTIONS) {
    console.log(`\n📦 Migrating collection: ${colName}`);
    try {
      const querySnapshot = await getDocs(collection(firestore, colName));
      const docs = querySnapshot.docs;
      console.log(`Found ${docs.length} documents.`);

      if (docs.length === 0) continue;

      for (const doc of docs) {
        const id = doc.id;
        const data = doc.data();

        // Prepare row for Supabase (matching the adapter's format)
        const row = {
          id: id,
          data: data,
          ...data
        };

        // Try to insert
        const { error } = await supabase.from(colName).upsert(row);
        
        if (error) {
          console.warn(`⚠️ Error inserting doc ${id} into ${colName}:`, error.message);
          // Fallback: try inserting without flat fields if schema mismatch
          const { error: retryError } = await supabase.from(colName).upsert({ id, data });
          if (retryError) {
            console.error(`❌ Failed to insert doc ${id} even with fallback:`, retryError.message);
          }
        }
      }
      console.log(`✅ Successfully processed ${colName}`);
    } catch (err: any) {
      console.error(`❌ Error migrating ${colName}:`, err.message);
    }
  }

  console.log('\n✨ Migration complete!');
}

migrate().catch(console.error);
