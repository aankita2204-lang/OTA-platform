import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useTheme, THEMES } from '../../contexts/TenantContext';

export type EditorSectionId = 'navbar' | 'hero' | 'search' | 'popular' | 'footer' | null;

// Left Sidebar (Navigation)
export const EditorLeftSidebar: React.FC<{ activeSection: EditorSectionId, setActiveSection: (id: EditorSectionId) => void }> = ({ activeSection, setActiveSection }) => {
  const { config } = useConfig();
  const { theme, setTheme } = useTheme();
  const fl = config.editor.formLabels || {} as any;

  const sections: { id: EditorSectionId; label: string; icon: string }[] = [
    { id: 'navbar',  label: config.editor.sectionLabels.navbar,  icon: '\u{1F9ED}' },
    { id: 'hero',    label: config.editor.sectionLabels.hero,    icon: '\u{1F3A8}' },
    { id: 'search',  label: config.editor.sectionLabels.search,  icon: '\u{1F50D}' },
    { id: 'popular', label: config.editor.sectionLabels.popular, icon: '\u{1F4A5}' },
    { id: 'footer',  label: config.editor.sectionLabels.footer,  icon: '\u{1F4C4}' },
  ];

  return (
    <aside className="editor-sidebar editor-sidebar-left glass-panel" style={{ width: '280px', height: '100vh', position: 'fixed', left: 0, top: 0, padding: '24px', zIndex: 1000, borderRight: '1px solid var(--glass-border)', borderRadius: 0, background: 'var(--bg-secondary)' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 8 }}>
          {fl.siteEditor}
        </p>
        <div style={{ background: 'var(--input-bg)', border: '1px solid var(--accent-color)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{fl.buildingFor}</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{config.name}</div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 12 }}>
        {fl.selectBlock}
      </p>

      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0 }}>
        {sections.map(sec => (
          <li key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              background: activeSection === sec.id ? 'var(--accent-color)' : 'transparent',
              color: activeSection === sec.id ? '#fff' : 'inherit',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 16 }}>{sec.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{sec.label}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--glass-border)' }}>
        <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 12 }}>
          Site Theme
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {THEMES.map(t => (
            <div
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                height: 36,
                borderRadius: 8,
                background: t.gradient,
                cursor: 'pointer',
                border: theme === t.id ? '2px solid #fff' : '2px solid transparent',
                boxShadow: theme === t.id ? '0 0 10px rgba(0,0,0,0.5)' : 'none',
                transition: 'all 0.2s'
              }}
              title={t.label}
            />
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
          {THEMES.find(t => t.id === theme)?.label}
        </p>
      </div>
    </aside>
  );
};

