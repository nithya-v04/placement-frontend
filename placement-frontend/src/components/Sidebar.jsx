import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Users,
  Building2, PlusSquare, ClipboardList, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STUDENT_LINKS = [
  { to: '/student',              icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/student/jobs',         icon: Briefcase,       label: 'Browse Jobs'     },
  { to: '/student/applications', icon: FileText,        label: 'My Applications' },
];

const COMPANY_LINKS = [
  { to: '/company',              icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/company/jobs',         icon: Briefcase,       label: 'My Jobs'         },
  { to: '/company/post-job',     icon: PlusSquare,      label: 'Post a Job'      },
  { to: '/company/applications', icon: ClipboardList,   label: 'Applications'    },
];

const ADMIN_LINKS = [
  { to: '/admin',                icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/admin/users',          icon: Users,           label: 'Users'           },
  { to: '/admin/jobs',           icon: Briefcase,       label: 'Jobs'            },
  { to: '/admin/applications',   icon: ClipboardList,   label: 'Applications'    },
];

const LINK_MAP = { STUDENT: STUDENT_LINKS, COMPANY: COMPANY_LINKS, ADMIN: ADMIN_LINKS };

export default function Sidebar() {
  const { user } = useAuth();
  const links = LINK_MAP[user?.role] || [];

  return (
    <aside style={{
      position: 'fixed', top: 'var(--nav-h)', left: 0, bottom: 0,
      width: 'var(--sidebar-w)',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '16px 12px',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', padding: '4px 12px', marginBottom: 4, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          Navigation
        </p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/student' || to === '/company' || to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8,
              marginBottom: 2,
              fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-1)' : 'var(--text-2)',
              background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s',
              textDecoration: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} color={isActive ? 'var(--accent)' : 'currentColor'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* bottom spacer */}
      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--border-lite)' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', textAlign: 'center' }}>
          PlaceWise v1.0
        </p>
      </div>
    </aside>
  );
}
