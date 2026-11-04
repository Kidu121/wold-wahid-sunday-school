import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { supabase } from '../src/supabase';
import cfg from '../firebase-applet-config.json';

const app = initializeApp(cfg);
const firestore = getFirestore(app, cfg.firestoreDatabaseId);

const TABLE_COLUMNS: Record<string, string[]> = {
  admins: [
    'id', 'name_am', 'name_en', 'role', 'department', 'phone', 'password',
    'permissions', 'status', 'custom_role_title', 'telegram_id', 'avatar_url',
    'created_at', 'data'
  ],
  students: [
    'id', 'code', 'student_code', 'full_name_am', 'full_name_en', 'christian_name',
    'birth_year', 'phone', 'gender', 'department', 'grade_level', 'photo_url',
    'blood_group', 'emergency_contact', 'subcity', 'status', 'telegram_id',
    'telegram_username', 'approved_by', 'approved_at', 'consecutive_absences',
    'created_at', 'data'
  ],
  registrations: [
    'id', 'code', 'student_code', 'full_name_am', 'full_name_en', 'christian_name',
    'birth_year', 'phone', 'gender', 'department', 'grade_level', 'photo_url',
    'blood_group', 'emergency_contact', 'subcity', 'status', 'telegram_id',
    'telegram_username', 'submitted_at', 'data'
  ],
  attendance: [
    'id', 'member_id', 'member_name_am', 'member_name_en', 'member_code',
    'department', 'session_name', 'timestamp', 'date', 'method', 'status', 'data'
  ],
  support_tickets: [
    'id', 'ticket_number', 'requester_name', 'phone', 'category', 'title',
    'description', 'priority', 'status', 'created_at', 'updated_at',
    'is_confidential', 'notes', 'data'
  ],
  leave_requests: [
    'id', 'request_number', 'student_name', 'telegram_id', 'leave_type',
    'duration', 'reason', 'status', 'created_at', 'data'
  ],
  notifications: [
    'id', 'title', 'message', 'created_at', 'data'
  ],
};

