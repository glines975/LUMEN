import React from 'react';
import { motion } from 'motion/react';
import { PageType } from '../types';
import { Home, User, Briefcase, Sparkles, Mail, Sliders } from 'lucide-react';

interface NavbarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onOpenSettings: () => void;
}

export default function Navbar({ currentPage, onPageChange, onOpenSettings }: NavbarProps) {
  const navItems = [
    { id: 'home' as PageType, label: '首页', english: 'HOME', icon: Home, num: '01' },
    { id: 'about' as PageType, label: '关于我', english: 'ABOUT', icon: User, num: '02' },
    { id: 'works' as PageType, label: '我的作品', english: 'WORKS', icon: Briefcase, num: '03' },
    { id: 'contact' as PageType, label: '联系方式', english: 'CONTACT', icon: Mail, num: '04' },
  ];

  return (
    <>
      {/* Cinematic Horizontal Header Bar */}
      <header className="fixed top-0 left-0 w-full h-16 md:h-20 z-40 px-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-black/70 via-black/20 to-transparent backdrop-blur-[2px]">
        {/* Left: Brand Logo signature */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group pointer-on"
          onClick={() => onPageChange('home')}
        >
          <div className="relative w-8 h-8 flex items-center justify-center border border-white/10 rounded-full group-hover:border-blue-400/30 transition-all duration-300">
            <span className="font-sans font-black text-xs text-white">C</span>
            <div className="absolute inset-0 border border-transparent rounded-full group-hover:scale-110 group-hover:border-blue-400/20 transition-all duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[10px] tracking-[0.3em] text-white/90 uppercase font-black group-hover:text-blue-400 transition-colors duration-300">
              CINEMATIC
            </span>
            <span className="font-mono text-[7px] tracking-[0.2em] text-white/30 uppercase">
              PARALLAX STUDIO
            </span>
          </div>
        </div>

        {/* Center: Main Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-1 bg-black/45 border border-white/5 backdrop-blur-md px-1.5 py-1 rounded-full shadow-2xl">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className="relative px-4 py-1.5 rounded-full text-xs font-sans font-medium tracking-wider transition-all duration-300 pointer-on flex items-center space-x-1.5 overflow-hidden group"
              >
                {/* Active link glass highlight background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                
                <span className="font-mono text-[8px] text-blue-400/50 group-hover:text-blue-400/80 transition-colors">
                  {item.num}
                </span>
                
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Subtle system active pulse */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full font-mono text-[8px] text-white/30 tracking-widest uppercase">
            <span>SYS: ACTIVE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={onOpenSettings}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white text-[9px] font-mono tracking-widest uppercase border border-white/10 hover:border-white/20 rounded-none transition-all duration-300 pointer-on flex items-center space-x-2"
            title="配置背景"
          >
            <Sliders className="w-3 h-3 text-blue-400" />
            <span>配置背景</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Floating tab bar for portable device viewports) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 bg-black/80 border border-white/10 backdrop-blur-2xl py-3 px-4 rounded-3xl shadow-3xl flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`relative p-2.5 flex flex-col items-center justify-center transition-all duration-300 pointer-on rounded-xl ${
                isActive ? 'text-blue-400 scale-110 bg-white/5' : 'text-white/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-sans mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

