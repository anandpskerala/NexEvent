import React from 'react'
import { SidebarItem } from '../../utils/SidebarUtils'
import { BarChart2, Calendar, GitPullRequest, Home, MessageSquare, Ticket} from 'lucide-react'

export const OrganizerSideBar: React.FC<{sidebarCollapsed: boolean, section: string}> = ({sidebarCollapsed, section}) => {
  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-56'} bg-white text-gray-900 flex flex-col transition-all duration-300`}>
      <div className={`p-4 flex items-center font-bold text-lg border-b border-r border-gray-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        {!sidebarCollapsed && (
          <div className="bg-blue-600 text-white h-6 w-6 flex items-center justify-center rounded mr-2">N</div>
        )}
        {!sidebarCollapsed && <span className="text-blue-600">NexEventOrganizer</span>}
        {sidebarCollapsed && <div className="bg-blue-600 text-white h-8 w-8 flex items-center justify-center rounded">N</div>}
      </div>

      <div className="flex flex-col flex-1 px-2 gap-2 mt-1 border-r border-gray-300">
        <SidebarItem icon={<Home size={16}/>} text="Dashboard" href="/organizer/dashboard" collapsed={sidebarCollapsed} active={section === "dashboard"} />
        <SidebarItem icon={<Calendar size={16}  />} text="Events" href="/organizer/events" collapsed={sidebarCollapsed} active={section === "events"} />
        <SidebarItem icon={<Ticket size={16} />} text="Bookings" href="/organizer/bookings" collapsed={sidebarCollapsed} active={section === "bookings"} />
        <SidebarItem icon={<MessageSquare size={16}  />} text="Messages" href="/messages" collapsed={sidebarCollapsed} active={section === "messages"} />
        <SidebarItem icon={<GitPullRequest size={16}  />} text="Request a feature" href="/organizer/request-a-feature" collapsed={sidebarCollapsed} active={section === "request a feature"} />
        <SidebarItem icon={<BarChart2 size={16}  />} text="Analytics" href="/organizer/analytics" collapsed={sidebarCollapsed} active={section === "analytics"} />
      </div>
    </div>
  )
}