import React from 'react';
import { Navbar } from '../components/modules/Navbar';
import { HeroPromo } from '../components/modules/HeroPromo';
import { SearchWidget } from '../components/modules/SearchWidget';
import { DiscoverySection } from '../components/modules/DiscoverySection';
import { FooterArea } from '../components/modules/FooterArea';

export const ComponentRegistry: Record<string, React.FC<any>> = {
  navbar: Navbar,
  hero: HeroPromo,
  search: SearchWidget,
  popular: DiscoverySection,
  footer: FooterArea
};
