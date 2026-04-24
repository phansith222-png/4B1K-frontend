import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Calendar, Music4, MapPin } from 'lucide-react';
import { SidebarItem } from '../../icon/SidebarIcons';

export default function NavigationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <h3 className="text-gray-500 text-xs font-black tracking-widest mb-6 uppercase">Navigation</h3>
      <ul className="space-y-3">
        <SidebarItem
          icon={<Flame size={20} />}
          label="Hot Feed"
          active={isActive('/home') || isActive('/')}
          onClick={() => {
            if (isActive('/home') || isActive('/')) {
              window.location.reload();
            } else {
              navigate('/home');
            }
          }}
        />

        <SidebarItem
          icon={<Calendar size={20} />}
          label="Concert Event"
          active={isActive('/new-event')}
          onClick={() => navigate('/new-event')}
        />
        <SidebarItem
          icon={<Music4 size={20} />}
          label="All Artist"
          active={isActive('/artists')}
          onClick={() => navigate('/artists')}
        />
        <SidebarItem
          icon={<MapPin size={20} />}
          label="Map Event"
          active={isActive('/nearby-events')}
          onClick={() => navigate('/nearby-events')}
        />
      </ul>
    </div>
  );
}

