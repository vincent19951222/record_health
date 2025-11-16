import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VoiceRecorder } from './VoiceRecorder';
import { Home, Scale, Activity, Droplets, HeartPulse } from 'lucide-react';

interface NavigationBarProps {
  onRecognitionComplete: (result: any) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ onRecognitionComplete }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', Icon: Home },
    { path: '/weight', label: '体重', Icon: Scale },
    { path: '/exercise', label: '运动', Icon: Activity },
    { path: '/blood-sugar', label: '血糖', Icon: Droplets },
    { path: '/blood-pressure', label: '血压', Icon: HeartPulse }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-2 border-black rounded-none z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="text-lg font-semibold text-black uppercase">吃树 - 语音记录你的健康</div>
          <div className="flex gap-2">
            {/* 语音录制按钮 */}
            <div className="-ml-2">
              <VoiceRecorder onRecognitionComplete={onRecognitionComplete} />
            </div>

            {navItems.map(({ path, label, Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    inline-flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase border-2 border-black rounded-none
                    ${isActive
                      ? 'bg-[#50A7C2] text-black'
                      : 'bg-white text-black hover:bg-gray-100'
                    }
                    transition duration-75
                  `}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};