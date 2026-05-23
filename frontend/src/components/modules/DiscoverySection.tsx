import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useAppContext } from '../../contexts/AppContext';
import { Modal } from '../shared/Modal';

interface DiscoverySectionProps {
  blockConfig: {
    variant: number;
    colorOverride?: string;
  };
}

interface DealDetail {
  title: string;
  icon: string;
  sub: string;
  description: string;
  highlights: string[];
  type: 'flight' | 'hotel' | 'deals';
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({ blockConfig }) => {
  const { config } = useConfig();
  const { variant, colorOverride } = blockConfig;
  const { popular, name } = config;
  const primaryColor = colorOverride || 'var(--accent-color)';
  const { setActiveTab } = useAppContext();
  const [selectedDeal, setSelectedDeal] = useState<DealDetail | null>(null);

  const handleDealClick = (item: { id: number; title: string; sub: string; icon: string; type: 'flight' | 'hotel' | 'deals' }) => {
    const detail = popular.dealDetails?.[item.title];
    if (detail) {
      setSelectedDeal({ title: item.title, icon: item.icon, sub: item.sub, description: detail.description, highlights: detail.highlights, type: item.type });
    }
  };

  const handleBookNow = (deal: DealDetail) => {
    setSelectedDeal(null);
    setActiveTab(deal.type);
    setTimeout(() => {
      document.getElementById('search-widget')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getContainerStyle = (): React.CSSProperties => {
    switch (variant) {
      case 2:
        return { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '20px' };
      case 3:
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '40px', background: 'var(--bg-secondary)', borderRadius: '24px' };
      case 4:
        return { display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', border: `2px dashed ${primaryColor}44`, borderRadius: '16px' };
      default:
        return { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
    }
  };

  return (
    <>
      <div id="popular" style={{ margin: '20px', padding: '20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{popular.title.replace('{name}', name)}</h2>
          <p style={{ opacity: 0.6, fontSize: '14px' }}>{popular.subtitle}</p>
        </div>

        <div style={getContainerStyle()}>
          {popular.items.map(item => (
            <div 
              key={item.id}
              className="glass-panel"
              onClick={() => handleDealClick(item)}
              style={{
                padding: '24px',
                borderRadius: 'var(--border-radius-base)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: `1px solid ${variant === 4 ? primaryColor : 'var(--glass-border)'}`,
                minWidth: variant === 2 ? '300px' : 'auto',
                background: variant === 3 ? 'var(--bg-card)' : 'var(--glass-bg)'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', opacity: 0.7, color: primaryColor, fontWeight: '600' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={!!selectedDeal} 
        onClose={() => setSelectedDeal(null)} 
        title={`${selectedDeal?.icon || ''} ${selectedDeal?.title || ''}`}
      >
        {selectedDeal && (
          <div>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '16px' }}>{selectedDeal.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {selectedDeal.highlights.map(h => (
                <span key={h} style={{ background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '600' }}>✓ {h}</span>
              ))}
            </div>
            <p style={{ fontSize: '18px', fontWeight: '800', color: primaryColor, marginBottom: '16px' }}>{selectedDeal.sub}</p>
            <button 
              className="btn btn-primary"
              onClick={() => handleBookNow(selectedDeal)}
              style={{ background: primaryColor, padding: '12px 32px', borderRadius: '8px', fontWeight: '700', width: '100%', cursor: 'pointer' }}
            >
              {popular.bookNowText}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};
