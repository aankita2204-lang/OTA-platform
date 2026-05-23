import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';

interface HeroPromoProps {
  blockConfig: {
    variant: number;
    colorOverride?: string;
  };
}

export const HeroPromo: React.FC<HeroPromoProps> = ({ blockConfig }) => {
  const { config } = useConfig();
  const { variant, colorOverride } = blockConfig;
  const primaryColor = colorOverride || 'var(--accent-color)';

  const heroContent = config.content?.hero || {
    headline: 'Welcome',
    subHeadline: 'Travel reimagined.',
    cta: 'Explore'
  };

  const getHeroStyle = (): React.CSSProperties => {
    switch (variant) {
      case 2:
        return { textAlign: 'left', padding: '100px 60px', background: `linear-gradient(90deg, ${primaryColor}22 0%, transparent 100%)` };
      case 3:
        return { 
          background: 'var(--bg-card)', 
          border: `2px solid ${primaryColor}33`, 
          borderRadius: '24px',
          padding: '60px 40px',
          boxShadow: `0 0 60px ${primaryColor}15`
        };
      case 4:
        return { minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
      default:
        return { padding: '80px 40px', textAlign: 'center', background: 'var(--hero-gradient, transparent)' };
    }
  };

  return (
    <div 
      className="hero-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--border-radius-base)',
        margin: '20px',
        transition: 'all 0.5s ease',
        ...getHeroStyle()
      }}
    >
      <div className="hero-orb" style={{ top: '-10%', left: '10%', width: '400px', height: '400px', opacity: 0.2, background: primaryColor }} />
      
      <h1 style={{ fontSize: '64px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-2px', color: variant === 3 ? primaryColor : 'inherit' }}>
        {heroContent.headline}
      </h1>
      
      <p style={{ fontSize: '20px', opacity: 0.7, maxWidth: '600px', margin: variant === 2 ? '0 0 40px 0' : '0 auto 40px auto' }}>
        {heroContent.subHeadline}
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: variant === 2 ? 'flex-start' : 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => document.getElementById('search-widget')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: primaryColor, padding: '16px 40px', cursor: 'pointer' }}
        >
          {heroContent.cta}
        </button>
      </div>
    </div>
  );
};
