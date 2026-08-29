import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { HiUser, HiPhone, HiMail, HiStar, HiBriefcase, HiLogout, HiCheckCircle } from 'react-icons/hi';
import { MdHomeRepairService } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function WorkerProfile() {
  const user = useAuthStore(s => s.user);
  const updateWorkerAvailability = useAuthStore(s => s.updateWorkerAvailability);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/worker/signin', { replace: true });
  };

  const INFO = [
    { Icon: HiUser, label: 'Full Name', val: user?.name || 'Dallas Pro Specialist' },
    { Icon: HiPhone, label: 'Phone Number', val: user?.phone || '+1 214-555-0192' },
    { Icon: HiMail, label: 'Dallas Email', val: user?.email || 'john@cleanamericadallas.com' },
    { Icon: MdHomeRepairService, label: 'Pro Specialty & License', val: user?.vehicle || 'Dallas Certified Home Pro • TX License #4920' },
    { Icon: HiStar, label: 'Pro Rating', val: `${user?.rating || 4.9} ★ (Dallas Metro Verified)` },
    { Icon: HiBriefcase, label: 'Completed Jobs', val: `${user?.jobsDone || 142} Orders` },
  ];

  return (
    <div className="worker-page">
      <div className="wp-title">
        <HiUser className="wp-title-icon" />
        <h1>Pro Account Profile</h1>
      </div>

      <div className="worker-header">
        <div className="wh-left">
          <div className="wh-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'P'}</div>
          <div>
            <h1>{user?.name || 'Dallas Pro Specialist'}</h1>
            <p className="wh-vehicle">
              <HiCheckCircle style={{ color: 'var(--primary)', verticalAlign: 'middle', marginRight: 4 }} />
              Certified Dallas Service Provider
            </p>
          </div>
        </div>

        <div className="avail-toggle">
          <span>Dallas Online Status:</span>
          <button
            className={`toggle-btn ${user?.available ? 'on' : 'off'}`}
            onClick={() => user?.id && updateWorkerAvailability(user.id, !user.available)}
          >
            {user?.available ? '● Online' : '○ Offline'}
          </button>
        </div>
      </div>

      <div className="worker-section" style={{ marginTop: 24 }}>
        <h2>Certified Provider Information</h2>
        <div className="profile-info-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
          {INFO.map(({ Icon, label, val }) => (
            <div key={label} className="ws-card" style={{ padding: 18 }}>
              <div className="ws-icon-wrap">
                <Icon style={{ width: 22, height: 22 }} />
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: 2 }}>{label}</span>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 700 }}>{val}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="logout-btn"
        onClick={() => setShowLogout(true)}
        style={{
          marginTop: 32,
          padding: '14px 24px',
          background: 'rgba(211,47,47,0.14)',
          border: '1.5px solid rgba(211,47,47,0.35)',
          color: '#ff6b6b',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <HiLogout style={{ width: 18, height: 18 }} /> Logout Pro Account
      </button>

      {showLogout && (
        <div className="modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3>Logout Pro Account?</h3>
            <p>Are you sure you want to log out of your Dallas Pro Portal?</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="modal-close" onClick={() => setShowLogout(false)}>Cancel</button>
              <button
                className="modal-close"
                onClick={handleLogout}
                style={{ background: 'var(--error)', color: '#fff', border: 'none' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
