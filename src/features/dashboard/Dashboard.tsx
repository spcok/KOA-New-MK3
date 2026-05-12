import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface SchemaColumn {
  tableName: string;
  columnName: string;
  dataType: string;
  columnDefault: string | null;
}

export function Dashboard() {
  const [fullSchema, setFullSchema] = useState<SchemaColumn[]>([]);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'mapping' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [sqlContent, setSqlContent] = useState('');

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const rows = text.split('\n').map(r => r.trim()).filter(Boolean);
      if (rows.length < 2) {
        addLog('Error: CSV seems empty or invalid.');
        return;
      }

      const headers = rows[0].split(',');
      const tblIdx = headers.indexOf('table_name');
      const colIdx = headers.indexOf('column_name');
      const typeIdx = headers.indexOf('data_type');
      const defIdx = headers.indexOf('column_default');

      if (tblIdx === -1 || colIdx === -1 || typeIdx === -1 || defIdx === -1) {
        addLog('Error: CSV missing "table_name", "column_name", "data_type", or "column_default" headers.');
        return;
      }

      const parsed = rows.slice(1).map(row => {
        const cols = row.split(',');
        return {
          tableName: cols[tblIdx],
          columnName: cols[colIdx],
          dataType: cols[typeIdx],
          columnDefault: (cols[defIdx] && cols[defIdx] !== 'null') ? cols[defIdx] : null,
        };
      }).filter(c => c.tableName === 'animals' && c.columnName && c.dataType);

      const tables = Array.from(new Set(parsed.map(c => c.tableName)));
      setFullSchema(parsed);
      setAvailableTables(tables);
      
      if (tables.length > 0) {
        setSelectedTable(tables[0]);
      }
      
      addLog(`CSV Loaded: ${parsed.length} columns detected across ${tables.length} tables`);
    };
    reader.onerror = () => addLog('Error: Could not read file.');
    reader.readAsText(file);
  };

  const mapValue = (col: SchemaColumn, v2Data: any) => {
    const val = v2Data[col.columnName];
    const name = col.columnName.toLowerCase();
    const type = col.dataType.toLowerCase();

    // 1. System User Override (HARD RULE)
    if (name === 'created_by' || name === 'modified_by' || name === 'completed_by') {
      return "'00000000-0000-0000-0000-000000000000'";
    }

    // 2. Image and Binary Stripping rule
    if (name.includes('image') || name.includes('map') || name.includes('signature')) {
      return "'-1'";
    }

    // 3. Defaults based on schema CSV definition
    const isNull = val === null || val === undefined || val === '';
    
    if (isNull && col.columnDefault) {
        if (col.columnDefault === 'NULL' || col.columnDefault === 'null') return 'NULL';
        const def = col.columnDefault.split('::')[0].replace(/^'|'$/g, '');
        if (def === 'now()') return 'now()';
        if (type.includes('bool')) return def === 'true';
        if (type.includes('int') || type.includes('numeric')) return Number(def);
        if (type.includes('array') || def.includes('ARRAY')) return def;
        return `'${def}'`;
    }

    // 4. Fallbacks if no schema default
    if (isNull) {
        return 'NULL';
    }
    
    // Normal value
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  const handleFetch = async () => {
    const env = (import.meta as any).env;
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      addLog('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in .env.');
      return;
    }
    if (!selectedTable) {
      addLog('Error: No table selected.');
      return;
    }
    
    const tableSchema = fullSchema.filter(c => c.tableName === selectedTable);
    if (tableSchema.length === 0) {
      addLog(`Error: No schema columns found for table "${selectedTable}".`);
      return;
    }

    try {
      setStatus('fetching');
      setSqlContent('');
      addLog(`Connecting to V2 via ${url}...`);

      const v2Client = createClient(url, key);
      
      const { data: records, error } = await v2Client
        .from(selectedTable)
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      if (!records || records.length === 0) {
        addLog(`No records found in table "${selectedTable}".`);
        setStatus('success');
        return;
      }

      addLog(`Mapping ${records.length} records dynamically for "${selectedTable}"...`);
      setStatus('mapping');

      // Build fields dynamically
      const fields = tableSchema.map(s => s.columnName);
      
      const values = records.map(row => {
        const mappedCols = tableSchema.map(col => mapValue(col, row));
        return `(\n    ${mappedCols.join(',\n    ')}\n  )`;
      });

      let deleteStmt = `DELETE FROM public.${selectedTable} WHERE id != '00000000-0000-0000-0000-000000000000';\n\n`;
      if (selectedTable === 'operational_lists') {
        deleteStmt = ''; // Preserve operational_lists defaults
      }

      const sql = `BEGIN;\n\n${deleteStmt}INSERT INTO public.${selectedTable} (${fields.join(', ')}) VALUES\n${values.join(',\n')}\nON CONFLICT (id) DO UPDATE SET updated_at = now();\n\nCOMMIT;`;

      setSqlContent(sql);
      addLog(`SQL Generated for ${selectedTable}`);
      setStatus('success');
    } catch (error: any) {
      addLog(`Error: ${error.message}`);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!sqlContent) return;
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `v3_migration_${selectedTable}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Database Migration Dashboard</h2>
        
        <div className="space-y-6">
          <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 uppercase tracking-widest block">Upload V3 Schema (.csv)</label>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {fullSchema.length > 0 && <p className="text-xs text-green-600 font-bold mt-2">✓ Schema loaded ({fullSchema.length} columns total)</p>}
            </div>

            {availableTables.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-widest block">Target Table</label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableTables.map(tbl => (
                    <option key={tbl} value={tbl}>{tbl}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleFetch}
            disabled={status === 'fetching' || fullSchema.length === 0}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {status === 'fetching' ? 'Processing...' : `Fetch & Generate SQL (${selectedTable || 'None'})`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-slate-900 rounded-xl p-5 flex flex-col min-h-[400px]">
          <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Live Status Logs</h3>
          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 break-words">{log}</div>
            ))}
            {logs.length === 0 && <span className="text-slate-500">Idle...</span>}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 flex flex-col h-full min-h-[600px] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 text-sm font-bold uppercase tracking-widest">SQL Output Preview</h3>
            <button
              onClick={handleDownload}
              disabled={!sqlContent}
              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded shadow hover:bg-green-700 disabled:opacity-50 transition"
            >
              Download V3 Migration SQL
            </button>
          </div>
          <pre className="flex-1 w-full bg-slate-50 border border-slate-200 rounded p-4 overflow-auto font-mono text-xs text-slate-800 whitespace-pre">
            {sqlContent || '-- Upload CSV & fetch data to preview SQL...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
