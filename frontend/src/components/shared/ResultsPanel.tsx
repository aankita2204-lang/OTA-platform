import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConfig } from '../../contexts/ConfigContext';
import { FlightResult, HotelResult, PackageResult } from '../../types';

const FlightCard: React.FC<{ flight: FlightResult }> = ({ flight }) => (
  <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
    <div style={{ flex: '1 1 200px' }}>
      <div style={{ fontWeight: '700', fontSize: '16px' }}>{flight.airline} {flight.code}</div>
      <div style={{ fontSize: '12px', opacity: 0.5 }}>{flight.duration} · {flight.stops}</div>
    </div>
    <div style={{ textAlign: 'center', flex: '1 1 150px' }}>
      <div style={{ fontWeight: '700', fontSize: '18px' }}>{flight.dep}</div>
      <div style={{ fontSize: '11px', opacity: 0.4 }}>→</div>
      <div style={{ fontWeight: '700', fontSize: '18px' }}>{flight.arr}</div>
    </div>
    <div style={{ textAlign: 'right', flex: '0 1 auto' }}>
      {flight.tag && <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', marginRight: '8px' }}>{flight.tag.toUpperCase()}</span>}
      <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--accent-color)' }}>{flight.price}</span>
    </div>
  </div>
);

const HotelCard: React.FC<{ hotel: HotelResult }> = ({ hotel }) => (
  <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
    <div style={{ flex: '1 1 200px' }}>
      <div style={{ fontWeight: '700', fontSize: '16px' }}>{hotel.name}</div>
      <div style={{ fontSize: '12px', opacity: 0.5 }}>{'⭐'.repeat(hotel.stars)} · {hotel.location}</div>
    </div>
    <div style={{ textAlign: 'center', flex: '1 1 100px' }}>
      <span style={{ fontWeight: '600', fontSize: '14px' }}>Rating: {hotel.rating}</span>
    </div>
    <div style={{ textAlign: 'right', flex: '0 1 auto' }}>
      {hotel.tag && <span style={{ background: 'var(--accent-color)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', marginRight: '8px' }}>{hotel.tag}</span>}
      <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--accent-color)' }}>{hotel.price}</span>
    </div>
  </div>
);

const PackageCard: React.FC<{ pkg: PackageResult }> = ({ pkg }) => (
  <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
    <div style={{ flex: '1 1 200px' }}>
      <div style={{ fontWeight: '700', fontSize: '16px' }}>{pkg.title}</div>
      <div style={{ fontSize: '12px', opacity: 0.5 }}>{pkg.nights} Nights · {pkg.includes}</div>
    </div>
    <div style={{ textAlign: 'right', flex: '0 1 auto' }}>
      <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--accent-color)' }}>{pkg.price}</span>
    </div>
  </div>
);

export const ResultsPanel: React.FC = () => {
  const { activeTab, flightResults, hotelResults, pkgResults } = useAppContext();
  const { config } = useConfig();
  const labels = config.content?.resultsLabels || { flight: 'Flight Results', hotel: 'Hotel Results', deals: 'Package Results' };
  const foundText = config.content?.resultsFoundText || 'found';

  const results = activeTab === 'flight' ? flightResults : activeTab === 'hotel' ? hotelResults : pkgResults;

  if (!results || results.length === 0) return null;

  return (
    <div id="search-results" style={{ margin: '20px', padding: '20px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>
        {activeTab === 'flight' ? `✈ ${labels.flight}` : activeTab === 'hotel' ? `🏨 ${labels.hotel}` : `🌴 ${labels.deals}`}
        <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.5, marginLeft: '12px' }}>{results.length} {foundText}</span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeTab === 'flight' && flightResults.map((f, i) => <FlightCard key={i} flight={f} />)}
        {activeTab === 'hotel' && hotelResults.map((h, i) => <HotelCard key={i} hotel={h} />)}
        {activeTab === 'deals' && pkgResults.map((p, i) => <PackageCard key={i} pkg={p} />)}
      </div>
    </div>
  );
};
