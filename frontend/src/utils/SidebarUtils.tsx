import { Link } from "react-router-dom";
import type { SideBarProps } from "../interfaces/props/navBarProps";


export const SidebarItem: React.FC<SideBarProps> = ({ icon, text, href, active = false, collapsed = false }) => {
    return (
        <Link
            to={href}
            className={`
            relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200
            ${collapsed ? 'justify-center' : 'justify-start'}
            ${active
                    ? 'bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-105'
                }
            group
        `}
        >
            {active && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 blur-sm"></div>
            )}

            <div className={`
            relative z-10 flex items-center transition-all duration-200
            ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}
        `}>
                <div className="relative">
                    {icon}
                    {active && (
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-sm"></div>
                    )}
                </div>
                {!collapsed && (
                    <span className="ml-3 font-medium text-sm tracking-wide opacity-0 animate-fadeIn">
                        {text}
                    </span>
                )}
            </div>

            {active && !collapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            )}
        </Link>
    );
}

export const AdminSidebarItem: React.FC<SideBarProps> = ({ icon, text, href, active = false, collapsed = false }) => {
  return (
    <Link
      to={href}
      className={`
        group relative flex items-center px-3 py-2.5 rounded-xl
        transition-all duration-300 ease-in-out
        ${active 
          ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]' 
          : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-slate-900/20 hover:transform hover:scale-[1.02]'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
      title={collapsed ? text : undefined}
    >
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
      )}
      
      <div className={`
        flex items-center justify-center
        ${collapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}
        transition-all duration-300
        ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}
      `}>
        {icon}
      </div>
      
      {!collapsed && (
        <div className={`
          text-sm font-medium transition-all duration-300
          ${active ? 'text-white' : 'text-slate-300 group-hover:text-blue-400'}
        `}>
          {text}
        </div>
      )}
      

      {!active && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      )}
      
      {collapsed && (
        <div className="
          absolute left-14 px-3 py-1 bg-slate-800 text-white text-sm rounded-md
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          whitespace-nowrap z-50 shadow-lg
          before:absolute before:left-[-4px] before:top-1/2 before:transform before:-translate-y-1/2
          before:border-4 before:border-transparent before:border-r-slate-800
        ">
          {text}
        </div>
      )}
    </Link>
  );
}

export function GridIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function UsersIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20C4 17 7.5 14 12 14C16.5 14 20 17 20 20" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function CalendarIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" />
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function ListIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H21" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12H21" stroke="currentColor" strokeWidth="2" />
            <path d="M8 18H21" stroke="currentColor" strokeWidth="2" />
            <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

export function TagIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" />
            <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function LayersIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function BarChartIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 20V4" stroke="currentColor" strokeWidth="2" />
            <path d="M6 20V14" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function FileTextIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" />
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" />
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" />
            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function StarIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function BellIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

export function HelpCircleIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" />
            <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}