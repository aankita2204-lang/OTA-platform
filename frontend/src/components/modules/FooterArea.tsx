import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { Modal } from '../shared/Modal';

interface FooterAreaProps {
  blockConfig: {
    variant: number;
    colorOverride?: string;
  };
}


export const FooterArea: React.FC<FooterAreaProps> = ({ blockConfig }) => {
  const { config } = useConfig();
  const { name, footer } = config;
  const { variant, colorOverride } = blockConfig;
  const primaryColor = colorOverride || 'var(--accent-color)';
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const getFooterStyle = (): React.CSSProperties => {
    switch (variant) {
      case 2:
        return { padding: '40px', borderTop: `8px solid ${primaryColor}`, background: 'var(--bg-secondary)' };
      case 3:
        return { padding: '80px 40px', borderTop: `2px solid ${primaryColor}`, background: 'transparent' };
      case 4:
        return { padding: '100px 40px', borderTop: `6px solid ${primaryColor}`, borderRadius: '40px 40px 0 0', margin: '40px 20px 0' };
      default:
        return { marginTop: '80px', padding: '60px 40px', borderTop: `4px solid ${primaryColor}`, background: 'rgba(0,0,0,0.1)' };
    }
  };
  
  return (
    <>
      <footer 
        id="footer"
        style={{
          textAlign: 'center',
          transition: 'all 0.3s ease',
          ...getFooterStyle()
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '18px', fontWeight: '800', color: primaryColor }}>{name}.</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>
          &copy; {new Date().getFullYear()} {name} {footer.copyrightText}
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '12px', opacity: 0.7 }}>
          {Object.keys(footer.policies).map(policy => (
            <span 
              key={policy}
              onClick={() => setModalContent({ title: policy, body: footer.policies[policy] })}
              style={{ cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = primaryColor)}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {policy}
            </span>
          ))}
        </div>
      </footer>

      <Modal 
        isOpen={!!modalContent} 
        onClose={() => setModalContent(null)} 
        title={modalContent?.title || ''}
      >
        <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>{modalContent?.body}</p>
      </Modal>
    </>
  );
};
