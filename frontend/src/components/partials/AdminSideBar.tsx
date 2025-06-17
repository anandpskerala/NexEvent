import React from 'react'
import { AdminSidebarItem, BarChartIcon, BellIcon, FileTextIcon, GridIcon, HelpCircleIcon, LayersIcon, ListIcon, StarIcon, TagIcon, UsersIcon } from "../../utils/SidebarUtils"; 

export const AdminSideBar: React.FC<{sidebarCollapsed: boolean, section: string}> = ({sidebarCollapsed, section}) => {
  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-56'} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
      <div className={`p-4 flex items-center font-bold text-lg border-b border-gray-800 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        {!sidebarCollapsed && (
          <div className="bg-blue-600 text-white h-6 w-6 flex items-center justify-center rounded mr-2">N</div>
        )}
        {!sidebarCollapsed && <span>NexEventAdmin</span>}
        {sidebarCollapsed && <div className="bg-blue-600 text-white h-8 w-8 flex items-center justify-center rounded">N</div>}
      </div>

      <div className="flex-1">
        <AdminSidebarItem icon={<GridIcon />} text="Dashboard" href="/admin/dashboard" collapsed={sidebarCollapsed} active={section === "dashboard"} />
        <AdminSidebarItem icon={<UsersIcon />} text="Users" href="/admin/users" collapsed={sidebarCollapsed} active={section === "users"} />
        <AdminSidebarItem icon={<ListIcon />} text="Organizer Requests" href="/admin/organizer-requests" collapsed={sidebarCollapsed} active={section === "organizer requests"} />
        <AdminSidebarItem icon={<TagIcon />} text="Coupons" href="/admin/coupons" collapsed={sidebarCollapsed} active={section === "coupons"} />
        <AdminSidebarItem icon={<LayersIcon />} text="Category" href="/admin/categories" collapsed={sidebarCollapsed} active={section === "category"} />
        <AdminSidebarItem icon={<BarChartIcon />} text="Analytics" href="/admin/users" collapsed={sidebarCollapsed} active={section === "analytics"} />
        <AdminSidebarItem icon={<FileTextIcon />} text="Reports" href="/admin/users" collapsed={sidebarCollapsed} active={section === "reports"} />
        <AdminSidebarItem icon={<StarIcon />} text="Feature Requests" href="/admin/feature-request" collapsed={sidebarCollapsed} active={section === "feature requests"} />
        <AdminSidebarItem icon={<BellIcon />} text="Notifications" href="/admin/users" collapsed={sidebarCollapsed} active={section === "notifications"} />
        <AdminSidebarItem icon={<HelpCircleIcon />} text="Help & Support" href="/admin/users" collapsed={sidebarCollapsed} active={section === "help & support"} />
      </div>
    </div>
  )
}