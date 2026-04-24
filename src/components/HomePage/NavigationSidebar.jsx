import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Calendar, Music4, MapPin, MessageSquare, Compass } from 'lucide-react';
import { SidebarItem } from '../../icon/SidebarIcons';

export default function NavigationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <Compass size={14} className="text-[#00E5FF] animate-pulse" />
        <h3 className="text-[#00E5FF] text-xs font-black tracking-[0.2em] uppercase">Navigation</h3>
      </div>
      <ul className="space-y-3">
        <SidebarItem
          icon={<Flame size={20} />}
          label="Hot Feed"
          active={isActive('/home') || isActive('/')}
          activeColor="from-[#7C4DFF] to-[#00E5FF]"
          iconColor="text-[#00E5FF]"
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
          activeColor="from-[#00E5FF] to-[#0072FF]"
          iconColor="text-[#00E5FF]"
          onClick={() => navigate('/new-event')}
        />
        <SidebarItem
          icon={<Music4 size={20} />}
          label="All Artist"
          active={isActive('/artists')}
          activeColor="from-[#7C4DFF] to-[#F50057]"
          iconColor="text-[#E040FB]"
          onClick={() => navigate('/artists')}
        />
        <SidebarItem
          icon={<MapPin size={20} />}
          label="Map Event"
          active={isActive('/nearby-events')}
          activeColor="from-[#00F5D4] to-[#00BFA5]"
          iconColor="text-[#00F5D4]"
          onClick={() => navigate('/nearby-events')}
        />
        <SidebarItem
          icon={<MessageSquare size={20} />}
          label="Chat Room"
          active={isActive('/chat')}
          activeColor="from-[#FF0080] to-[#7928CA]"
          iconColor="text-[#FF0080]"
          onClick={() => navigate('/chat')}
        />
      </ul>
    </div>
  );
}

