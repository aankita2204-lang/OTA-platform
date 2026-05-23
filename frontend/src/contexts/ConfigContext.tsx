import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TENANTS, SiteConfig, BlockConfig } from '../config/tenants';

const API_BASE = '/api/tenants';

interface ConfigContextType {
  config: SiteConfig;
  setTenant: (tenantId: string) => void;
  availableTenants: string[];
  updateBlockConfig: (blockId: string, key: keyof BlockConfig, value: any) => void;
  updateNavigation: (index: number, key: string, value: any) => void;
  updateContent: (section: string, key: string, value: any) => void;
  saveLayout: () => void;
  resetLayout: () => void;
  isEditorMode: boolean;
  setIsEditorMode: (val: boolean) => void;
  isLoading: boolean;
  apiAvailable: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    return localStorage.getItem('active_tenant') || 'mmt';
  });

  const [isEditorMode, setIsEditorMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  // Deep-merge fetched data with TENANTS defaults so new fields are always present
  const mergeWithDefaults = (tenantId: string, data: any): SiteConfig => {
    const defaults = TENANTS[tenantId] || TENANTS.mmt;
    return {
      ...JSON.parse(JSON.stringify(defaults)),
      ...data,
      search: { ...defaults.search, ...data.search, mockData: { ...defaults.search.mockData, ...data.search?.mockData } },
      editor: { ...defaults.editor, ...data.editor, formLabels: { ...defaults.editor.formLabels, ...data.editor?.formLabels } },
      content: { ...defaults.content, ...data.content },
      popular: { ...defaults.popular, ...data.popular },
    } as SiteConfig;
  };

  // Try API first, fall back to localStorage, then to TENANTS defaults
  const fetchConfig = useCallback(async (tenantId: string): Promise<SiteConfig> => {
    // 1. Try API
    try {
      const res = await fetch(`${API_BASE}/${tenantId}/config`);
      if (res.ok) {
        const data = await res.json();
        setApiAvailable(true);
        const merged = mergeWithDefaults(tenantId, data);
        // Cache merged config to localStorage for offline fallback
        localStorage.setItem(`triplover_layout_${tenantId}`, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('[ConfigContext] API unavailable, using fallback', e);
      setApiAvailable(false);
    }

    // 2. Try localStorage cache
    const saved = localStorage.getItem(`triplover_layout_${tenantId}`);
    if (saved) {
      try {
        return mergeWithDefaults(tenantId, JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }

    // 3. Fall back to TENANTS defaults
    return JSON.parse(JSON.stringify(TENANTS[tenantId] || TENANTS.mmt));
  }, []);

  const [config, setConfig] = useState<SiteConfig>(() => {
    // Synchronous init from localStorage or TENANTS (API fetch happens in useEffect)
    const saved = localStorage.getItem(`triplover_layout_${currentTenantId}`);
    if (saved) {
      try { return mergeWithDefaults(currentTenantId, JSON.parse(saved)); } catch {}
    }
    return JSON.parse(JSON.stringify(TENANTS[currentTenantId] || TENANTS.mmt));
  });

  // Initial API fetch + tenant switch
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchConfig(currentTenantId).then(data => {
      if (!cancelled) {
        setConfig(data);
        setIsLoading(false);
      }
    });
    localStorage.setItem('active_tenant', currentTenantId);
    return () => { cancelled = true; };
  }, [currentTenantId, fetchConfig]);

  const setTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  // Block-level updates for the Builder
  const updateBlockConfig = (blockId: string, key: keyof BlockConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      blockConfigs: {
        ...prev.blockConfigs,
        [blockId]: {
          ...prev.blockConfigs[blockId],
          [key]: value
        }
      }
    }));
  };

  // Navigation tab updates
  const updateNavigation = (index: number, key: string, value: any) => {
    setConfig(prev => {
      const nav = [...prev.navigation];
      nav[index] = { ...nav[index], [key]: value };
      return { ...prev, navigation: nav };
    });
  };

  // Content updates (hero, search, popular, navbar) and top-level fields
  const updateContent = (section: string, key: string, value: any) => {
    setConfig(prev => {
      if (section === '_root') {
        return { ...prev, [key]: value };
      }
      if (section === 'navbar' || section === 'search' || section === 'popular' || section === 'footer') {
        return { ...prev, [section]: { ...prev[section], [key]: value } };
      }
      return { ...prev, content: { ...prev.content, [section]: { ...prev.content[section], [key]: value } } };
    });
  };

  const saveLayout = async () => {
    const json = JSON.stringify(config);
    // Always save to localStorage as backup
    localStorage.setItem(`triplover_layout_${config.tenantId}`, json);

    // Try API save
    try {
      const res = await fetch(`${API_BASE}/${config.tenantId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      });
      if (res.ok) {
        alert(`${config.name} layout saved successfully! (API + localStorage)`);
        return;
      }
    } catch (e) {
      console.warn('[ConfigContext] API save failed, saved to localStorage only', e);
    }
    alert(`${config.name} layout saved to localStorage. (Backend unavailable)`);
  };

  const resetLayout = async () => {
    // Try API reset
    try {
      await fetch(`${API_BASE}/${config.tenantId}/config`, { method: 'DELETE' });
    } catch (e) {
      console.warn('[ConfigContext] API reset failed', e);
    }

    // Remove localStorage cache and revert to TENANTS default
    localStorage.removeItem(`triplover_layout_${config.tenantId}`);
    const fallback = JSON.parse(JSON.stringify(TENANTS[config.tenantId] || TENANTS.mmt));
    setConfig(fallback);
  };

  const availableTenants = Object.keys(TENANTS);

  return (
    <ConfigContext.Provider value={{
      config,
      setTenant,
      availableTenants,
      updateBlockConfig,
      updateNavigation,
      updateContent,
      saveLayout,
      resetLayout,
      isEditorMode,
      setIsEditorMode,
      isLoading,
      apiAvailable,
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
};
