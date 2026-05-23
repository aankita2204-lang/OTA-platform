import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useAppContext } from '../../contexts/AppContext';
import { Modal } from '../shared/Modal';
import { NavTab } from '../../config/tenants';

interface NavbarProps {
  blockConfig: {
    variant: number;
    colorOverride?: string;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ blockConfig }) => {
  const { config, setTenant, availableTenants } = useConfig();
  const { navigation, name, navbar } = config;
  const { variant, colorOverride } = blockConfig;
  const { activeTab, setActiveTab, loggedInUser, setLoggedInUser } = useAppContext();
  const [showLogin, setShowLogin] = useState(false);

  const primaryColor = colorOverride || 'var(--accent-color)';

  const getLayoutStyle = (): React.CSSProperties => {
    switch (variant) {
      case 2:
        return { padding: '24px 48px', borderBottom: `4px solid ${primaryColor}`, borderRadius: 0 };
      case 3:
        return { borderRadius: '99px', margin: '20px 40px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' };
      case 4:
        return { flexDirection: 'column', gap: '16px', padding: '32px' };
      default:
        return { padding: '16px 32px', margin: '20px', borderRadius: 'var(--border-radius-base)', borderBottom: `2px solid ${primaryColor}` };
    }
  };

  return (
    <>
      <nav 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          transition: 'all 0.3s ease',
          ...getLayoutStyle()
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '24px', 
            fontWeight: '900', 
            color: primaryColor,
            textTransform: 'lowercase'
          }}>
            {name}.
          </span>
        </div>

        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
          {navigation
            .filter(item => item.enabled)
            .map(item => (
              <li 
                key={item.id} 
                onClick={() => setActiveTab(item.id as NavTab)}
                style={{ 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  fontSize: '14px', 
                  opacity: activeTab === item.id ? 1 : 0.7,
                  color: activeTab === item.id ? primaryColor : 'var(--text-secondary)',
                  borderBottom: activeTab === item.id ? `2px solid ${primaryColor}` : '2px solid transparent',
                  paddingBottom: '4px',
                  transition: 'all 0.2s'
                }}
              >
                {item.label}
              </li>
            ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={config.tenantId}
            onChange={(e) => setTenant(e.target.value)}
            style={{
              background: 'var(--glass-bg)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            {availableTenants.map(id => (
              <option key={id} value={id} style={{ background: '#1a1a2e', color: '#fff' }}>{id.toUpperCase()}</option>
            ))}
          </select>
          
          <button 
            className="btn btn-primary" 
            onClick={() => loggedInUser ? setLoggedInUser(null) : setShowLogin(true)}
            style={{ background: primaryColor, padding: '8px 20px', borderRadius: '8px' }}
          >
            {loggedInUser ? `Hi, ${loggedInUser}` : navbar.ctaLabel}
          </button>
        </div>
      </nav>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} title={navbar.loginTitle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input className="form-input" placeholder={navbar.emailPlaceholder} id="login-email" />
          <input className="form-input" type="password" placeholder={navbar.passwordPlaceholder} id="login-password" />
          <button 
            className="btn btn-primary" 
            onClick={async () => {
              const email = (document.getElementById('login-email') as HTMLInputElement)?.value || 'User';
              const password = (document.getElementById('login-password') as HTMLInputElement)?.value || '';

              try {
                // Try API login
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ Email: email, Password: password }),
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.success && data.data?.username) {
                    setLoggedInUser(data.data.username);
                    setShowLogin(false);
                    return;
                  }
                }
              } catch (e) {
                console.warn('[Navbar] API login failed, using demo mode', e);
              }

              // Fallback: demo mode
              setLoggedInUser(email.split('@')[0] || 'User');
              setShowLogin(false);
            }}
            style={{ background: primaryColor, padding: '12px', borderRadius: '8px', fontWeight: '700', width: '100%' }}
          >
            {navbar.loginButtonText}
          </button>
          <p style={{ fontSize: '12px', opacity: 0.5, textAlign: 'center' }}>{navbar.loginDemoText}</p>
        </div>
      </Modal>
    </>
  );
};
