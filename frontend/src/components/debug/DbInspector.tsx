import React, { useState, useEffect } from 'react';

export const DbInspector: React.FC = () => {
  const [tables, setTables] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [fullRow, setFullRow] = useState<any>(null);
  const [compare, setCompare] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = '/api/db';

  useEffect(() => {
    loadTables();
    loadRows();
  }, []);

  const loadTables = async () => {
    try {
      const res = await fetch(`${apiBase}/tables`);
      if (res.ok) setTables(await res.json());
    } catch (e: any) { setError(e.message); }
  };

  const loadRows = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/rows`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.data || []);
      }
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const loadFullRow = async (tenantId: string) => {
    setSelectedRow(tenantId);
    setFullRow(null);
    setCompare(null);
    try {
      const res = await fetch(`${apiBase}/rows/${tenantId}/full`);
      if (res.ok) setFullRow(await res.json());
    } catch (e: any) { setError(e.message); }
  };

  const loadCompare = async (tenantId: string) => {
    setCompare(null);
    try {
      const res = await fetch(`${apiBase}/compare/${tenantId}`);
      if (res.ok) setCompare(await res.json());
    } catch (e: any) { setError(e.message); }
  };

  const sectionStyle: React.CSSProperties = {
    background: 'var(--bg-secondary, #1a1a2e)',
    border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    color: 'var(--text-muted, #888)', marginBottom: 8, letterSpacing: 1,
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-primary, #eee)' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>DB Inspector</h1>
      <p style={{ opacity: 0.5, marginBottom: 24 }}>EF Core InMemory Database - Live Table Viewer</p>

      {error && <div style={{ ...sectionStyle, borderColor: '#f44336' }}>Error: {error}</div>}

      {tables && (
        <div style={sectionStyle}>
          <p style={labelStyle}>Database Info</p>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '4px 16px' }}>
            <span style={{ opacity: 0.5 }}>Provider:</span><span>{tables.database}</span>
            <span style={{ opacity: 0.5 }}>Database:</span><span>{tables.databaseName}</span>
            {tables.tables?.map((t: any) => (
              <React.Fragment key={t.name}>
                <span style={{ opacity: 0.5 }}>Table:</span>
                <span>{t.name} - {t.rowCount} rows - columns: {t.columns?.join(', ')}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div style={sectionStyle}>
        <p style={labelStyle}>TenantConfigs Table - All Rows</p>
        <button onClick={loadRows} style={{ marginBottom: 12, padding: '6px 16px', borderRadius: 6, background: 'var(--accent-color, #e040fb)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Refresh
        </button>
        {loading ? <p>Loading...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--glass-border, rgba(255,255,255,0.1))' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>TenantId (PK)</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Size</th>
                <th style={{ textAlign: 'left', padding: 8 }}>CreatedAt</th>
                <th style={{ textAlign: 'left', padding: 8 }}>UpdatedAt</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Last Modified</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => (
                <tr key={r.tenantId} style={{ borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.05))' }}>
                  <td style={{ padding: 8, fontWeight: 700, color: 'var(--accent-color, #e040fb)' }}>{r.tenantId}</td>
                  <td style={{ padding: 8 }}>{r.configSizeKB} KB</td>
                  <td style={{ padding: 8, fontSize: 11 }}>{new Date(r.createdAt).toLocaleString()}</td>
                  <td style={{ padding: 8, fontSize: 11 }}>{new Date(r.updatedAt).toLocaleString()}</td>
                  <td style={{ padding: 8, fontSize: 11, opacity: 0.7 }}>{Math.round(r.lastModifiedAgo?.totalSeconds || 0)}s ago</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => loadFullRow(r.tenantId)} style={{ padding: '4px 10px', borderRadius: 4, background: '#6c7ae0', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, marginRight: 4 }}>View Full</button>
                    <button onClick={() => loadCompare(r.tenantId)} style={{ padding: '4px 10px', borderRadius: 4, background: '#00c896', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11 }}>Compare Seed</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {fullRow && (
        <div style={sectionStyle}>
          <p style={labelStyle}>Full Row: {selectedRow}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '4px 16px', marginBottom: 16 }}>
            <span style={{ opacity: 0.5 }}>Table:</span><span>{fullRow.tableName}</span>
            <span style={{ opacity: 0.5 }}>Primary Key:</span><span>{fullRow.primaryKey}</span>
            <span style={{ opacity: 0.5 }}>CreatedAt:</span><span>{new Date(fullRow.createdAt).toLocaleString()}</span>
            <span style={{ opacity: 0.5 }}>UpdatedAt:</span><span>{new Date(fullRow.updatedAt).toLocaleString()}</span>
          </div>
          <p style={{ ...labelStyle, marginTop: 16 }}>ConfigJson (pretty-printed):</p>
          <pre style={{ background: 'var(--bg-primary, #0d0d1a)', padding: 16, borderRadius: 8, overflow: 'auto', maxHeight: 500, fontSize: 11, lineHeight: 1.5 }}>
            {fullRow.rawJson}
          </pre>
        </div>
      )}

      {compare && (
        <div style={sectionStyle}>
          <p style={labelStyle}>Seed Comparison: {selectedRow}</p>
          <div style={{ marginBottom: 12, padding: '12px 16px', borderRadius: 8, background: compare.hasChanges ? 'rgba(255,179,0,0.15)' : 'rgba(0,200,150,0.15)', border: `1px solid ${compare.hasChanges ? '#ffb300' : '#00c896'}` }}>
            {compare.hasChanges ? '!' : 'OK'} {compare.summary}
          </div>
          {compare.differences?.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border, rgba(255,255,255,0.1))' }}>
                  <th style={{ textAlign: 'left', padding: 8 }}>Field Path</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Change</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Seed Value</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>DB Value</th>
                </tr>
              </thead>
              <tbody>
                {compare.differences.map((d: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.05))' }}>
                    <td style={{ padding: 8, fontWeight: 600, color: '#6c7ae0' }}>{d.path}</td>
                    <td style={{ padding: 8 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: d.change === 'Modified' ? '#ffb300' : d.change === 'Added in DB' ? '#00c896' : '#f44336', color: '#000' }}>
                        {d.change}
                      </span>
                    </td>
                    <td style={{ padding: 8, fontSize: 11, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(d.seedValue)}</td>
                    <td style={{ padding: 8, fontSize: 11, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ffb300' }}>{String(d.dbValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
