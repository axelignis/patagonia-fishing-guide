import React, { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin(): JSX.Element {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseClient();
    const { error: err } = await supabase.auth.signInWithOtp({ 
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` }
    });
    if (err) setError(err.message);
    else setSent(true);
  }

  useEffect(() => {
    if (session) {
      navigate('/admin', { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center px-4">
      <form onSubmit={handleSendLink} className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Acceso Administración</h1>
        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="tu@email.com"
        />
        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300"
        >
          Enviar link de acceso
        </button>
        {sent && <p className="mt-4 text-emerald-700">Revisa tu correo para el enlace mágico.</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
}


