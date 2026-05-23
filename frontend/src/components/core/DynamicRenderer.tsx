import React from 'react';
import { ComponentRegistry } from '../../registry/ComponentRegistry';
import { useConfig } from '../../contexts/ConfigContext';

/**
 * DynamicRenderer
 * 
 * The "Engine" of the application. It looks at the `layout` array 
 * from the JSON configuration and renders the corresponding 
 * components from the registry.
 * 
 * Now enhanced to pass block-specific configuration (overrides).
 */
export const DynamicRenderer: React.FC = () => {
  const { config } = useConfig();
  const { layout, blockConfigs } = config;

  if (!layout || layout.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
        <h2>No layout configuration found.</h2>
        <p>Please check your JSON configuration.</p>
      </div>
    );
  }

  return (
    <div className="dynamic-page-container">
      {layout.map((moduleId, index) => {
        const Component = ComponentRegistry[moduleId];
        const blockConfig = blockConfigs[moduleId] || { variant: 1, enabled: true };
        
        if (!Component || !blockConfig.enabled) {
          return null;
        }

        // Pass the block-specific configuration as a prop
        return <Component key={`${moduleId}-${index}`} blockConfig={blockConfig} />;
      })}
    </div>
  );
};
