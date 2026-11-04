import { supabase } from './supabase';

export const db = {};
export const auth = { currentUser: null };

export function serverTimestamp(): string {
  return new Date().toISOString();
}

export function collection(_dbInstance: any, name: string): any {
  return { name, type: 'collection' };
}

export function doc(_dbInstance: any, name: string, id?: string): any {
  return { name, id: id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, type: 'doc' };
}

export function query(collectionOrQuery: any, ...constraints: any[]): any {
  const name = collectionOrQuery?.name || 'students';
  const existingConstraints = collectionOrQuery?.constraints || [];
  return { name, constraints: [...existingConstraints, ...constraints], type: 'query' };
}

export function where(field: string, op: string, value: any): any {
  return { type: 'where', field, op, value };
}

export function limit(n: number): any {
  return { type: 'limit', n };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): any {
  return { type: 'orderBy', field, direction };
}

export interface QueryDocumentSnapshot {
  id: string;
  exists: () => boolean;
  data: () => any;
}

export interface QuerySnapshot {
  docs: QueryDocumentSnapshot[];
  empty: boolean;
  size: number;
  docChanges: () => { type: string; doc: QueryDocumentSnapshot }[];
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

export function normalizeDoc(id: string, row: any): any {
  if (!row) return null;
  const rawData = (row.data && typeof row.data === 'object') ? row.data : {};

  const telegramId = String(row.telegram_id || row.telegramId || rawData.telegramId || rawData.telegram_id || '');
  const studentCode = row.student_code || row.studentCode || row.code || rawData.studentCode || rawData.code || '';
  const phone = row.phone || rawData.phone || '';
  const fullNameAm = row.full_name_am || row.fullNameAm || row.name_am || row.nameAm || rawData.fullNameAm || rawData.nameAm || '';
  const fullNameEn = row.full_name_en || row.fullNameEn || row.name_en || row.nameEn || rawData.fullNameEn || rawData.nameEn || '';
  const christianName = row.christian_name || row.christianName || rawData.christianName || '';
  const department = row.department || rawData.department || '';
  const status = row.status || rawData.status || 'pending';
  const role = row.role || rawData.role || 'student';
  const password = row.password || rawData.password || '';
  const permissions = row.permissions || rawData.permissions || null;
  const gradeLevel = row.grade_level || row.gradeLevel || rawData.gradeLevel || '';
  const photoUrl = row.photo_url || row.photoUrl || rawData.photoUrl || '';
  const birthDate = row.birth_year || row.birthDate || row.birthYear || rawData.birthDate || rawData.birthYear || '';
  const submittedAt = row.submitted_at || row.submittedAt || rawData.submittedAt || '';
  const address = row.subcity || row.address || rawData.address || rawData.subcity || '';
  const emergencyContact = row.emergency_contact || rawData.emergencyContact || '';
  const emergencyName = rawData.emergencyName || (typeof emergencyContact === 'string' ? emergencyContact : emergencyContact?.name) || '';
  const emergencyPhone = rawData.emergencyPhone || (typeof emergencyContact === 'object' ? emergencyContact?.phone : '') || '';
  const session = row.session !== undefined ? row.session : (rawData.session || null);

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
    const sessionVal = docData.session !== undefined ? docData.session : (norm.session || null);
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

function getLocalCache(colName: string): any[] {
  try {
    const raw = localStorage.getItem(`ww_supabase_${colName}_cache`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function setLocalCache(colName: string, items: any[]) {
  try {
    localStorage.setItem(`ww_supabase_${colName}_cache`, JSON.stringify(items));
  } catch {}
}

export async function getDocs(q: any): Promise<QuerySnapshot> {
  const colName = q?.name || 'students';
  const constraints = q?.constraints || [];

  try {
    let queryBuilder = supabase.from(colName).select('*');

    for (const c of constraints) {
      if (c.type === 'where') {
        const colKey = mapFieldToColumn(c.field);
        if (c.op === '==' || c.op === '=') {
          queryBuilder = queryBuilder.eq(colKey, c.value);
        } else if (c.op === 'in') {
          queryBuilder = queryBuilder.in(colKey, Array.isArray(c.value) ? c.value : [c.value]);
        } else if (c.op === '>=') {
          queryBuilder = queryBuilder.gte(colKey, c.value);
        } else if (c.op === '<=') {
          queryBuilder = queryBuilder.lte(colKey, c.value);
        }
      } else if (c.type === 'orderBy') {
        const colKey = mapFieldToColumn(c.field);
        queryBuilder = queryBuilder.order(colKey, { ascending: c.direction === 'asc' });
      } else if (c.type === 'limit') {
        queryBuilder = queryBuilder.limit(c.n);
      }
    }

    const { data, error } = await queryBuilder;
    if (error) {
      console.warn(`Supabase getDocs notice for ${colName}, retrying full fetch:`, error.message);
      const { data: allData } = await supabase.from(colName).select('*').limit(100);
      if (allData) {
        const items = allData.map((item: any) => normalizeDoc(item.id, item));
        setLocalCache(colName, items);
        const docs: QueryDocumentSnapshot[] = items.map((norm: any) => ({
          id: norm.id,
          exists: () => true,
          data: () => norm,
        }));
        return {
          docs,
          empty: docs.length === 0,
          size: docs.length,
          docChanges: () => docs.map((d) => ({ type: 'added', doc: d })),
        };
      }
      throw error;
    }

    const items = (data || []).map((item: any) => normalizeDoc(item.id, item));
    setLocalCache(colName, items);

    const docs: QueryDocumentSnapshot[] = items.map((norm: any) => ({
      id: norm.id || String(norm.student_id || Math.random()),
      exists: () => true,
      data: () => norm,
    }));

    return {
      docs,
      empty: docs.length === 0,
      size: docs.length,
      docChanges: () => docs.map((d) => ({ type: 'added', doc: d })),
    };
  } catch (err: any) {
    console.warn(`Supabase getDocs notice for ${colName}, serving from local cache:`, err?.message || err);
    const cached = getLocalCache(colName);
    const docs: QueryDocumentSnapshot[] = cached.map((item: any) => {
      const norm = normalizeDoc(item.id, item);
      return {
        id: norm.id || `doc_${Math.random()}`,
        exists: () => true,
        data: () => norm,
      };
    });

    return {
      docs,
      empty: docs.length === 0,
      size: docs.length,
      docChanges: () => docs.map((d) => ({ type: 'added', doc: d })),
    };
  }
}

export async function getDoc(docRef: any): Promise<QueryDocumentSnapshot> {
  const colName = docRef?.name || 'students';
  const id = docRef?.id;
  if (!id) return { id: '', exists: () => false, data: () => null };

  try {
    const { data, error } = await supabase.from(colName).select('*').eq('id', id).single();
    if (!error && data) {
      const norm = normalizeDoc(data.id || id, data);
      return {
        id: norm.id,
        exists: () => true,
        data: () => norm,
      };
    }
  } catch (err: any) {
    console.warn(`Supabase getDoc notice for ${colName}/${id}:`, err?.message || err);
  }

  const cached = getLocalCache(colName);
  const found = cached.find((item: any) => item.id === id);
  if (found) {
    const norm = normalizeDoc(id, found);
    return {
      id: id,
      exists: () => true,
      data: () => norm,
    };
  }

  return {
    id: id,
    exists: () => false,
    data: () => null,
  };
}

export async function setDoc(docRef: any, data: any, options?: any): Promise<void> {
  const colName = docRef?.name || 'students';
  const id = docRef?.id || `doc_${Date.now()}`;
  const norm = normalizeDoc(id, data);

  const cached = getLocalCache(colName);
  const existingIdx = cached.findIndex((item) => item.id === id);
  const merged = options?.merge && existingIdx >= 0 ? { ...cached[existingIdx], ...norm } : norm;

  if (existingIdx >= 0) {
    cached[existingIdx] = merged;
  } else {
    cached.push(merged);
  }
  setLocalCache(colName, cached);

  try {
    const row = buildSupabaseRow(colName, id, merged);
    const { error } = await supabase.from(colName).upsert(row, { onConflict: 'id' });
    if (error) console.warn(`Supabase setDoc upsert notice for ${colName}/${id}:`, error.message);
  } catch (err: any) {
    console.warn(`Supabase setDoc error for ${colName}/${id}:`, err?.message || err);
  }
}

export async function addDoc(collectionRef: any, data: any): Promise<{ id: string }> {
  const colName = collectionRef?.name || 'students';
  const newId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const norm = normalizeDoc(newId, data);

  const cached = getLocalCache(colName);
  cached.push(norm);
  setLocalCache(colName, cached);

  try {
    const row = buildSupabaseRow(colName, newId, norm);
    const { error } = await supabase.from(colName).insert([row]);
    if (error) console.warn(`Supabase addDoc insert notice for ${colName}:`, error.message);
  } catch (err: any) {
    console.warn(`Supabase addDoc error for ${colName}:`, err?.message || err);
  }

  return { id: newId };
}

export async function updateDoc(docRef: any, data: any): Promise<void> {
  const colName = docRef?.name || 'students';
  const id = docRef?.id;
  if (!id) return;

  const cached = getLocalCache(colName);
  const existingIdx = cached.findIndex((item) => item.id === id);
  const merged = existingIdx >= 0 ? { ...cached[existingIdx], ...data } : { ...data, id };
  const norm = normalizeDoc(id, merged);

  if (existingIdx >= 0) {
    cached[existingIdx] = norm;
    setLocalCache(colName, cached);
  }

  try {
    const row = buildSupabaseRow(colName, id, norm);
    const { error } = await supabase.from(colName).upsert(row, { onConflict: 'id' });
    if (error) console.warn(`Supabase updateDoc notice for ${colName}/${id}:`, error.message);
  } catch (err: any) {
    console.warn(`Supabase updateDoc error for ${colName}/${id}:`, err?.message || err);
  }
}

export async function deleteDoc(docRef: any): Promise<void> {
  const colName = docRef?.name || 'students';
  const id = docRef?.id;
  if (!id) return;

  const cached = getLocalCache(colName);
  const filtered = cached.filter((item) => item.id !== id);
  setLocalCache(colName, filtered);

  try {
    const { error } = await supabase.from(colName).delete().eq('id', id);
    if (error) console.warn(`Supabase deleteDoc notice for ${colName}/${id}:`, error.message);
  } catch (err: any) {
    console.warn(`Supabase deleteDoc error for ${colName}/${id}:`, err?.message || err);
  }
}

export function onSnapshot(refOrQuery: any, callback: (snapshot: any) => void, _errorCallback?: (error: any) => void): () => void {
  const isDoc = refOrQuery?.type === 'doc';

  if (isDoc) {
    getDoc(refOrQuery).then(callback).catch(() => {});
  } else {
    getDocs(refOrQuery).then(callback).catch(() => {});
  }

  const interval = setInterval(async () => {
    try {
      if (isDoc) {
        const docSnap = await getDoc(refOrQuery);
        callback(docSnap);
      } else {
        const querySnap = await getDocs(refOrQuery);
        callback(querySnap);
      }
    } catch {}
  }, 3000);

  return () => clearInterval(interval);
}
