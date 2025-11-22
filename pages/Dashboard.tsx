import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Zap, Database, Activity, Layers } from 'lucide-react';
import { MOCK_PIPELINES } from '../constants';

const dataLatency = [
  { time: '00:00', latency: 120 },
  { time: '04:00', latency: 132 },
  { time: '08:00', latency: 101 },
  { time: '12:00', latency: 450 },
  { time: '16:00', latency: 210 },
  { time: '20:00', latency: 180 },
  { time: '23:59', latency: 140 },
];

const dataVolume = [
  { name: 'Mon', rows: 4000 },
  { name: 'Tue', rows: 3000 },
  { name: 'Wed', rows: 2000 },
  { name: 'Thu', rows: 2780 },
  { name: 'Fri', rows: 1890 },
  { name: 'Sat', rows: 2390 },
  { name: 'Sun', rows: 3490 },
];

const StatCard = ({ title, value, trend, trendUp, icon: Icon, color }: any) => (
  <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm hover:border-slate-700 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center text-xs font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span className="ml-1">{trend}</span>
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pipelines" 
          value={MOCK_PIPELINES.length} 
          trend="+12%" 
          trendUp={true} 
          icon={Layers} 
          color="cyan" 
        />
        <StatCard 
          title="Rows Ingested (24h)" 
          value="145.2M" 
          trend="+5.4%" 
          trendUp={true} 
          icon={Database} 
          color="indigo" 
        />
        <StatCard 
          title="Avg Latency" 
          value="240ms" 
          trend="-12ms" 
          trendUp={true} 
          icon={Zap} 
          color="amber" 
        />
        <StatCard 
          title="Compute Cost" 
          value="$1,204" 
          trend="+2.1%" 
          trendUp={false} 
          icon={Activity} 
          color="pink" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latency Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-slate-800 bg-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Pipeline Latency (ms)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataLatency}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Daily Ingestion Volume</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="rows" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Pipelines Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">Active Pipelines</h3>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-500 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Latency</th>
                <th className="px-6 py-3">Rows Processed</th>
                <th className="px-6 py-3">Last Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_PIPELINES.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${p.status === 'active' ? 'bg-green-500/10 text-green-400' : ''}
                      ${p.status === 'error' ? 'bg-red-500/10 text-red-400' : ''}
                      ${p.status === 'paused' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                    `}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{p.latencyMs} ms</td>
                  <td className="px-6 py-4 font-mono">{p.rowsProcessed.toLocaleString()}</td>
                  <td className="px-6 py-4">{p.lastRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
