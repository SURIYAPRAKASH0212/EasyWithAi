import React from 'react';
import { User, Building2, MapPin } from 'lucide-react';

const EntityCard = ({ type, name }) => {
  const configs = {
    PERSON: {
      label: 'PERSON',
      icon: User,
      bgColor: 'bg-purple-50/50 dark:bg-purple-950/10',
      borderColor: 'border-purple-100 dark:border-purple-900/30',
      iconBg: 'bg-purple-100/60 dark:bg-purple-900/40 text-[#6C4CF1] dark:text-[#A793FF]',
    },
    ORGANIZATION: {
      label: 'ORGANIZATION',
      icon: Building2,
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/10',
      borderColor: 'border-emerald-100 dark:border-emerald-900/30',
      iconBg: 'bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    },
    LOCATION: {
      label: 'LOCATION',
      icon: MapPin,
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/10',
      borderColor: 'border-amber-100 dark:border-amber-900/30',
      iconBg: 'bg-amber-100/60 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    },
  };

  const config = configs[type.toUpperCase()] || configs.PERSON;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-4 p-4 border rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${config.bgColor} ${config.borderColor}`}>
      {/* Icon */}
      <div className={`p-2.5 rounded-lg flex items-center justify-center ${config.iconBg}`}>
        <Icon size={18} />
      </div>

      {/* Details */}
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
          {config.label}
        </span>
        <span className="text-[15px] font-bold text-gray-900 dark:text-white mt-0.5">
          {name}
        </span>
      </div>
    </div>
  );
};

export default EntityCard;
