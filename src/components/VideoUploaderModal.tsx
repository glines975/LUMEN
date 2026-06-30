import React, { useState, useEffect } from 'react';
import { X, Upload, Check, HelpCircle, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PageScene } from '../App';

interface VideoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Record<'home' | 'about' | 'works' | 'contact', PageScene>;
  onUpdateScene: (pageId: 'home' | 'about' | 'works' | 'contact', newScene: PageScene) => void;
  defaultPage: 'home' | 'about' | 'works' | 'contact';
}

export default function VideoUploaderModal({ 
  isOpen, 
  onClose, 
  scenes,
  onUpdateScene,
  defaultPage
}: VideoUploaderModalProps) {
  // Local state for all 4 scenes to allow editing and batch saving
  const [localScenes, setLocalScenes] = useState<Record<'home' | 'about' | 'works' | 'contact', PageScene>>(scenes);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'works' | 'contact'>(defaultPage);

  // Keep local state in sync when modal opens or scenes change externally
  useEffect(() => {
    if (isOpen) {
      setLocalScenes(scenes);
      setActiveTab(defaultPage);
    }
  }, [isOpen, scenes, defaultPage]);

  if (!isOpen) return null;

  const currentScene = localScenes[activeTab];

  const handleApply = () => {
    const pages: Array<'home' | 'about' | 'works' | 'contact'> = ['home', 'about', 'works', 'contact'];
    pages.forEach(page => {
      onUpdateScene(page, localScenes[page]);
    });
    onClose();
  };

  const updateActiveSceneField = <K extends keyof PageScene>(key: K, value: PageScene[K]) => {
    setLocalScenes(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [key]: value
      }
    }));
  };

  const handleLayerUpload = (layer: 'bg' | 'depth' | 'mid' | 'fg', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        if (base64Data) {
          if (layer === 'bg') updateActiveSceneField('backgroundImage', base64Data);
          if (layer === 'depth') updateActiveSceneField('depthMapImage', base64Data);
          if (layer === 'mid') updateActiveSceneField('midgroundImage', base64Data);
          if (layer === 'fg') updateActiveSceneField('foregroundImage', base64Data);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'home' as const, label: '首页', english: 'HOME', num: '01' },
    { id: 'about' as const, label: '关于我', english: 'ABOUT', num: '02' },
    { id: 'works' as const, label: '我的作品', english: 'WORKS', num: '03' },
    { id: 'contact' as const, label: '联系方式', english: 'CONTACT', num: '04' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0b0b11] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-4 h-4 text-blue-400 animate-pulse" />
            <h3 className="text-sm font-sans tracking-widest text-white uppercase font-bold">
              2.5D 多页面独立视差背景配置
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 pointer-on"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Page Tab Selector */}
        <div className="bg-[#12121c] px-6 py-3 border-b border-white/5 grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-1 rounded-lg text-center transition-all duration-300 relative flex flex-col items-center justify-center border ${
                  isActive 
                    ? 'border-blue-500/40 bg-blue-500/5 text-white' 
                    : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                <span className="font-mono text-[9px] text-blue-400/50 mb-0.5">{tab.num}</span>
                <span className="text-xs font-bold font-sans tracking-wide">{tab.label}</span>
                <span className="text-[8px] font-mono tracking-widest uppercase opacity-40">{tab.english}</span>
                {isActive && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Mode Selector (WebGL Depth Map vs Traditional PNG) */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">// SELECT PARALLAX ENGINE / 选择视差渲染引擎</span>
            <div className="grid grid-cols-2 gap-3">
              {/* Option A: WebGL Depth Map */}
              <button
                type="button"
                onClick={() => updateActiveSceneField('backgroundMode', 'depthMap')}
                className={`p-4 border text-left transition-all duration-300 relative rounded-xl ${
                  currentScene.backgroundMode === 'depthMap' 
                    ? 'border-blue-500 bg-blue-500/5 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                    : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                }`}
              >
                {currentScene.backgroundMode === 'depthMap' && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                )}
                <div className="flex items-center space-x-2 mb-1">
                  <Sparkles className={`w-4 h-4 ${currentScene.backgroundMode === 'depthMap' ? 'text-blue-400' : 'text-white/40'}`} />
                  <span className="text-xs font-bold tracking-wider">WebGL 2.5D 景深图模式</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  只需1张原图 + 1张黑白深度图。利用像素着色器进行微积分位移，呈现流畅而连续的电影质感。
                </p>
              </button>

              {/* Option B: Classic Layered PNG */}
              <button
                type="button"
                onClick={() => updateActiveSceneField('backgroundMode', 'layered')}
                className={`p-4 border text-left transition-all duration-300 relative rounded-xl ${
                  currentScene.backgroundMode === 'layered' 
                    ? 'border-purple-500 bg-purple-500/5 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:text-white'
                }`}
              >
                {currentScene.backgroundMode === 'layered' && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                )}
                <div className="flex items-center space-x-2 mb-1">
                  <Layers className={`w-4 h-4 ${currentScene.backgroundMode === 'layered' ? 'text-purple-400' : 'text-white/40'}`} />
                  <span className="text-xs font-bold tracking-wider">传统三层 PNG 模式</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  使用 3 张具有透明通道的 PNG 素材（背景/中景/前景），通过分层错速位移产生空间景深。
                </p>
              </button>
            </div>
          </div>

          {/* Dynamic Help Card based on selected mode */}
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-blue-300/80">
            <HelpCircle className="w-5 h-5 flex-shrink-0 text-blue-400" />
            <div>
              {currentScene.backgroundMode === 'depthMap' ? (
                <>
                  <p className="font-semibold text-blue-200 mb-1">什么是 2.5D WebGL 景深图时差？</p>
                  <p className="mb-2">
                    这是单图视差技术。您只需提供一幅正常照片，以及一幅灰度深度图（白色代表最靠近镜头，黑色代表无限远景）。
                  </p>
                  <p className="font-semibold text-emerald-300 mt-2 mb-1">💡 智能无痛 Fallback 特性</p>
                  <p className="text-white/70">
                    如果您只准备了原图而没有灰度深度图，没关系！**我们的 WebGL 引擎会自动为您生成自然的线性渐变深度图**。只输入原图即可立即享受绝美 2.5D 视差！
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-purple-200 mb-1">如何定制传统三层 PNG 视差？</p>
                  <p className="mb-2">
                    在 Photoshop 或是剪辑软件中将画面切片，导出为三张图：
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 pl-1 font-mono text-[11px] text-white/70">
                    <li>背景层 (Deep BG): 远端风景/星空</li>
                    <li>中景层 (Structure): 主体建筑/人物</li>
                    <li>前景层 (Detail/Fog): 烟雾/灯斑/树枝</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Config Form Fields based on Mode */}
          <div className="space-y-4">
            {currentScene.backgroundMode === 'depthMap' ? (
              <>
                {/* Image 1: Original */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500/60" /> Layer 1: 原图 (Original Color Map)
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold uppercase text-blue-400">[{activeTab.toUpperCase()}_BG]</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentScene.backgroundImage}
                      onChange={(e) => updateActiveSceneField('backgroundImage', e.target.value)}
                      placeholder="https://... / background.jpg"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                    />
                    <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer pointer-on flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>上传</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLayerUpload('bg', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Image 2: Depth Map */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500/60" /> Layer 2: 深度图 / 景深图 (Depth Map)
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold uppercase text-emerald-400">[{activeTab.toUpperCase()}_DEPTH]</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentScene.depthMapImage}
                      onChange={(e) => updateActiveSceneField('depthMapImage', e.target.value)}
                      placeholder="留空即触发自动渐变深度图 / depth.jpg"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-400/50 font-mono"
                    />
                    <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer pointer-on flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>上传</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLayerUpload('depth', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Layer 1: Background */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500/60" /> Layer 1: 背景图 (Deep Background)
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold text-blue-400">[BG_15PX]</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentScene.backgroundImage}
                      onChange={(e) => updateActiveSceneField('backgroundImage', e.target.value)}
                      placeholder="background.jpg"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                    />
                    <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer pointer-on flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>上传</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLayerUpload('bg', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Layer 2: Midground */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500/60" /> Layer 2: 中景图 (Midground Objects)
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold text-purple-400">[MID_40PX]</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentScene.midgroundImage}
                      onChange={(e) => updateActiveSceneField('midgroundImage', e.target.value)}
                      placeholder="midground.png"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                    />
                    <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer pointer-on flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>上传</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLayerUpload('mid', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Layer 3: Foreground */}
                <div className="space-y-2 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500/60" /> Layer 3: 前景图 (Foreground Elements)
                    </span>
                    <span className="text-[10px] font-mono text-white/30 font-bold text-emerald-400">[FG_70PX]</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentScene.foregroundImage}
                      onChange={(e) => updateActiveSceneField('foregroundImage', e.target.value)}
                      placeholder="foreground.png"
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                    />
                    <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer pointer-on flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>上传</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLayerUpload('fg', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 flex justify-between items-center bg-black/30">
          <span className="text-[10px] font-mono text-white/30 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-blue-500" />
            <span>设置自动保存于本地浏览器存储内</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-sans text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 pointer-on"
            >
              取消
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-sans font-bold rounded-xl transition-all duration-300 pointer-on flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存并应用所有背景</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
