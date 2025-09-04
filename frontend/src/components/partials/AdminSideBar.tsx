import React from 'react'
import { AdminSidebarItem, BarChartIcon, BellIcon, FileTextIcon, GridIcon, LayersIcon, ListIcon, StarIcon, TagIcon, UsersIcon } from "../../utils/SidebarUtils"; 
import { CustomLogo } from './CustomLogo';

export const AdminSideBar: React.FC<{sidebarCollapsed: boolean, section: string}> = ({sidebarCollapsed, section}) => {
  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-all duration-500 ease-in-out shadow-2xl`}>
      <div className={`p-6 flex items-center font-bold text-xl border-b border-slate-700/30 backdrop-blur-sm ${sidebarCollapsed ? 'justify-center px-4' : ''} group`}>
        {!sidebarCollapsed && (
          <>
            <CustomLogo className="w-8 h-8 mr-3" />
            <span className="bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent">
              NexEventAdmin
            </span>
          </>
        )}
        {sidebarCollapsed && (
          <CustomLogo className="w-10 h-10" />
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <div className="space-y-1">
          <AdminSidebarItem 
            icon={<GridIcon />} 
            text="Dashboard" 
            href="/admin/dashboard" 
            collapsed={sidebarCollapsed} 
            active={section === "dashboard"} 
          />
          <AdminSidebarItem 
            icon={<BarChartIcon />} 
            text="Analytics" 
            href="/admin/analytics" 
            collapsed={sidebarCollapsed} 
            active={section === "analytics"} 
          />
        </div>

        <div className="pt-4">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              User Management
            </div>
          )}
          <div className="space-y-1">
            <AdminSidebarItem 
              icon={<UsersIcon />} 
              text="Users" 
              href="/admin/users" 
              collapsed={sidebarCollapsed} 
              active={section === "users"} 
            />
            <AdminSidebarItem 
              icon={<ListIcon />} 
              text="Organizer Requests" 
              href="/admin/organizer-requests" 
              collapsed={sidebarCollapsed} 
              active={section === "organizer requests"} 
            />
            <AdminSidebarItem 
              icon={<FileTextIcon />} 
              text="Reports" 
              href="/admin/user-reports" 
              collapsed={sidebarCollapsed} 
              active={section === "reports"} 
            />
          </div>
        </div>

        <div className="pt-4">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Content & Features
            </div>
          )}
          <div className="space-y-1">
            <AdminSidebarItem 
              icon={<LayersIcon />} 
              text="Categories" 
              href="/admin/categories" 
              collapsed={sidebarCollapsed} 
              active={section === "category"} 
            />
            <AdminSidebarItem 
              icon={<TagIcon />} 
              text="Coupons" 
              href="/admin/coupons" 
              collapsed={sidebarCollapsed} 
              active={section === "coupons"} 
            />
            <AdminSidebarItem 
              icon={<StarIcon />} 
              text="Feature Requests" 
              href="/admin/feature-request" 
              collapsed={sidebarCollapsed} 
              active={section === "feature requests"} 
            />
          </div>
        </div>

        <div className="pt-4">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              System
            </div>
          )}
          <div className="space-y-1">
            <AdminSidebarItem 
              icon={<BellIcon />} 
              text="Notifications" 
              href="/notifications" 
              collapsed={sidebarCollapsed} 
              active={section === "notifications"} 
            />
          </div>
        </div>
      </nav>

    </div>
  )
}