// Right Sidebar (Configuration)
export const EditorRightSidebar: React.FC<{ activeSection: EditorSectionId }> = ({ activeSection }) => {
  const { config, updateBlockConfig, updateNavigation, updateContent, saveLayout, resetLayout } = useConfig();
  const [isSaving, setIsSaving] = useState(false);
  const fl = config.editor.formLabels || {} as any;

  if (!activeSection) {
    return (
      <aside className="editor-sidebar editor-sidebar-right glass-panel" style={{ width: '320px', height: '100vh', position: 'fixed', right: 0, top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 1000, borderLeft: '1px solid var(--glass-border)', borderRadius: 0, background: 'var(--bg-secondary)' }}>
        <div>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🏗️</div>
          <h3 style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{fl.blockProperties}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>{fl.clickBlockHint}</p>
        </div>
      </aside>
    );
  }

  const currentBlock = config.blockConfigs[activeSection as string] || { variant: 1, enabled: true };
  const sectionLabel = config.editor.sectionLabels;

  return (
    <aside className="editor-sidebar editor-sidebar-right glass-panel" style={{ width: '320px', height: '100vh', position: 'fixed', right: 0, top: 0, padding: 0, display: 'flex', flexDirection: 'column', zIndex: 1000, borderLeft: '1px solid var(--glass-border)', borderRadius: 0, background: 'var(--bg-secondary)' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>{fl.customize} {sectionLabel[activeSection] || activeSection}</h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Block-level layout & style overrides</p>
      </div>

      <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
        {/* Layout Variant Selection */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.layoutVariant}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[1, 2, 3, 4].map(v => (
              <div 
                key={v}
                onClick={() => updateBlockConfig(activeSection as string, 'variant', v)}
                style={{
                  padding: '14px 8px',
                  borderRadius: '8px',
                  border: `2px solid ${currentBlock.variant === v ? 'var(--accent-color)' : 'var(--glass-border)'}`,
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: currentBlock.variant === v ? 'rgba(var(--accent-color-rgb), 0.15)' : 'var(--input-bg)',
                  color: currentBlock.variant === v ? 'var(--accent-color)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        {/* Color Override */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.colorOverride}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {config.editor.colorOverrides.map(color => (
              <div 
                key={color}
                onClick={() => updateBlockConfig(activeSection as string, 'colorOverride', color)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: color,
                  cursor: 'pointer',
                  border: currentBlock.colorOverride === color ? '2px solid #fff' : 'none',
                  boxShadow: currentBlock.colorOverride === color ? '0 0 10px rgba(0,0,0,0.5)' : 'none'
                }}
              />
            ))}
            <div 
              onClick={() => updateBlockConfig(activeSection as string, 'colorOverride', undefined)}
              style={{ padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
            >
              {fl.clear}
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.visibility}</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={currentBlock.enabled} 
              onChange={e => updateBlockConfig(activeSection as string, 'enabled', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-color)' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{fl.enableBlock}</span>
          </label>
        </div>

        {/* Block-Specific Content Sections */}

        {/* NAVBAR: Navigation Tabs Configuration */}
        {activeSection === 'navbar' && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.navigationTabs}</p>
            {config.navigation.map((nav, idx) => (
              <div key={nav.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '8px', background: 'var(--input-bg)', borderRadius: 8 }}>
                <input 
                  type="checkbox" 
                  checked={nav.enabled} 
                  onChange={e => updateNavigation(idx, 'enabled', e.target.checked)}
                  style={{ accentColor: 'var(--accent-color)' }}
                />
                <input 
                  className="form-input" 
                  value={nav.label} 
                  onChange={e => updateNavigation(idx, 'label', e.target.value)}
                  style={{ flex: 1, fontSize: '12px', padding: '6px 8px' }}
                />
              </div>
            ))}
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 16, marginBottom: 8 }}>{fl.ctaButton}</p>
            <input 
              className="form-input" 
              value={config.navbar.ctaLabel} 
              onChange={e => updateContent('navbar', 'ctaLabel', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px' }}
            />
          </div>
        )}

        {/* HERO: Content Editing */}
        {activeSection === 'hero' && config.content.hero && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.heroContent}</p>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.headline}</label>
            <input 
              className="form-input" 
              value={config.content.hero.headline} 
              onChange={e => updateContent('hero', 'headline', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.subHeadline}</label>
            <input 
              className="form-input" 
              value={config.content.hero.subHeadline} 
              onChange={e => updateContent('hero', 'subHeadline', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.ctaButtonText}</label>
            <input 
              className="form-input" 
              value={config.content.hero.cta} 
              onChange={e => updateContent('hero', 'cta', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px' }}
            />
          </div>
        )}

        {/* SEARCH: Config Editing */}
        {activeSection === 'search' && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.searchConfig}</p>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.defaultFrom}</label>
            <input 
              className="form-input" 
              value={config.search.defaultFrom} 
              onChange={e => updateContent('search', 'defaultFrom', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.defaultTo}</label>
            <input 
              className="form-input" 
              value={config.search.defaultTo} 
              onChange={e => updateContent('search', 'defaultTo', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.searchButtonText}</label>
            <input 
              className="form-input" 
              value={config.search.searchButtonText} 
              onChange={e => updateContent('search', 'searchButtonText', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.searchingText}</label>
            <input 
              className="form-input" 
              value={config.search.searchingText} 
              onChange={e => updateContent('search', 'searchingText', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px' }}
            />
          </div>
        )}

        {/* FOOTER: Content Editing */}
        {activeSection === 'footer' && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.footerContent}</p>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.brandName}</label>
            <input 
              className="form-input" 
              value={config.name} 
              onChange={e => updateContent('_root', 'name', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 12 }}
            />
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>{fl.policyLinks}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Privacy Policy, Terms of Service, and Cookie Policy links are shown in the footer. Clicking them opens a modal with the policy content.</p>
          </div>
        )}

        {/* POPULAR: Items Editing */}
        {activeSection === 'popular' && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{fl.popularDeals}</p>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.sectionTitle}</label>
            <input 
              className="form-input" 
              value={config.popular.title} 
              onChange={e => updateContent('popular', 'title', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 8 }}
            />
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{fl.subtitle}</label>
            <input 
              className="form-input" 
              value={config.popular.subtitle} 
              onChange={e => updateContent('popular', 'subtitle', e.target.value)}
              style={{ fontSize: '12px', padding: '6px 8px', marginBottom: 12 }}
            />
            {config.popular.items.map((item, idx) => (
              <div key={item.id} style={{ background: 'var(--input-bg)', borderRadius: 8, padding: 8, marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Deal {idx + 1}</p>
                <input 
                  className="form-input" 
                  value={item.title} 
                  onChange={e => {
                    const items = [...config.popular.items];
                    items[idx] = { ...items[idx], title: e.target.value };
                    updateContent('popular', 'items', items);
                  }}
                  placeholder="Title"
                  style={{ fontSize: '11px', padding: '4px 6px', marginBottom: 4 }}
                />
                <input 
                  className="form-input" 
                  value={item.sub} 
                  onChange={e => {
                    const items = [...config.popular.items];
                    items[idx] = { ...items[idx], sub: e.target.value };
                    updateContent('popular', 'items', items);
                  }}
                  placeholder="Subtitle"
                  style={{ fontSize: '11px', padding: '4px 6px' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 24, borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '14px' }}
          disabled={isSaving}
          onClick={async () => {
            setIsSaving(true);
            saveLayout();
            setTimeout(() => setIsSaving(false), 500);
          }}
        >
          {isSaving ? config.editor.savingText : config.editor.saveButtonText}
        </button>
        <button 
          className="btn btn-ghost" 
          style={{ width: '100%', padding: '14px', fontSize: '12px' }}
          onClick={() => {
            if (confirm(config.editor.resetConfirmText)) resetLayout();
          }}
        >
          {config.editor.resetButtonText}
        </button>
      </div>
    </aside>
  );
};
