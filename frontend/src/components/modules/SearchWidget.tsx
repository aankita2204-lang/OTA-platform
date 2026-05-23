import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useAppContext } from '../../contexts/AppContext';
import { FlightResult, HotelResult, PackageResult } from '../../types';

interface SearchWidgetProps {
  blockConfig: {
    variant: number;
    colorOverride?: string;
  };
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ blockConfig }) => {
  const [searching, setSearching] = useState(false);
  const [tripType, setTripType] = useState(0);
  const [fromVal, setFromVal] = useState('');
  const [toVal, setToVal] = useState('');
  const { config } = useConfig();
  const { variant, colorOverride } = blockConfig;
  const { search } = config;
  const primaryColor = colorOverride || 'var(--accent-color)';
  const { activeTab, setFlightResults, setHotelResults, setPkgResults } = useAppContext();
  
  const handleSwap = () => {
    const from = fromVal || search.defaultFrom;
    const to = toVal || search.defaultTo;
    setFromVal(to);
    setToVal(from);
  };

  const handleSearch = async () => {
    setSearching(true);
    const from = fromVal || search.defaultFrom;
    const to = toVal || search.defaultTo;

    try {
      // Try API search
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ From: from, To: to, Tab: activeTab, TripType: search.tripTypes[tripType] }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.results) {
          const results = data.data.results;
          if (activeTab === 'flight') setFlightResults(results);
          else if (activeTab === 'hotel') setHotelResults(results);
          else setPkgResults(results);
          setSearching(false);
          setTimeout(() => {
            document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
          }, 200);
          return;
        }
      }
    } catch (e) {
      console.warn('[SearchWidget] API search failed, using mock data', e);
    }

    // Fallback to mock data
    setTimeout(() => {
      setSearching(false);
      if (activeTab === 'flight') setFlightResults((search.mockData?.flights || []) as FlightResult[]);
      else if (activeTab === 'hotel') setHotelResults((search.mockData?.hotels || []) as HotelResult[]);
      else setPkgResults((search.mockData?.packages || []) as PackageResult[]);
      setTimeout(() => {
        document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }, 1500);
  };

  const getWidgetStyle = (): React.CSSProperties => {
    switch (variant) {
      case 2:
        return { borderRadius: 0, borderLeft: `8px solid ${primaryColor}` };
      case 3:
        return { background: 'transparent', border: `1px solid ${primaryColor}44`, boxShadow: 'none' };
      case 4:
        return { background: 'var(--bg-secondary)', boxShadow: `0 20px 40px ${primaryColor}22`, borderRadius: '32px' };
      default:
        return { padding: '32px', borderRadius: 'var(--border-radius-base)', border: '1px solid var(--glass-border)' };
    }
  };

  return (
    <div 
      className="glass-panel"
      id="search-widget"
      style={{
        margin: '20px',
        transition: 'all 0.3s ease',
        ...getWidgetStyle()
      }}
    >
      {/* Trip Type Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--input-bg)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        {search.tripTypes.map((type, idx) => (
          <button
            key={type}
            onClick={() => setTripType(idx)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '6px',
              background: tripType === idx ? primaryColor : 'transparent',
              color: tripType === idx ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Search Fields Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* From */}
        <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', marginBottom: '6px', opacity: 0.5, textTransform: 'uppercase' }}>{search.fieldLabels.from}</label>
          <input className="form-input" value={fromVal || search.defaultFrom} onChange={e => setFromVal(e.target.value)} style={{ fontWeight: '600' }} />
        </div>
        
        {/* Swap Button */}
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '8px' }}>
          <button 
            onClick={handleSwap}
            style={{ background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontSize: '14px' }}
          >⇄</button>
        </div>
        
        {/* To */}
        <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', marginBottom: '6px', opacity: 0.5, textTransform: 'uppercase' }}>{search.fieldLabels.to}</label>
          <input className="form-input" value={toVal || search.defaultTo} onChange={e => setToVal(e.target.value)} style={{ fontWeight: '600' }} />
        </div>

        {/* Departure Date */}
        <div style={{ flex: '1 1 150px', minWidth: '130px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', marginBottom: '6px', opacity: 0.5, textTransform: 'uppercase' }}>{search.fieldLabels.departure}</label>
          <input className="form-input" type="date" style={{ fontWeight: '600' }} />
        </div>

        {/* Return Date - Only show for Round Trip */}
        {tripType === 1 && (
          <div style={{ flex: '1 1 150px', minWidth: '130px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', marginBottom: '6px', opacity: 0.5, textTransform: 'uppercase' }}>{search.fieldLabels.returnDate}</label>
            <input className="form-input" type="date" style={{ fontWeight: '600' }} />
          </div>
        )}

        {/* Travelers */}
        <div style={{ flex: '1 1 120px', minWidth: '100px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', marginBottom: '6px', opacity: 0.5, textTransform: 'uppercase' }}>{search.fieldLabels.travelers}</label>
          <select className="form-input" style={{ fontWeight: '600' }}>
            {search.travelers.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Class */}
        <div style={{ flex: '1 1 120px', minWidth: '100px' }}>
          <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', marginBottom: '6px', opacity: 0.5, textTransform: 'uppercase' }}>{search.fieldLabels.class}</label>
          <select className="form-input" style={{ fontWeight: '600' }}>
            {search.classes.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSearch}
          style={{ background: primaryColor, padding: '14px 48px', borderRadius: '8px', fontWeight: '700', fontSize: '15px' }}
        >
          {searching ? search.searchingText : search.searchButtonText}
        </button>
      </div>
    </div>
  );
};
