import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://heiujpytsdeiggxwwbzt.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaXVqcHl0c2RlaWdneHd3Ynp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDM1NTcsImV4cCI6MjEwOTE3OTU1N30.uP0K_OxEycQ5WGh9tvZHxTzPag6lureTrB7a58_rA7g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseClient = supabase;

// Persistent Local File Store for offline fallback
const LOCAL_DB_PATH = path.resolve(process.cwd(), 'backend/data/local_db.json');

function ensureLocalDir() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadLocalStore(): Record<string, Record<string, any>> {
  try {
    ensureLocalDir();
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading local JSON DB:', err);
  }
  return {};
}

function saveLocalStore(store: Record<string, Record<string, any>>) {
  try {
    ensureLocalDir();
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error saving local JSON DB:', err);
  }
}

const localStore = loadLocalStore();

function getCollectionLocal(colName: string): Record<string, any> {
  if (!localStore[colName]) {
    localStore[colName] = {};
  }
  return localStore[colName];
}

export function mapFieldToColumn(field?: string): string {
  if (!field) return '';
  const map: Record<string, string> = {
    telegramId: 'telegram_id',
    telegram_id: 'telegram_id',
    tgId: 'telegram_id',
    telegramUsername: 'telegram_username',
    telegram_username: 'telegram_username',
    studentCode: 'student_code',
    student_code: 'student_code',
    code: 'code',
    fullNameAm: 'full_name_am',
    full_name_am: 'full_name_am',
    fullNameEn: 'full_name_en',
    full_name_en: 'full_name_en',
    nameAm: 'name_am',
    name_am: 'name_am',
    nameEn: 'name_en',
    name_en: 'name_en',
    christianName: 'christian_name',
    christian_name: 'christian_name',
    birthYear: 'birth_year',
    birth_year: 'birth_year',
    birthDate: 'birth_year',
    photoUrl: 'photo_url',
    photo_url: 'photo_url',
    bloodGroup: 'blood_group',
    blood_group: 'blood_group',
    gradeLevel: 'grade_level',
    grade_level: 'grade_level',
    emergencyContact: 'emergency_contact',
    emergency_contact: 'emergency_contact',
    emergencyName: 'emergency_contact',
    emergencyPhone: 'emergency_contact',
    submittedAt: 'submitted_at',
    submitted_at: 'submitted_at',
    approvedAt: 'approved_at',
    approved_at: 'approved_at',
    approvedBy: 'approved_by',
    approved_by: 'approved_by',
    customRoleTitle: 'custom_role_title',
    custom_role_title: 'custom_role_title',
    sessionName: 'session_name',
    session_name: 'session_name',
    memberCode: 'member_code',
    member_code: 'member_code',
    memberNameAm: 'member_name_am',
    member_name_am: 'member_name_am',
    memberNameEn: 'member_name_en',
    member_name_en: 'member_name_en',
    ticketNumber: 'ticket_number',
    ticket_number: 'ticket_number',
    requesterName: 'requester_name',
    requester_name: 'requester_name',
    requestNumber: 'request_number',
    request_number: 'request_number',
    studentName: 'student_name',
    student_name: 'student_name',
    leaveType: 'leave_type',
    leave_type: 'leave_type',
    chatId: 'chat_id',
    chat_id: 'chat_id',
    firstName: 'first_name',
    first_name: 'first_name',
    lastName: 'last_name',
    last_name: 'last_name',
    lastActiveAt: 'last_active_at',
    last_active_at: 'last_active_at',
    consecutiveAbsences: 'consecutive_absences',
    consecutive_absences: 'consecutive_absences',
    createdAt: 'created_at',
    created_at: 'created_at',
    updatedAt: 'updated_at',
    updated_at: 'updated_at',
  };
  return map[field] || field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function flattenDoc(row: any): any {
  if (!row || typeof row !== 'object') return row;
  let flat = { ...row };
  while (flat.data && typeof flat.data === 'object') {
    const inner = flat.data;
    delete flat.data;
    flat = { ...inner, ...flat };
  }
  return flat;
}

export function normalizeDoc(id: string, row: any): any {
  if (!row) return null;
  const flatRow = flattenDoc(row);
  const rawData = (flatRow.data && typeof flatRow.data === 'object') ? flatRow.data : {};
  const merged = { ...rawData, ...flatRow };

  const telegramId = String(merged.telegram_id || merged.telegramId || merged.tgId || '');
  const studentCode = merged.student_code || merged.studentCode || merged.code || '';
  const phone = merged.phone || '';
  const fullNameAm = merged.full_name_am || merged.fullNameAm || merged.name_am || merged.nameAm || '';
  const fullNameEn = merged.full_name_en || merged.fullNameEn || merged.name_en || merged.nameEn || '';
  const christianName = merged.christian_name || merged.christianName || '';
  const department = merged.department || '';
  const status = merged.status || 'pending';
  const role = merged.role || 'student';
  const password = merged.password || '';
  const permissions = merged.permissions || null;
  const gradeLevel = merged.grade_level || merged.gradeLevel || '';
  const photoUrl = merged.photo_url || merged.photoUrl || '';
  const birthDate = merged.birth_year || merged.birthDate || merged.birthYear || '';
  const submittedAt = merged.submitted_at || merged.submittedAt || '';
  const address = merged.subcity || merged.address || '';
  const emergencyContact = merged.emergency_contact || merged.emergencyContact || '';
  const emergencyName = merged.emergencyName || (typeof emergencyContact === 'string' ? emergencyContact : emergencyContact?.name) || '';
  const emergencyPhone = merged.emergencyPhone || (typeof emergencyContact === 'object' ? emergencyContact?.phone : '') || '';
  const session = merged.session !== undefined ? merged.session : null;

  return {
    ...rawData,
    ...row,
    id,
    session,
    telegramId,
    telegram_id: telegramId,
    tgId: telegramId,
    studentCode,
    student_code: studentCode,
    code: studentCode,
    phone,
    fullNameAm,
    full_name_am: fullNameAm,
    nameAm: fullNameAm,
    fullNameEn,
    full_name_en: fullNameEn,
    nameEn: fullNameEn,
    christianName,
    christian_name: christianName,
    department,
    status,
    role,
    password,
    permissions,
    gradeLevel,
    grade_level: gradeLevel,
    photoUrl,
    photo_url: photoUrl,
    birthDate,
    birth_year: birthDate,
    birthYear: birthDate,
    submittedAt,
    submitted_at: submittedAt,
    address,
    subcity: address,
    emergencyName,
    emergencyPhone,
    emergencyContact,
    emergency_contact: typeof emergencyContact === 'object' ? JSON.stringify(emergencyContact) : emergencyContact,
    data: {
      ...rawData,
      session,
      id,
      studentCode,
      code: studentCode,
      fullNameAm,
      fullNameEn,
      phone,
      telegramId,
      department,
      status,
      christianName,
      address,
      birthDate,
      photoUrl,
    }
  };
}

export function buildSupabaseRow(colName: string, id: string, docData: any): Record<string, any> {
  const norm = normalizeDoc(id, docData);
  const base: Record<string, any> = { id, data: norm };

  if (colName === 'registrations' || colName === 'students') {
    if (norm.studentCode || norm.code) {
      base.code = norm.code || norm.studentCode;
      base.student_code = norm.studentCode || norm.code;
    }
    if (norm.fullNameAm) base.full_name_am = norm.fullNameAm;
    if (norm.fullNameEn) base.full_name_en = norm.fullNameEn;
    if (norm.christianName) base.christian_name = norm.christianName;
    if (norm.birthDate || norm.birthYear) base.birth_year = norm.birthDate || norm.birthYear;
    if (norm.phone) base.phone = norm.phone;
    if (norm.gender) base.gender = norm.gender;
    if (norm.department) base.department = norm.department;
    if (norm.gradeLevel) base.grade_level = norm.gradeLevel;
    if (norm.photoUrl) base.photo_url = norm.photoUrl;
    if (norm.bloodGroup) base.blood_group = norm.bloodGroup;
    if (norm.address || norm.subcity) base.subcity = norm.address || norm.subcity;
    if (norm.status) base.status = norm.status;
    if (norm.telegramId) base.telegram_id = String(norm.telegramId);
    if (norm.telegramUsername) base.telegram_username = norm.telegramUsername;
    if (norm.submittedAt) base.submitted_at = norm.submittedAt;
    if (norm.approvedBy) base.approved_by = norm.approvedBy;
    if (norm.approvedAt) base.approved_at = norm.approvedAt;
    if (norm.consecutiveAbsences !== undefined) base.consecutive_absences = norm.consecutiveAbsences;
    if (norm.emergencyContact) {
      base.emergency_contact = typeof norm.emergencyContact === 'object' ? JSON.stringify(norm.emergencyContact) : norm.emergencyContact;
    } else if (norm.emergencyName || norm.emergencyPhone) {
      base.emergency_contact = JSON.stringify({ name: norm.emergencyName || '', phone: norm.emergencyPhone || '' });
    }
  } else if (colName === 'admins') {
    if (norm.nameAm || norm.name_am) base.name_am = norm.nameAm || norm.name_am;
    if (norm.nameEn || norm.name_en) base.name_en = norm.nameEn || norm.name_en;
    if (norm.role) base.role = norm.role;
    if (norm.department) base.department = norm.department;
    if (norm.phone) base.phone = norm.phone;
    if (norm.password) base.password = norm.password;
    if (norm.permissions) base.permissions = norm.permissions;
    if (norm.status) base.status = norm.status;
    if (norm.customRoleTitle) base.custom_role_title = norm.customRoleTitle;
    if (norm.telegramId) base.telegram_id = String(norm.telegramId);
    if (norm.avatarUrl) base.avatar_url = norm.avatarUrl;
  } else if (colName === 'attendance') {
    if (norm.memberId) base.member_id = norm.memberId;
    if (norm.memberNameAm || norm.nameAm) base.member_name_am = norm.memberNameAm || norm.nameAm;
    if (norm.memberNameEn || norm.nameEn) base.member_name_en = norm.memberNameEn || norm.nameEn;
    if (norm.memberCode || norm.code) base.member_code = norm.memberCode || norm.code;
    if (norm.department) base.department = norm.department;
    if (norm.sessionName) base.session_name = norm.sessionName;
    if (norm.timestamp) base.timestamp = norm.timestamp;
    if (norm.date) base.date = norm.date;
    if (norm.method) base.method = norm.method;
    if (norm.status) base.status = norm.status;
  } else if (colName === 'bot_subscribers') {
    if (norm.telegramId || norm.telegram_id) base.telegram_id = String(norm.telegramId || norm.telegram_id);
    if (norm.chatId || norm.chat_id) base.chat_id = String(norm.chatId || norm.chat_id);
    if (norm.username) base.username = norm.username;
    if (norm.firstName || norm.first_name) base.first_name = norm.firstName || norm.first_name;
    if (norm.lastName || norm.last_name) base.last_name = norm.lastName || norm.last_name;
    if (norm.lastActiveAt || norm.last_active_at) base.last_active_at = norm.lastActiveAt || norm.last_active_at;
    const sessionVal = docData.session !== undefined
      ? docData.session
      : (docData.data?.session !== undefined
        ? docData.data.session
        : (norm.session !== undefined ? norm.session : (norm.data?.session || null)));
    base.data = {
      ...(typeof norm.data === 'object' ? norm.data : {}),
      session: sessionVal,
    };
  } else if (colName === 'support_tickets') {
    if (norm.ticketNumber || norm.ticket_number) base.ticket_number = norm.ticketNumber || norm.ticket_number;
    if (norm.requesterName || norm.requester_name) base.requester_name = norm.requesterName || norm.requester_name;
    if (norm.phone) base.phone = norm.phone;
    if (norm.category) base.category = norm.category;
    if (norm.title) base.title = norm.title;
    if (norm.description) base.description = norm.description;
    if (norm.priority) base.priority = norm.priority;
    if (norm.status) base.status = norm.status;
  } else if (colName === 'leave_requests') {
    if (norm.requestNumber || norm.request_number) base.request_number = norm.requestNumber || norm.request_number;
    if (norm.studentName || norm.student_name) base.student_name = norm.studentName || norm.student_name;
    if (norm.telegramId || norm.telegram_id) base.telegram_id = String(norm.telegramId || norm.telegram_id);
    if (norm.leaveType || norm.leave_type) base.leave_type = norm.leaveType || norm.leave_type;
    if (norm.duration) base.duration = norm.duration;
    if (norm.reason) base.reason = norm.reason;
    if (norm.status) base.status = norm.status;
  }
  return base;
}

export class CollectionQuery {
  private colName: string;
  private constraints: any[] = [];

  constructor(colName: string, constraints: any[] = []) {
    this.colName = colName;
    this.constraints = constraints;
  }

  where(field: string, op: any, val: any): CollectionQuery {
    return new CollectionQuery(this.colName, [...this.constraints, { type: 'where', field, op, val }]);
  }

  orderBy(field: string, dir: any = 'asc'): CollectionQuery {
    return new CollectionQuery(this.colName, [...this.constraints, { type: 'orderBy', field, dir }]);
  }

  limit(n: number): CollectionQuery {
    return new CollectionQuery(this.colName, [...this.constraints, { type: 'limit', n }]);
  }

  async get() {
    let docsMap = new Map<string, any>();

    // 1. Load local documents first
    const colLocal = getCollectionLocal(this.colName);
    Object.entries(colLocal).forEach(([docId, docData]) => {
      if (docData?.status === 'deleted' || docData?.data?.status === 'deleted') return;
      docsMap.set(docId, normalizeDoc(docId, docData));
    });

    // 2. Query Supabase with resilient timeout
    if (supabaseClient) {
      try {
        let query = supabaseClient.from(this.colName).select('*').abortSignal(AbortSignal.timeout(3000));
        
        for (const c of this.constraints) {
          if (c.type === 'where') {
            const colKey = mapFieldToColumn(c.field);
            if (c.op === '==' || c.op === '=') {
              query = query.eq(colKey, c.val);
            } else if (c.op === 'in') {
              query = query.in(colKey, Array.isArray(c.val) ? c.val : [c.val]);
            } else if (c.op === '>=') {
              query = query.gte(colKey, c.val);
            } else if (c.op === '<=') {
              query = query.lte(colKey, c.val);
            }
          } else if (c.type === 'orderBy') {
            const colKey = mapFieldToColumn(c.field);
            query = query.order(colKey, { ascending: c.dir === 'asc' });
          } else if (c.type === 'limit') {
            query = query.limit(c.n);
          }
        }

        const { data, error } = await query;
        if (!error && data) {
          data.forEach((row: any) => {
            const id = String(row.id || row._id || '');
            if (!id) return;
            if (row.status === 'deleted' || row.data?.status === 'deleted') {
              docsMap.delete(id);
              delete colLocal[id];
              return;
            }
            const norm = normalizeDoc(id, row);
            docsMap.set(id, norm);
            colLocal[id] = norm;
          });
          saveLocalStore(localStore);
        }
      } catch {}
    }

    // 3. Filter results locally according to constraints
    let results = Array.from(docsMap.values());

    for (const c of this.constraints) {
      if (c.type === 'where') {
        const { field, op, val } = c;
        results = results.filter((item) => {
          const itemVal = item[field] ?? item[mapFieldToColumn(field)] ?? item.data?.[field];
          if (op === '==' || op === '=') {
            return String(itemVal) === String(val) || itemVal === val;
          }
          if (op === 'in') {
            const arr = Array.isArray(val) ? val.map(String) : [];
            return arr.includes(String(itemVal)) || arr.includes(String(item.phone));
          }
          if (op === '>=') {
            return String(itemVal) >= String(val);
          }
          if (op === '<=') {
            return String(itemVal) <= String(val);
          }
          return true;
        });
      } else if (c.type === 'orderBy') {
        const { field, dir } = c;
        results.sort((a, b) => {
          const va = a[field] || '';
          const vb = b[field] || '';
          return dir === 'desc' ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1);
        });
      } else if (c.type === 'limit') {
        results = results.slice(0, c.n);
      }
    }

    const docs = results.map((item) => ({
      id: item.id,
      data: () => item,
    }));

    return {
      empty: docs.length === 0,
      size: docs.length,
      docs,
    };
  }

  async add(data: any) {
    const newId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const normData = normalizeDoc(newId, data);

    // Save to local DB immediately
    const colLocal = getCollectionLocal(this.colName);
    colLocal[newId] = normData;
    saveLocalStore(localStore);

    // Try saving to Supabase with mapped row
    if (supabaseClient) {
      try {
        const row = buildSupabaseRow(this.colName, newId, data);
        const { error } = await supabaseClient.from(this.colName).upsert(row);
        if (error) {
          console.warn(`Supabase add notice for ${this.colName}:`, error.message);
        }
      } catch (err: any) {
        console.warn(`Supabase add exception for ${this.colName}:`, err?.message || err);
      }
    }

    return { id: newId };
  }

  doc(id: string) {
    const colName = this.colName;
    return {
      async get() {
        const colLocal = getCollectionLocal(colName);
        let item = colLocal[id] ? normalizeDoc(id, colLocal[id]) : null;
        if (item && (item.status === 'deleted' || item.data?.status === 'deleted')) {
          item = null;
        }

        if (supabaseClient && !item) {
          try {
            const { data, error } = await supabaseClient
              .from(colName)
              .select('*')
              .eq('id', id)
              .single();
            if (!error && data) {
              item = normalizeDoc(id, data);
              if (item.status === 'deleted' || item.data?.status === 'deleted') {
                item = null;
              } else {
                colLocal[id] = item;
                saveLocalStore(localStore);
              }
            }
          } catch (err: any) {
            console.warn(`Supabase doc get notice for ${colName}/${id}:`, err?.message || err);
          }
        }

        return {
          id,
          exists: !!item,
          data: () => item,
        };
      },

      async set(data: any, options?: { merge: boolean }) {
        const colLocal = getCollectionLocal(colName);
        let existing = colLocal[id];
        if (!existing && supabaseClient && options?.merge) {
          try {
            const { data: remoteData } = await supabaseClient
              .from(colName)
              .select('*')
              .eq('id', id)
              .maybeSingle();
            if (remoteData) {
              existing = normalizeDoc(id, remoteData);
              colLocal[id] = existing;
            }
          } catch {}
        }
        let sessionToKeep = data.session !== undefined
          ? data.session
          : (existing?.session || existing?.data?.session || null);
        const merged = options?.merge
          ? { ...(existing || {}), ...data, ...(sessionToKeep !== undefined ? { session: sessionToKeep } : {}) }
          : data;
        const norm = normalizeDoc(id, merged);

        colLocal[id] = norm;
        saveLocalStore(localStore);

        if (supabaseClient) {
          try {
            const row = buildSupabaseRow(colName, id, merged);
            await supabaseClient.from(colName).upsert(row);
          } catch (err: any) {
            console.warn(`Supabase set notice for ${colName}/${id}:`, err?.message || err);
          }
        }
      },

      async update(data: any) {
        const colLocal = getCollectionLocal(colName);
        let existing = colLocal[id];
        if (!existing && supabaseClient) {
          try {
            const { data: remoteData } = await supabaseClient
              .from(colName)
              .select('*')
              .eq('id', id)
              .maybeSingle();
            if (remoteData) {
              existing = normalizeDoc(id, remoteData);
              colLocal[id] = existing;
            }
          } catch {}
        }
        const merged = { ...(existing || {}), ...data };
        const norm = normalizeDoc(id, merged);

        colLocal[id] = norm;
        saveLocalStore(localStore);

        if (supabaseClient) {
          try {
            const row = buildSupabaseRow(colName, id, merged);
            await supabaseClient.from(colName).upsert(row);
          } catch (err: any) {
            console.warn(`Supabase update notice for ${colName}/${id}:`, err?.message || err);
          }
        }
      },

      async delete() {
        const colLocal = getCollectionLocal(colName);
        delete colLocal[id];
        saveLocalStore(localStore);

        if (supabaseClient) {
          try {
            await supabaseClient.from(colName).update({
              status: 'deleted',
              data: { status: 'deleted', deletedAt: new Date().toISOString() }
            }).eq('id', id);
            await supabaseClient.from(colName).delete().eq('id', id);
          } catch (err: any) {
            console.warn(`Supabase delete notice for ${colName}/${id}:`, err?.message || err);
          }
        }
      }
    };
  }
}

export const db = {
  collection(name: string) {
    return new CollectionQuery(name);
  },
};
