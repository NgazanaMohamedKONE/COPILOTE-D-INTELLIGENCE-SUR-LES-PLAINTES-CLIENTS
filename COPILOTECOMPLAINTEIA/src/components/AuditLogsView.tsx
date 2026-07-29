import React from 'react';
import { AuditLog } from '../types';
import { ShieldCheck, Clock, User, Bot, Search } from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Traçabilité, Journalisation & Sécurité
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Registre d'Audit
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique complet des requêtes au Copilote IA, intentions détectées, utilisateurs et actions système.
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Horodatage</th>
                <th className="py-3 px-4">Utilisateur & Rôle</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Intention IA</th>
                <th className="py-3 px-4">Question / Contenu</th>
                <th className="py-3 px-4">Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{log.userName}</p>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-3 px-4">
                    {log.intention ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {log.intention}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {log.query || log.responseSummary || 'Action système'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {log.sourcesCount !== undefined ? `${log.sourcesCount} sources` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
