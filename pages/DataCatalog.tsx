import React, { useState } from 'react';
import { Search, Database, Table as TableIcon, Eye, Calendar, Download } from 'lucide-react';
import { MOCK_CATALOG } from '../constants';
import { CatalogTable } from '../types';
import { generateSampleData } from '../services/geminiService';

const DataCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<CatalogTable | null>(null);
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const filteredTables = MOCK_CATALOG.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTable = async (table: CatalogTable) => {
    setSelectedTable(table);
    setSampleData([]);
    setIsLoadingData(true);
    // Fetch mock data from Gemini
    const data = await generateSampleData(table.name, 5);
    setSampleData(data);
    setIsLoadingData(false);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Table List */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text"
            placeholder="Search tables..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {filteredTables.map(table => (
            <div 
              key={table.id}
              onClick={() => handleSelectTable(table)}
              className={`p-4 rounded-lg border cursor-pointer transition-all group
                ${selectedTable?.id === table.id 
                  ? 'bg-slate-800/80 border-cyan-500/50 shadow-lg shadow-cyan-900/10' 
                  : 'bg-slate-900/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-slate-500" />
                  <span className="text-xs font-medium text-slate-500 uppercase">{table.schema}</span>
                </div>
                <span className="text-[10px] text-slate-600 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {table.columns.length} cols
                </span>
              </div>
              <h3 className={`font-semibold ${selectedTable?.id === table.id ? 'text-cyan-100' : 'text-slate-300 group-hover:text-white'}`}>
                {table.name}
              </h3>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                   <TableIcon size={12} /> {table.rowCount.toLocaleString()} rows
                </span>
                <span className="flex items-center gap-1">
                   <Calendar size={12} /> {new Date(table.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        {selectedTable ? (
          <>
            <div className="p-6 border-b border-slate-800 bg-slate-900">
              <div className="flex justify-between items-start">
                
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <Database size={14} /> {selectedTable.schema}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedTable.name}</h2>
                </div>
                <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download size={16} /> Export DDL
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Schema Definition */}
              <section>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Schema Definition</h3>
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900/50 text-slate-500 font-medium border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Column Name</th>
                        <th className="px-4 py-3">Data Type</th>
                        <th className="px-4 py-3">Nullable</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                      {selectedTable.columns.map(col => (
                        <tr key={col.name}>
                          <td className="px-4 py-3 font-mono text-cyan-300">{col.name}</td>
                          <td className="px-4 py-3 text-purple-300">{col.type}</td>
                          <td className="px-4 py-3 text-slate-500">{col.nullable ? 'YES' : 'NO'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Data Preview */}
              <section>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                     Data Preview (AI Generated)
                   </h3>
                   {isLoadingData && (
                     <span className="text-xs text-cyan-400 animate-pulse">Generating sample rows...</span>
                   )}
                </div>
                
                <div className="border border-slate-800 rounded-lg overflow-hidden overflow-x-auto bg-slate-900/20">
                  {sampleData.length > 0 ? (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-900/50 text-slate-500 font-medium border-b border-slate-800">
                        <tr>
                          {Object.keys(sampleData[0]).map(key => (
                            <th key={key} className="px-4 py-3">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {sampleData.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            {Object.values(row).map((val: any, j) => (
                              <td key={j} className="px-4 py-3 text-slate-300">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-slate-500">
                      {isLoadingData ? 'Loading...' : 'No preview available'}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
             <Database size={48} className="mb-4 opacity-20" />
             <p>Select a table to view schema and sample data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCatalog;

