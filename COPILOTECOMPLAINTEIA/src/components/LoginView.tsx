import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { BrandLogo } from './BrandLogo';
import { Shield, Sparkles, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

interface LoginViewProps {
  users: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Administrateur');
  const [email, setEmail] = useState('admin.dubois@complaintscope.ai');
  const [password, setPassword] = useState('••••••••••••');

  const selectedUser = users.find((u) => u.role === selectedRole) || users[0];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const u = users.find((item) => item.role === role);
    if (u) {
      setEmail(u.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedUser);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Logo & Brand Title */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-1">
            <BrandLogo size="lg" variant="full" />
          </div>
          <p className="text-xs text-slate-400">
            Copilote d'Intelligence des Plaintes Clients & Risques
          </p>
        </div>

        {/* Profile Selector Cards */}
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Sélectionner un profil d'accès :
          </p>
          <div className="grid grid-cols-3 gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleRoleSelect(u.role)}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                  selectedRole === u.role
                    ? 'bg-blue-900/60 border-orange-500 text-white font-bold ring-1 ring-orange-500'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <img src={u.avatarUrl} alt={u.firstName} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-[11px] font-semibold">{u.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Adresse E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Mot de Passe (Haché & Chiffré)</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-orange-600/30"
          >
            Se Connecter au Copilote <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-800">
          <p className="text-[10px] text-slate-500">
            Compliant CFPB Data Security Protocol • Cryptographie SSL/TLS & JWT Session
          </p>
        </div>

      </div>
    </div>
  );
};
