'use client'

export const dynamic = 'force-dynamic';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopnav from '@/components/layout/AdminTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, Plus, Edit, Trash2, Copy, Eye, Search,
  Lock, Unlock, Shield, Users, UserCog, ScrollText,
  CheckCircle, AlertCircle, X, Check, RefreshCw,
} from 'lucide-react';

function getToken(): string {
  try { return JSON.parse(localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}').token || ''; }
  catch { return ''; }
}
function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` } : { 'Content-Type': 'application/json' };
}

const BG       = '#0D1117';
const BG2      = '#131720';
const BG3      = '#181E2A';
const BG4      = '#1C2338';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const BEBAS    = "'Bebas Neue', sans-serif";
const BARLOW   = "'Barlow Condensed', sans-serif";
const GREEN    = '#22C55E';
const RED      = '#EF4444';
const BLUE     = '#3B82F6';
const PURPLE   = '#8B5CF6';
const ORANGE   = '#F97316';
const TEAL     = '#14B8A6';

const MODULES = [
  'Dashboard', 'User Management', 'Talent Verification', 'Agency Verification',
  'Applications', 'Reports & Complaints', 'Fraud Detection', 'Subscriptions',
  'Advertisements', 'CMS Management', 'Notifications', 'Analytics',
  'Support Tickets', 'Audit Logs', 'Roles & Permissions', 'Settings',
];
const ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Export'];

type PermMatrix = Record<string, Record<string, Record<string, boolean>>>;

type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  is_system: boolean;
  permissions: PermMatrix | Record<string, any>;
  created_at: string;
  updated_at: string;
};

function initPerms(roles: string[], allowAll: string[] = [], allowSome: Record<string, string[]> = {}): PermMatrix {
  const m: PermMatrix = {};
  roles.forEach(function(role) {
    m[role] = {};
    MODULES.forEach(function(mod) {
      m[role][mod] = {};
      ACTIONS.forEach(function(act) {
        if (allowAll.includes(role)) m[role][mod][act] = true;
        else if (allowSome[role] && allowSome[role].includes(mod)) m[role][mod][act] = act === 'View' || act === 'Edit';
        else m[role][mod][act] = act === 'View';
      });
    });
  });
  return m;
}

const ROLE_COLORS: Record<string, string> = {
  superadmin: RED, admin: PURPLE, verifier: BLUE,
  'content-mod': GREEN, 'support-agent': TEAL,
};
function getRoleColor(id: string, savedColor?: string): string {
  return savedColor || ROLE_COLORS[id] || PURPLE;
}

const SEED_IDS = ['superadmin', 'admin', 'verifier', 'content-mod', 'support-agent'];
const SEED_PERMS: PermMatrix = initPerms(
  SEED_IDS,
  ['superadmin', 'admin'],
  {
    verifier:       ['Talent Verification', 'Agency Verification', 'Applications', 'Reports & Complaints', 'Audit Logs', 'Support Tickets'],
    'content-mod':  ['CMS Management', 'Notifications', 'Advertisements', 'Analytics'],
    'support-agent':['Support Tickets', 'User Management', 'Audit Logs'],
  }
);

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  is_active: boolean | null;
  last_login_at: string | null;
  profile_number: string | null;
  phone: string | null;
};

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) return name.trim().split(' ').slice(0, 2).map(function(w) { return w[0] || ''; }).join('').toUpperCase();
  return email.slice(0, 2).toUpperCase();
}

function fmtDate(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calcAccessPct(roleId: string, perms: PermMatrix): number {
  const rolePerm = perms[roleId];
  if (!rolePerm) return 0;
  const total   = MODULES.length * ACTIONS.length;
  const enabled = MODULES.reduce(function(acc, mod) {
    return acc + ACTIONS.filter(function(act) { return rolePerm[mod]?.[act]; }).length;
  }, 0);
  return Math.round((enabled / total) * 100);
}

/* Toast */
function Toast(props: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(function() { const t = setTimeout(props.onDone, 3000); return function() { clearTimeout(t); }; }, [props.onDone]);
  return (
    <div style={{ position: 'fixed' as const, bottom: 28, right: 28, zIndex: 300, background: props.type === 'success' ? GREEN : RED, color: '#000', padding: '12px 20px', borderRadius: 10, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      {props.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {props.msg}
    </div>
  );
}

/* Confirm Modal */
function ConfirmModal(props: { title: string; message: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={props.onCancel}>
      <div style={{ background: BG3, border: '1px solid ' + (props.danger ? 'rgba(239,68,68,0.3)' : GOLD_BDR), borderRadius: 14, padding: 28, width: 400, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
        onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ fontFamily: BEBAS, fontSize: 20, color: props.danger ? RED : '#F5F5F5', marginBottom: 10 }}>{props.title}</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.6 }}>{props.message}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={props.onCancel} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={props.onConfirm} style={{ flex: 1, padding: '10px', background: props.danger ? RED : GOLD, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function RolesPermissionsPage() {
  const router = useRouter();
  const [_collapsed,    setCollapsed]    = useState(false);
  const [selectedRole,  setSelectedRole] = useState('admin');
  const [activeTab,     setActiveTab]    = useState<'roles'|'permissions'|'users'>('roles');
  const [perms,         setPerms]        = useState<PermMatrix>(SEED_PERMS);
  const [search,        setSearch]       = useState('');
  const [roleSearch,    setRoleSearch]   = useState('');
  const [showNewRole,   setShowNewRole]  = useState(false);
  const [newRoleName,   setNewRoleName]  = useState('');
  const [newRoleDesc,   setNewRoleDesc]  = useState('');
  const [newRoleBase,   setNewRoleBase]  = useState('Start from scratch');
  const [saved,         setSaved]        = useState(false);
  const [rolesLoading,  setRolesLoading] = useState(true);
  const [roles,         setRoles]        = useState<Array<{ id: string; name: string; color: string; users: number; description: string; system: boolean }>>([]);
  const [toast,         setToast]        = useState<{ msg: string; type: 'success'|'error' } | null>(null);
  const [confirm,       setConfirm]      = useState<{ title: string; message: string; danger?: boolean; onConfirm: () => void } | null>(null);

  // Admin users from Supabase
  const [adminUsers,    setAdminUsers]   = useState<AdminUser[]>([]);
  const [usersLoading,  setUsersLoading] = useState(true);

  const showToast = useCallback(function(msg: string, type: 'success'|'error' = 'success') {
    setToast({ msg, type });
  }, []);

  const fetchRoles = useCallback(async function() {
    setRolesLoading(true);
    try {
      const res = await fetch('/api/admin/roles', { headers: authHeaders() });
      const d = await res.json();
      const data: RoleRow[] = d?.roles ?? d?.data?.roles ?? [];
      if (!res.ok) throw new Error((d.data ?? d)?.error || 'Failed');
      const mapped = data.map(function(r) {
        return {
          id: r.id, name: r.name,
          color: getRoleColor(r.id, r.color),
          users: 0,
          description: r.description || '',
          system: r.is_system,
        };
      });
      setRoles(mapped);
      const dbPerms: PermMatrix = Object.assign({}, SEED_PERMS);
      data.forEach(function(r) {
        if (r.permissions && Object.keys(r.permissions).length > 0) {
          dbPerms[r.id] = r.permissions as PermMatrix[string];
        }
      });
      setPerms(dbPerms);
    } catch {
      showToast('Roles table not found — showing default roles.', 'error');
      // Fall back to seed roles so page is still useful
      setRoles(SEED_IDS.map(function(id) {
        return { id, name: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g,' '), color: getRoleColor(id), users: 0, description: '', system: true };
      }));
    }
    setRolesLoading(false);
  }, [showToast]);

  const fetchAdminUsers = useCallback(async function() {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users?role=admin&limit=50', { headers: authHeaders() });
      const d = await res.json();
      const allAdmins: AdminUser[] = (d.data ?? d)?.users ?? [];
      setAdminUsers(allAdmins);
      const roleCounts: Record<string, number> = {};
      allAdmins.forEach(function(u: any) {
        const rid = u.role_id || u.role;
        roleCounts[rid] = (roleCounts[rid] || 0) + 1;
      });
      setRoles(function(prev) {
        return prev.map(function(r) { return Object.assign({}, r, { users: roleCounts[r.id] || 0 }); });
      });
    } catch {
      showToast('Failed to load admin users.', 'error');
    }
    setUsersLoading(false);
  }, [showToast]);

  useEffect(function() { fetchRoles(); fetchAdminUsers(); }, [fetchRoles, fetchAdminUsers]);

  const filteredUsers = adminUsers.filter(function(u) {
    const q = search.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
  });

  function togglePerm(role: string, mod: string, act: string) {
    if (role === 'superadmin' || role === 'admin') {
      showToast('System roles cannot be modified.', 'error');
      return;
    }
    setPerms(function(prev) {
      return Object.assign({}, prev, {
        [role]: Object.assign({}, prev[role], {
          [mod]: Object.assign({}, prev[role][mod], { [act]: !prev[role][mod][act] }),
        }),
      });
    });
  }

  function toggleModule(role: string, mod: string) {
    if (role === 'superadmin' || role === 'admin') {
      showToast('System roles cannot be modified.', 'error');
      return;
    }
    const allOn = ACTIONS.every(function(a) { return perms[role]?.[mod]?.[a]; });
    setPerms(function(prev) {
      const newMod: Record<string, boolean> = {};
      ACTIONS.forEach(function(a) { newMod[a] = !allOn; });
      return Object.assign({}, prev, {
        [role]: Object.assign({}, prev[role], { [mod]: newMod }),
      });
    });
  }

  async function handleSave() {
    const rolePerms = perms[selectedRole] || {};
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ id: selectedRole, permissions: rolePerms }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error((d.data ?? d)?.error || 'Failed');
      setSaved(true);
      showToast('Permissions saved successfully.');
      setTimeout(function() { setSaved(false); }, 2500);
    } catch (e: any) {
      showToast(e.message || 'Failed to save permissions.', 'error');
    }
  }

  async function handleCreateRole() {
    if (!newRoleName.trim()) { showToast('Please enter a role name.', 'error'); return; }
    const newId = newRoleName.toLowerCase().replace(/\s+/g, '-');
    const basePerms = newRoleBase !== 'Start from scratch'
      ? JSON.parse(JSON.stringify(perms[roles.find(function(r) { return r.name === newRoleBase; })?.id || 'admin'] || {}))
      : initPerms([newId])[newId];
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          id: newId, name: newRoleName.trim(),
          description: newRoleDesc.trim() || 'Custom admin role.',
          color: TEAL, is_system: false,
          permissions: basePerms,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error((d.data ?? d)?.error || 'Failed');
      setPerms(function(prev) { return Object.assign({}, prev, { [newId]: basePerms }); });
      setShowNewRole(false);
      setNewRoleName(''); setNewRoleDesc(''); setNewRoleBase('Start from scratch');
      showToast('Role "' + newRoleName.trim() + '" created. Set permissions in the matrix.');
      fetchRoles();
      setActiveTab('permissions');
      setSelectedRole(newId);
    } catch (e: any) {
      showToast('Failed to create role: ' + (e.message || ''), 'error');
    }
  }

  async function toggleUserStatus(user: AdminUser) {
    const next = !user.is_active;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ user_id: user.id, action: next ? 'activate' : 'suspend' }),
      });
      if (!res.ok) throw new Error('Failed');
      showToast((user.name || user.email) + ' set to ' + (next ? 'Active' : 'Inactive') + '.');
      fetchAdminUsers();
    } catch { showToast('Failed to update user status.', 'error'); }
  }

  const selectedRoleData = roles.find(function(r) { return r.id === selectedRole; }) || roles[0];
  const isSystemRole = selectedRoleData?.system || selectedRoleData?.id === 'admin' || selectedRoleData?.id === 'superadmin';

  const activeUsersCount   = adminUsers.filter(function(u) { return u.is_active !== false; }).length;
  const inactiveUsersCount = adminUsers.filter(function(u) { return u.is_active === false; }).length;

  const statCards = [
    { icon: '🛡️', label: 'Total Roles',      value: roles.length,         color: PURPLE, tab: 'roles',       sub: roles.filter(function(r) { return !r.system; }).length + ' custom roles' },
    { icon: '👥', label: 'Admin Users',      value: adminUsers.length,    color: BLUE,   tab: 'users',       sub: 'Click to manage users' },
    { icon: '✅', label: 'Active Users',     value: activeUsersCount,     color: GREEN,  tab: 'users',       sub: inactiveUsersCount + ' inactive' },
    { icon: '🔒', label: 'System Roles',     value: roles.filter(function(r) { return r.system; }).length, color: ORANGE, tab: 'permissions', sub: 'Cannot be modified' },
  ];

  const cardStyle: React.CSSProperties = { background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 };
  const selStyle: React.CSSProperties = {
    background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '6px 24px 6px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={setCollapsed} />

        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 24px 32px', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={function() { router.push('/admin/dashboard'); }} style={{ cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Roles & Permissions</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Roles & Permissions
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Manage admin roles, define access levels and control what each role can do.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={function() { router.push('/admin/audit'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}
                onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
                onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                <ScrollText size={14} /> View Audit Log
              </button>
              <button onClick={function() { setShowNewRole(true); }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}
                onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}>
                <Plus size={15} /> Create New Role
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {statCards.map(function(s) {
              return (
                <div key={s.label}
                  onClick={function() { if (s.tab) setActiveTab(s.tab as any); }}
                  style={{ flex: 1, background: BG3, border: '1px solid ' + (activeTab === s.tab ? s.color + '55' : 'rgba(255,255,255,0.06)'), borderRadius: 12, padding: '16px 18px', cursor: s.tab ? 'pointer' : 'default', transition: 'border 0.2s' }}
                  onMouseEnter={function(e) { if (s.tab) e.currentTarget.style.borderColor = s.color + '55'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = activeTab === s.tab ? s.color + '55' : 'rgba(255,255,255,0.06)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: s.color + '22', border: '1px solid ' + s.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily: BEBAS, fontSize: 34, color: '#F5F5F5', lineHeight: 1, marginBottom: 4, letterSpacing: 0.5 }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>}
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 0 }}>
            {(['roles', 'permissions', 'users'] as const).map(function(t) {
              return (
                <button key={t} onClick={function() { setActiveTab(t); }}
                  style={{ padding: '11px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 16, fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? PURPLE : 'rgba(255,255,255,0.5)', borderBottom: activeTab === t ? '2px solid ' + PURPLE : '2px solid transparent', textTransform: 'capitalize' as const }}>
                  {t === 'roles' ? 'Roles (' + roles.length + ')' : t === 'permissions' ? 'Permissions Matrix' : 'Admin Users (' + adminUsers.length + ')'}
                </button>
              );
            })}
          </div>

          {/* ── TAB: ROLES ── */}
          {activeTab === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              {rolesLoading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {Array.from({ length: 5 }).map(function(_, i) {
                    return <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, height: 240 }} />;
                  })}
                </div>
              ) : null}

              {!rolesLoading && (
              <div style={{ position: 'relative' as const, maxWidth: 340 }}>
                <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={roleSearch} onChange={function(e) { setRoleSearch(e.target.value); }} placeholder="Search roles..."
                  style={{ width: '100%', padding: '8px 12px 8px 32px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>)}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {roles.filter(function(r) { return r.name.toLowerCase().includes(roleSearch.toLowerCase()); }).map(function(role) {
                  const pct = calcAccessPct(role.id, perms);
                  return (
                    <div key={role.id} style={{ ...cardStyle, padding: 20, position: 'relative' as const, transition: 'border 0.2s' }}
                      onMouseEnter={function(e) { e.currentTarget.style.borderColor = role.color + '40'; }}
                      onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                      {role.system && (
                        <div style={{ position: 'absolute' as const, top: 14, right: 14, padding: '2px 8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 12, color: RED, fontWeight: 600 }}>System</div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 12, background: role.color + '20', border: '2px solid ' + role.color + '50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Shield size={22} color={role.color} />
                        </div>
                        <div>
                          <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', letterSpacing: 0.5 }}>{role.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <Users size={12} color="rgba(255,255,255,0.4)" />
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{role.users} users</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 16, minHeight: 42 }}>{role.description}</p>
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Access Level</span>
                          <span style={{ fontSize: 13, color: role.color, fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                          <div style={{ height: '100%', borderRadius: 3, background: role.color, width: pct + '%', transition: 'width 0.4s' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={function() { setSelectedRole(role.id); setActiveTab('permissions'); }}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: role.color + '15', border: '1px solid ' + role.color + '40', borderRadius: 7, color: role.color, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                          onMouseEnter={function(e) { e.currentTarget.style.background = role.color + '25'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = role.color + '15'; }}>
                          <Shield size={13} /> Edit Permissions
                        </button>
                        {!role.system && (
                          <button
                            onClick={function() {
                              setConfirm({
                                title: 'Delete Role',
                                message: 'Delete role "' + role.name + '"? This action cannot be undone.',
                                danger: true,
                                 onConfirm: async function() {
                                  try {
                                    const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: 'DELETE', headers: authHeaders() });
                                    if (!res.ok) throw new Error('Failed');
                                    showToast('Role "' + role.name + '" deleted.'); fetchRoles();
                                  } catch { showToast('Failed to delete role.', 'error'); }
                                  setConfirm(null);
                                },
                              });
                            }}
                            style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, color: RED, cursor: 'pointer' }}
                            onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                            onMouseLeave={function(e) { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={async function() {
                            const dupId   = role.id + '-copy';
                            const dupName = role.name + ' (Copy)';
                            const dupPerms = JSON.parse(JSON.stringify(perms[role.id] || {}));
                            try {
                              const res = await fetch('/api/admin/roles', {
                                method: 'POST', headers: authHeaders(),
                                body: JSON.stringify({ id: dupId, name: dupName, description: role.description, color: role.color, is_system: false, permissions: dupPerms }),
                              });
                              if (!res.ok) throw new Error('Failed');
                              showToast('Role "' + dupName + '" duplicated successfully.');
                              fetchRoles();
                            } catch { showToast('Failed to duplicate role.', 'error'); }
                          }}
                          style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                          onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add new role card */}
                <div onClick={function() { setShowNewRole(true); }}
                  style={{ ...cardStyle, padding: 20, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', border: '1px dashed rgba(139,92,246,0.3)', minHeight: 200 }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = PURPLE; e.currentTarget.style.background = PURPLE + '08'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.background = BG3; }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: PURPLE + '15', border: '1px dashed ' + PURPLE + '50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={22} color={PURPLE} />
                  </div>
                  <div style={{ fontSize: 15, color: PURPLE, fontWeight: 700, fontFamily: BARLOW }}>Create New Role</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center' as const }}>Define a custom role with specific permissions</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: PERMISSIONS MATRIX ── */}
          {activeTab === 'permissions' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Editing permissions for:</div>
                  <select value={selectedRole} onChange={function(e) { setSelectedRole(e.target.value); }} style={{ ...selStyle, background: BG3 }}>
                    {roles.map(function(r) { return <option key={r.id} value={r.id} style={{ background: BG3 }}>{r.name}</option>; })}
                  </select>
                  {isSystemRole && (
                    <span style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, fontSize: 13, color: RED, fontWeight: 600 }}>
                      System Role — Read Only
                    </span>
                  )}
                </div>
                <button onClick={handleSave} disabled={isSystemRole}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: saved ? GREEN : isSystemRole ? 'rgba(255,255,255,0.05)' : PURPLE, border: 'none', borderRadius: 7, color: isSystemRole ? 'rgba(255,255,255,0.3)' : '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: isSystemRole ? 'not-allowed' : 'pointer', transition: 'background 0.3s' }}>
                  {saved ? <><CheckCircle size={14} /> Saved!</> : <><Check size={14} /> Save Changes</>}
                </button>
              </div>

              {isSystemRole && (
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  System roles (Super Admin, Admin) have full access by default and cannot be modified to protect platform security.
                </div>
              )}

              <div style={{ ...cardStyle, overflow: 'hidden' }}>
                {/* Matrix header */}
                <div style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, 1fr)', padding: '10px 16px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>MODULE</div>
                  {ACTIONS.map(function(a) {
                    return <div key={a} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textAlign: 'center' as const }}>{a.toUpperCase()}</div>;
                  })}
                </div>
                {MODULES.map(function(mod, mi) {
                  const allOn = ACTIONS.every(function(a) { return perms[selectedRole]?.[mod]?.[a]; });
                  return (
                    <div key={mod} style={{ display: 'grid', gridTemplateColumns: '220px repeat(5, 1fr)', padding: '11px 16px', borderBottom: mi < MODULES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', background: mi % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = mi % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div onClick={function() { toggleModule(selectedRole, mod); }}
                          style={{ width: 18, height: 18, borderRadius: 4, background: allOn ? PURPLE + '30' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (allOn ? PURPLE : 'rgba(255,255,255,0.15)'), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isSystemRole ? 'not-allowed' : 'pointer', flexShrink: 0 }}>
                          {allOn && <Check size={11} color={PURPLE} />}
                        </div>
                        <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 500 }}>{mod}</span>
                      </div>
                      {ACTIONS.map(function(act) {
                        const on = perms[selectedRole]?.[mod]?.[act] || false;
                        return (
                          <div key={act} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div onClick={function() { togglePerm(selectedRole, mod, act); }}
                              style={{ width: 22, height: 22, borderRadius: 5, background: on ? (act === 'Delete' ? RED + '25' : GREEN + '20') : 'rgba(255,255,255,0.05)', border: '1px solid ' + (on ? (act === 'Delete' ? RED + '60' : GREEN + '50') : 'rgba(255,255,255,0.12)'), display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isSystemRole ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
                              {on && <Check size={12} color={act === 'Delete' ? RED : GREEN} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: GREEN + '20', border: '1px solid ' + GREEN + '50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={9} color={GREEN} /></div>
                  Allowed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  Not Allowed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: RED + '25', border: '1px solid ' + RED + '60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={9} color={RED} /></div>
                  Delete (High Risk)
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: ADMIN USERS ── */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ position: 'relative' as const, flex: 1, maxWidth: 360 }}>
                  <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search by name, email or role..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
                <button onClick={fetchAdminUsers} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                  <RefreshCw size={13} /> Refresh
                </button>
                <button onClick={function() { router.push('/admin/users'); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  <Users size={14} /> Manage All Users
                </button>
              </div>

              <div style={{ ...cardStyle, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.4fr 1fr 1.2fr 1fr', padding: '10px 16px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['NAME', 'EMAIL', 'ROLE', 'STATUS', 'LAST LOGIN', 'ACTIONS'].map(function(h) {
                    return <div key={h} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{h}</div>;
                  })}
                </div>

                {usersLoading ? (
                  Array.from({ length: 5 }).map(function(_, i) {
                    return (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.4fr 1fr 1.2fr 1fr', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 8 }}>
                        {Array.from({ length: 6 }).map(function(_, j) { return <div key={j} style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />; })}
                      </div>
                    );
                  })
                ) : filteredUsers.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
                    {search ? 'No users match your search.' : 'No admin users found.'}
                  </div>
                ) : filteredUsers.map(function(u, i) {
                  const isActive = u.is_active !== false;
                  const roleInfo = roles.find(function(r) { return r.id === u.role; });
                  return (
                    <div key={u.id}
                      style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.4fr 1fr 1.2fr 1fr', padding: '12px 16px', borderBottom: i < filteredUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{getInitials(u.name, u.email)}</div>
                        <div>
                          <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600 }}>{u.name || 'Unnamed'}</div>
                          {u.profile_number && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{u.profile_number}</div>}
                        </div>
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{u.email}</div>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: (roleInfo?.color || PURPLE) + '18', border: '1px solid ' + (roleInfo?.color || PURPLE) + '40', borderRadius: 12, fontSize: 13, color: roleInfo?.color || PURPLE, fontWeight: 600, textTransform: 'capitalize' as const }}>
                          {roleInfo?.name || u.role}
                        </span>
                      </div>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: isActive ? GREEN + '15' : 'rgba(107,114,128,0.15)', border: '1px solid ' + (isActive ? GREEN : '#6B7280') + '40', borderRadius: 12, fontSize: 13, color: isActive ? GREEN : '#9CA3AF', fontWeight: 600 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? GREEN : '#6B7280', display: 'inline-block' }} />
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{fmtDate(u.last_login_at)}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={function() { router.push('/admin/users'); }} title="View in User Management"
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                          onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={function() {
                            setConfirm({
                              title: isActive ? 'Deactivate User' : 'Activate User',
                              message: isActive
                                ? 'Revoke access for ' + (u.name || u.email) + '? They will not be able to log in.'
                                : 'Restore access for ' + (u.name || u.email) + '?',
                              danger: isActive,
                              onConfirm: function() { setConfirm(null); toggleUserStatus(u); },
                            });
                          }}
                          title={isActive ? 'Revoke Access' : 'Restore Access'}
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: '1px solid ' + (isActive ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'), borderRadius: 6, color: isActive ? RED : GREEN, cursor: 'pointer' }}
                          onMouseEnter={function(e) { e.currentTarget.style.opacity = '0.75'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.opacity = '1'; }}>
                          {isActive ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
                Showing {filteredUsers.length} of {adminUsers.length} admin users. To add new admin users, go to User Management.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Create Role Modal */}
      {showNewRole && (
        <div onClick={function() { setShowNewRole(false); }} style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={function(e) { e.stopPropagation(); }} style={{ width: 460, background: BG3, border: '1px solid ' + GOLD_BDR, borderRadius: 14, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#F5F5F5' }}>Create New Role</div>
              <button onClick={function() { setShowNewRole(false); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Role Name *</label>
                <input value={newRoleName} onChange={function(e) { setNewRoleName(e.target.value); }} placeholder="e.g. Finance Manager"
                  style={{ width: '100%', padding: '10px 12px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Description</label>
                <input value={newRoleDesc} onChange={function(e) { setNewRoleDesc(e.target.value); }} placeholder="Brief description of this role's responsibilities"
                  style={{ width: '100%', padding: '10px 12px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Base Permissions From</label>
                <select value={newRoleBase} onChange={function(e) { setNewRoleBase(e.target.value); }}
                  style={{ ...selStyle, width: '100%', background: BG4 }}>
                  {['Start from scratch'].concat(roles.map(function(r) { return r.name; })).map(function(o) {
                    return <option key={o} style={{ background: BG3 }}>{o}</option>;
                  })}
                </select>
              </div>
              <div style={{ padding: '10px 14px', background: PURPLE + '10', border: '1px solid ' + PURPLE + '30', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                After creating, you can fine-tune individual permissions in the Permissions Matrix tab.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={function() { setShowNewRole(false); setNewRoleName(''); setNewRoleDesc(''); }}
                  style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleCreateRole}
                  style={{ flex: 2, padding: '10px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  Create Role & Set Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && <ConfirmModal title={confirm.title} message={confirm.message} danger={confirm.danger} onConfirm={confirm.onConfirm} onCancel={function() { setConfirm(null); }} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={function() { setToast(null); }} />}
    </div>
  );
}