function formatPayload(tableName: string, id: string, data: any): any {
  const allowed = TABLE_COLUMNS[tableName];
  const payload: any = {
    id,
    data: data,
  };

  // Names
  if (data.nameAm || data.name_am) payload.name_am = data.nameAm || data.name_am;
  if (data.nameEn || data.name_en) payload.name_en = data.nameEn || data.name_en;
  if (data.fullNameAm || data.full_name_am) {
    payload.full_name_am = data.fullNameAm || data.full_name_am;
    if (!payload.name_am) payload.name_am = payload.full_name_am;
  }
  if (data.fullNameEn || data.full_name_en) {
    payload.full_name_en = data.fullNameEn || data.full_name_en;
    if (!payload.name_en) payload.name_en = payload.full_name_en;
  }

  // Common
  if (data.phone) payload.phone = data.phone;
  if (data.password) payload.password = data.password;
  if (data.role) payload.role = data.role;
  if (data.department) payload.department = data.department;
  if (data.status) payload.status = data.status;
  if (data.permissions) payload.permissions = data.permissions;
  if (data.customRoleTitle || data.custom_role_title) payload.custom_role_title = data.customRoleTitle || data.custom_role_title;
  if (data.telegramId || data.telegram_id) payload.telegram_id = String(data.telegramId || data.telegram_id);
  if (data.telegramUsername || data.telegram_username) payload.telegram_username = data.telegramUsername || data.telegram_username;
  if (data.avatarUrl || data.photo_url || data.photoUrl) {
    payload.avatar_url = data.avatarUrl || data.photo_url || data.photoUrl;
    payload.photo_url = payload.avatar_url;
  }

  // Attendance specific
  if (data.memberId || data.studentId) payload.member_id = data.memberId || data.studentId;
  if (data.memberNameAm || data.fullNameAm) payload.member_name_am = data.memberNameAm || data.fullNameAm;
  if (data.memberNameEn || data.fullNameEn) payload.member_name_en = data.memberNameEn || data.fullNameEn;
  if (data.memberCode || data.studentCode || data.code) {
    payload.member_code = data.memberCode || data.studentCode || data.code;
    payload.code = payload.member_code;
    payload.student_code = payload.member_code;
  }
  if (data.sessionName || data.session_name) payload.session_name = data.sessionName || data.session_name;
  if (data.timestamp) payload.timestamp = String(data.timestamp);
  if (data.date) payload.date = String(data.date);
  if (data.method) payload.method = data.method;

  // Support tickets specific
  if (data.ticketNumber || data.ticket_number) payload.ticket_number = data.ticketNumber || data.ticket_number;
  if (data.requesterName || data.studentName) payload.requester_name = data.requesterName || data.studentName;
  if (data.title || data.subject) payload.title = data.title || data.subject;
  if (data.description || data.message) payload.description = data.description || data.message;
  if (data.priority) payload.priority = data.priority;

  // Leave requests specific
  if (data.requestNumber || data.request_number) payload.request_number = data.requestNumber || data.request_number;
  if (data.studentName || data.student_name) payload.student_name = data.studentName || data.student_name;
  if (data.leaveType || data.leave_type) payload.leave_type = data.leaveType || data.leave_type;
  if (data.duration) payload.duration = data.duration;
  if (data.reason) payload.reason = data.reason;

  // Notifications specific
  if (data.title) payload.title = data.title;
  if (data.message) payload.message = data.message;

  // Students & Registrations specific
  if (data.gradeLevel || data.grade_level) payload.grade_level = data.gradeLevel || data.grade_level;
  if (data.christianName || data.christian_name) payload.christian_name = data.christianName || data.christian_name;
  if (data.birthYear || data.birth_year || data.birthDate) payload.birth_year = String(data.birthYear || data.birth_year || data.birthDate);
  if (data.gender) payload.gender = data.gender;
  if (data.bloodGroup || data.blood_group) payload.blood_group = data.bloodGroup || data.blood_group;
  if (data.emergencyContact || data.emergency_contact) {
    payload.emergency_contact = typeof data.emergencyContact === 'object' 
      ? JSON.stringify(data.emergencyContact) 
      : String(data.emergencyContact || data.emergency_contact);
  }
  if (data.subcity) payload.subcity = data.subcity;
  if (data.submittedAt || data.submitted_at) payload.submitted_at = data.submittedAt || data.submitted_at;
  if (data.approvedAt || data.approved_at) payload.approved_at = data.approvedAt || data.approved_at;
  if (data.approvedBy || data.approved_by) payload.approved_by = data.approvedBy || data.approved_by;
  if (data.consecutiveAbsences !== undefined) payload.consecutive_absences = Number(data.consecutiveAbsences);

  if (allowed && allowed.length > 0) {
    const filtered: any = {};
    for (const key of Object.keys(payload)) {
      if (allowed.includes(key)) {
        filtered[key] = payload[key];
      }
    }
    return filtered;
  }
  return payload;
}

async function migrateCollection(name: string) {
  console.log(`\n========================================`);
  console.log(`📥 Fetching collection "${name}" from Firestore...`);
  const snap = await getDocs(collection(firestore, name));
  console.log(`Found ${snap.size} documents in Firestore "${name}".`);

  if (snap.size === 0) {
    console.log(`Skipping "${name}" (0 documents).`);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const docSnap of snap.docs) {
    const docData = docSnap.data();
    const id = docSnap.id;

    // Special safety for admins: do not overwrite password of 0988286610
    if (name === 'admins') {
      const cleanP = (docData.phone || '').replace(/\D/g, '').slice(-9);
      if (cleanP === '988286610') {
        const { data: existingAdmin } = await supabase.from('admins').select('password').eq('id', id).maybeSingle();
        if (existingAdmin?.password) {
          docData.password = existingAdmin.password;
        }
      }
    }

    const payload = formatPayload(name, id, docData);

    const { error } = await supabase.from(name).upsert(payload);
    if (error) {
      console.error(`❌ Error migrating ${name}/${id}:`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`✅ Finished "${name}": ${successCount} migrated successfully, ${errorCount} errors.`);
}

async function runFullMigration() {
  console.log('🚀 Starting Full Firestore to Supabase Migration...');
  const collections = [
    'admins',
    'students',
    'registrations',
    'attendance',
    'support_tickets',
    'leave_requests',
    'notifications',
  ];

  for (const col of collections) {
    try {
      await migrateCollection(col);
    } catch (err: any) {
      console.error(`Migration error on ${col}:`, err.message);
    }
  }

  console.log('\n🎉 ALL COLLECTIONS MIGRATED TO SUPABASE!');
}

runFullMigration().catch(console.error);
