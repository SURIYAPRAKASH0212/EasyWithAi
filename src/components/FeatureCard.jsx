import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ 
  title, 
  description, 
  buttonText, 
  linkTo, 
  icon: Icon, 
  iconBgColor, 
  iconColor,
  btnBgColor,
  btnHoverColor
}) => {
  return (
    <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Icon Wrapper */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${iconBgColor} ${iconColor} mb-5`}>
        <Icon size={28} />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2.5">
          {title}
        </h3>
        <p className="text-[14px] text-gray-400 dark:text-gray-400 leading-relaxed mb-6 max-w-[200px]">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <Link
        to={linkTo}
        className={`w-full py-2.5 px-4 rounded-xl text-[14px] font-semibold text-white transition-all duration-200 text-center ${btnBgColor} ${btnHoverColor}`}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default FeatureCard;
