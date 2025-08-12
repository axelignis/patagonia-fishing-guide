import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  disabled?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  link,
  color,
  disabled = false
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
  };

  if (disabled) {
    return (
      <div className="bg-gray-100 border border-gray-200 text-gray-500 p-6 rounded-2xl opacity-60">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm">{description}</p>
        <div className="mt-3 text-xs">No disponible para tu rol</div>
      </div>
    );
  }

  return (
    <Link 
      to={link} 
      className={`group bg-gradient-to-r ${colorClasses[color]} text-white rounded-2xl p-6 shadow-2xl hover:scale-[1.02] transition-all duration-300 block`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/90 text-sm">{description}</p>
      <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition">
        <span className="text-sm">Acceder</span>
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};
