import React from 'react'
import { SidebarItem } from '../../utils/SidebarUtils'
import { BarChart2, Calendar, GitPullRequest, Home, MessageSquare, Ticket } from 'lucide-react'
import { CustomLogo } from './CustomLogo'

export const OrganizerSideBar: React.FC<{ sidebarCollapsed: boolean, section: string }> = ({ sidebarCollapsed, section }) => {
  return (
    <div className={`
        ${sidebarCollapsed ? 'w-16' : 'w-64'} 
        bg-gradient-to-b from-white to-gray-50/80 
        backdrop-blur-sm
        flex flex-col transition-all duration-300 ease-in-out
        border-r border-gray-200/60
        shadow-xl shadow-gray-900/5
    `}>
      <div className={`
        p-4 flex items-center border-b border-gray-200/60
        ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
        bg-white/80 backdrop-blur-sm
      `}>
        <div className="flex items-center space-x-3 mt-5">
          <CustomLogo className={sidebarCollapsed ? "w-10 h-10" : "w-12 h-12"} />
          {!sidebarCollapsed && (
            <div className="opacity-0 animate-fadeIn">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
                NexEvent
              </h1>
              <p className="text-xs text-gray-500 font-medium">Organizer</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        <SidebarItem
          icon={<Home size={18} />}
          text="Dashboard"
          href="/organizer/dashboard"
          collapsed={sidebarCollapsed}
          active={section === "dashboard"}
        />
        <SidebarItem
          icon={<Calendar size={18} />}
          text="Events"
          href="/organizer/events"
          collapsed={sidebarCollapsed}
          active={section === "events"}
        />
        <SidebarItem
          icon={<Ticket size={18} />}
          text="Bookings"
          href="/organizer/bookings"
          collapsed={sidebarCollapsed}
          active={section === "bookings"}
        />
        <SidebarItem
          icon={<MessageSquare size={18} />}
          text="Messages"
          href="/messages"
          collapsed={sidebarCollapsed}
          active={section === "messages"}
        />
        <SidebarItem
          icon={<BarChart2 size={18} />}
          text="Analytics"
          href="/organizer/analytics"
          collapsed={sidebarCollapsed}
          active={section === "analytics"}
        />

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <SidebarItem
          icon={<GitPullRequest size={18} />}
          text="Request Feature"
          href="/organizer/request-a-feature"
          collapsed={sidebarCollapsed}
          active={section === "request a feature"}
        />
      </nav>
    </div>
  )
}