import React from 'react';

export const StatCard = ({ label, value, delta, deltaType = 'positive', icon: Icon, iconBg = 'bg-sky-100 text-azul-primario' }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-subtle transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-gris-oscuro font-sans tracking-tight">{value}</h3>
        {delta && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              deltaType === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : deltaType === 'negative'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};
