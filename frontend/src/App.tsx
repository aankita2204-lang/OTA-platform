import { useState, useEffect } from 'react';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/TenantContext';
import { ThemeManager } from './components/core/ThemeManager';
import { DynamicRenderer } from './components/core/DynamicRenderer';
import { ResultsPanel } from './components/shared/ResultsPanel';
import { EditorLeftSidebar, EditorRightSidebar, EditorSectionId } from './components/Editor/EditorSidebars';
import { DbInspector } from './components/debug/DbInspector';
import './index.css';

/**
 * AppContent
 * 
 * Handles conditional rendering for the Website Builder (Editor Mode).
 */
const AppContent = () => {
  const { isEditorMode, setIsEditorMode, config } = useConfig();
  const [activeSection, setActiveSection] = useState<EditorSectionId>(null);
  const [showDbInspector, setShowDbInspector] = useState(() => window.location.hash === '#db-inspector');

  useEffect(() => {
    const handler = () => setShowDbInspector(window.location.hash === '#db-inspector');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return (
    <div 
      className={`app-container ${isEditorMode ? 'editor-active' : ''}`}
      style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)', 
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-family-base)',
        transition: 'padding 0.3s'
      }}
    >
      <ThemeManager />

      {/* DB Inspector Debug Page */}
      {showDbInspector && <DbInspector />}

      {!showDbInspector && (<>
      {/* Editor Sidebars (Only visible when Editor Mode is on) */}
      {isEditorMode && (
        <>
          <EditorLeftSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <EditorRightSidebar activeSection={activeSection} />
        </>
      )}
      
      <main style={{ 
        width: '100%',
        maxWidth: isEditorMode ? 'none' : '1440px', 
        marginLeft: isEditorMode ? '0' : 'auto',
        marginRight: isEditorMode ? '0' : 'auto',
        paddingLeft: isEditorMode ? '280px' : '0',
        paddingRight: isEditorMode ? '320px' : '0',
        transition: 'all 0.3s ease'
      }}>
        <DynamicRenderer />
        {!isEditorMode && <ResultsPanel />}
      </main>
      </>)}

      {/* Floating Website Builder Toggle */}
      <button 
        onClick={() => {
          setIsEditorMode(!isEditorMode);
          if (isEditorMode) setActiveSection(null);
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: isEditorMode ? '300px' : '30px',
          zIndex: 9999,
          background: 'var(--accent-color)',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '99px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {isEditorMode ? config.editor.exitEditorText : config.editor.editSiteText}
      </button>
    </div>
  );
};

export default function App() {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}
