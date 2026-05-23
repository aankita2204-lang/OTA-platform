import React, { useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useTheme } from '../../contexts/TenantContext';

export const ThemeManager: React.FC = () => {
  const { config } = useConfig();
  const { theme: tenantTheme } = config;
  const { theme: globalTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    // Apply primary colors from tenant config
    root.style.setProperty('--accent-color', tenantTheme.primaryColor);
    root.style.setProperty('--accent-secondary', tenantTheme.secondaryColor);
    
    // Apply border radius
    root.style.setProperty('--border-radius-base', `${tenantTheme.borderRadius}px`);
    
    // Apply font
    root.style.setProperty('--font-family-base', tenantTheme.fontFamily);

    // Dynamic hover color
    root.style.setProperty('--accent-hover', `${tenantTheme.primaryColor}cc`);

    // Let TenantContext handle data-theme for global theme switching
    // Only override if tenant specifies light mode AND no global theme is active
    if (!tenantTheme.darkTheme && globalTheme === 'blue-pink') {
      root.setAttribute('data-theme', 'arctic-glass');
    }

  }, [tenantTheme, globalTheme]);

  return null;
};
