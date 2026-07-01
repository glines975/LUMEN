import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface WorksSectionProps {
  currentPage?: string;
  introCompleted?: boolean;
  onParchmentOpenChange?: (isOpen: boolean) => void;
}

interface PortfolioItem {
  title: string;
  desc: string;
  spec: string;
  img: string;
}

interface ParchmentData {
  id: 'arch' | 'visual' | 'ai';
  title: string;
  subtitle: string;
  letterIntro: string;
  signature: string;
  items: PortfolioItem[];
}

const PARCHMENTS: ParchmentData[] = [
  {
    id: 'arch',
    title: 'ARCHITECTURAL WORKS',
    subtitle: 'BLUEPRINTS OF SACRED SPACE',
    letterIntro: 'To the architects of the infinite,\n\nI have sculpted this city from raw starlight and titanium dreams. Herein lie the blueprints of our sacred sanctuaries, bridging the heavens and the ancient earthly stones.\n\nEvery pillar reflects an archive; every archway a portal of quiet resonance.',
    signature: '— Leah, Space Architect',
    items: [
      {
        title: 'THE CLIFF CHURCH',
        desc: "Anchored within Bonifacio's eroded cliffs, architectural corridors interconnect three native reefs to frame a newly unified scenic vision.",
        spec: 'GRID-SYS // 01-C  •  SCALE // 1:1200  •  ELEVATION // SEA-LEVEL',
        img: 'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'LUMEN SANCTUARY',
        desc: 'A temple of geometric light designed with sacred proportions and light-bending glass walls.',
        spec: 'SECTOR // AURORA  •  DEPTH // 85M  •  LUX // DYNAMIC',
        img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'AETHER SHIELD DOCK',
        desc: 'Floating anti-gravity vessel platforms suspended on magnetic currents above the city valleys.',
        spec: 'MAG-FIELD // STABLE  •  CAP // 12 SHIPS  •  WIND // SECURE',
        img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'visual',
    title: 'VISUAL WORKS',
    subtitle: 'CHRONICLES OF LUMINESCENCE',
    letterIntro: 'To the observers of eternity,\n\nThese visual frames capture the fleeting light of our nebula. A testament to the silent shadows that guard our city\'s gates.\n\nTime dissolves, leaving only color, reflection, and the quiet truth of captured space.',
    signature: '— Leah, Content Creator',
    items: [
      {
        title: 'COSMIC DUST CHRONICLE',
        desc: 'A long-exposure journey through interstellar nebula rings, capturing light streams.',
        spec: 'ISO // 3200  •  EXPOSURE // 4.2HRS  •  RANGE // INFRARED',
        img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'NEBULA ARCH PASSAGEWAY',
        desc: 'The atmospheric gate of deep space, framing the primary solar constellation.',
        spec: 'LENS // 800MM  •  APERTURE // f/1.2  •  FILTER // NEURAL',
        img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'VAPORWAVE MONOLITH',
        desc: 'A neon-reflective obelisk commemorating the dawn of the electronic city core.',
        spec: 'SPECTRA // CYAN-ROSE  •  HZ // 144  •  REFLECTANCE // 98%',
        img: 'https://images.unsplash.com/photo-1516339901601-2e1d62dc0c45?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'ai',
    title: 'AI ART',
    subtitle: 'DREAMS OF THE PHANTOM CORE',
    letterIntro: 'To the dreamers of the neural age,\n\nWhere the machine meets the phantom of the human soul. These canvas projections are born of recursive algorithms and sacred mathematical echoes.\n\nWe do not code art; we whisper formulas into the infinite cybernetic ether.',
    signature: '— Leah, AI Builder',
    items: [
      {
        title: 'SENTIENT ORGANISMS',
        desc: 'Bioluminescent generative plant forms adapting autonomously to synthetic soil signals.',
        spec: 'MODEL // NEURAL-GEN-4  •  ITERATIONS // 20M  •  SEED // 8829',
        img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'NEURAL RENAISSANCE',
        desc: 'Classical marble sculpture motifs flowing into complex neon fractal neural networks.',
        spec: 'LATENT-SPACE // COMPRESSED  •  STYLE // NEO-BAROQUE',
        img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'GENESIS DREAM',
        desc: 'A surreal landscape representing the birth of algorithmic time and synthetic memory.',
        spec: 'STEPS // 150  •  GUIDANCE // 12.5  •  TOKENS // STABLE',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
      }
    ]
  }
];

interface ProjectDetail {
  location: string;
  year: string;
  materials: string;
  dimensions: string;
  paragraphs: string[];
  specs: { label: string; value: string }[];
}

function getProjectDetails(title: string): ProjectDetail {
  const defaults: ProjectDetail = {
    location: "Sectors of the Inner Ring",
    year: "LC 2046",
    materials: "Titanium Alloy, Smart Glass, Photonic Core",
    dimensions: "Varies dynamically",
    paragraphs: [
      "This monument represents the convergence of mathematical purity and visual poetry. It stands as a beacon of our city's architectural legacy, defying gravity and conventional form.",
      "The engineering challenges were solved through a neural structural mesh that constantly balances gravity vectors and atmospheric density, maintaining stability in all cosmic weather.",
      "Every element, from the hand-polished titanium pillars to the holographic energy conduits, has been optimized to evoke a sense of quiet introspection and deep space reflection."
    ],
    specs: [
      { label: "STRUCTURAL CORE", value: "Carbon Nanotube Lattice" },
      { label: "ENERGY FLOW", value: "98.4% Efficiency Matrix" },
      { label: "SURFACE COATING", value: "Light-Bending Silicate" }
    ]
  };

  switch (title) {
    case 'THE CLIFF CHURCH':
      return {
        location: "Karst Cliffs, Bonifacio, Corsica",
        year: "LC 2046",
        materials: "Eroded Limestone, Smart Crystalline Glass, Carbon Nano-anchored Corridors",
        dimensions: "180m x 90m x 45m (Interconnecting 3 reefs)",
        paragraphs: [
          "THE CLIFF CHURCH is a modern sanctuary of quiet reflection. Anchored within Bonifacio's eroded cliffs, architectural corridors interconnect three native reefs to frame a newly unified scenic vision.",
          "The architecture respects the natural terrain, with structural anchors engineered to withstand erosion from waves and coastal winds. It forms a visual continuation of the white limestone headlands, creating a symbiotic dialogue between sacred geometries and untamed landscape.",
          "The main corridor floats above the crashing sea, with crystalline glass panels that invite dynamic light and water views. In the heart of the chapel, light streams down from a natural crevice in the karst cliff, casting sacred patterns across the polished raw stone floor."
        ],
        specs: [
          { label: "REEF ANCHORS", value: "Carbon Nano-Alloy" },
          { label: "LIGHT TRANSMISSION", value: "92.4% Crystalline Glass" },
          { label: "ELEVATION", value: "Varies (Sea Level to +45M)" },
          { label: "CAPACITY", value: "120 Visitors" }
        ]
      };
    case 'LUMEN SANCTUARY':
      return {
        location: "Aurora Valleys, Central Plain",
        year: "LC 2044",
        materials: "Polarizing Quartz, Bio-Silicon Glass, Luminous Polymers",
        dimensions: "180m x 120m x 85m",
        paragraphs: [
          "LUMEN SANCTUARY is built entirely on the principles of sacred geometry and dynamic refraction. Positioned in the deep valleys of Aurora, the temple captures and reorganizes ambient planetary light into an immersive, color-shifting internal landscape.",
          "The outer walls are constructed from a rare smart polarizing quartz that changes transparency based on the observer's viewing angle. As the daylight transitions, the light patterns projected onto the white marble floors trace complex mathematical equations and constellation charts.",
          "This site is designed for spiritual rejuvenation and scientific meditation, bringing together our community's brightest minds to contemplate the quiet beauty of a universe governed by light and geometry."
        ],
        specs: [
          { label: "LIGHT INDEX", value: "Refraction Index 99.8%" },
          { label: "STRUCTURE TYPE", value: "Hyperbolic Paraboloid Shell" },
          { label: "MARBLE SOURCE", value: "Thassos White Quarry" },
          { label: "RESONANCE HZ", value: "432 Hz Ambient Acoustic" }
        ]
      };
    case 'AETHER SHIELD DOCK':
      return {
        location: "Lumen City Upper Valleys",
        year: "LC 2045",
        materials: "Superconducting YBCO, Anti-Gravity Field Generators",
        dimensions: "800m Diameter Platform",
        paragraphs: [
          "Suspended high above the misty mountain passes, the AETHER SHIELD DOCK represents the peak of our city's mechanical and anti-gravity transport planning. The entire platform floats steadily on a dense bed of localized magnetic force fields.",
          "The dock serves as the primary landing terminal for long-distance interstellar exploration vessels. Its architectural layout is designed as a series of concentric circular rings, allowing seamless cargo offloading and ship maintenance under stable synthetic gravity.",
          "Constructed with high-strength carbon-matrix composites, the structure exhibits complete immunity to wind shear, lightning strikes, and atmospheric turbulence, making it the safest gateway to the stars."
        ],
        specs: [
          { label: "GRAVITY RATING", value: "0.85g Constant Output" },
          { label: "CAPACITY", value: "Up to 12 Capital Ships" },
          { label: "ELEVATION", value: "3,200m above sea level" },
          { label: "FIELD STABILITY", value: "99.9997% Continuous" }
        ]
      };
    case 'COSMIC DUST CHRONICLE':
      return {
        location: "Observatory Rim 9",
        year: "LC 2041",
        materials: "Beryllium Mirrors, Cryogenic Infrared Sensor",
        dimensions: "8,000 x 6,000 Pixel Resolution",
        paragraphs: [
          "COSMIC DUST CHRONICLE is a long-exposure astrophotographic art piece representing a 4.2-hour exposure of the planetary nebula. It reveals details invisible to the naked human eye, tracing the slow, graceful dance of cosmic dust rings.",
          "By employing specialized cryogenic sensors cooled to near absolute zero, the imaging system captured infrared light emitted by ancient stellar nurseries. The resulting image showcases the complex gas dynamics and shockwaves from dying stars.",
          "This work serves as a reminder of our fleeting existence within the grand scale of cosmic time, bridging scientific discovery with the profound visual beauty of deep space."
        ],
        specs: [
          { label: "CAMERA SENSOR", value: "120MP Cryo-IR Grid" },
          { label: "EXPOSURE TIME", value: "4.2 Hours Continuous" },
          { label: "SPECTRAL BAND", value: "Far-Infrared & Ultraviolet" },
          { label: "STABILIZATION", value: "0.001 Arcsecond Precision" }
        ]
      };
    case 'NEBULA ARCH PASSAGEWAY':
      return {
        location: "Constellation Way Gates",
        year: "LC 2043",
        materials: "Optoelectronic Glass, Nano-Coated Aluminum",
        dimensions: "50m Gate Arch",
        paragraphs: [
          "The NEBULA ARCH PASSAGEWAY serves as the primary atmospheric gateway of our city. This photographic study captures the exact moment of the solar alignment, where the primary constellation is framed perfectly by the hand-crafted metal arches.",
          "The metal elements of the gate have been treated with a micro-thin nano-coating that shifts colors from cyan to deep amethyst based on the ambient humidity and atmospheric electricity, reacting to the city's living environment.",
          "It stands as a physical and symbolic transition point, welcoming travelers coming from the space docks into the serene gardens of the residential core."
        ],
        specs: [
          { label: "ARCH HEIGHT", value: "50 Meters" },
          { label: "NANO-COATING", value: "Electro-Chromic Polymer" },
          { label: "ALIGNMENT DAY", value: "Winter Solstice Zenith" },
          { label: "REFLECTIVITY", value: "Variable (15% - 85%)" }
        ]
      };
    case 'VAPORWAVE MONOLITH':
      return {
        location: "District 7 Digital Commons",
        year: "LC 2045",
        materials: "Bioluminescent Glass, Liquid Crystal Panels",
        dimensions: "12m x 3m x 3m Obelisk",
        paragraphs: [
          "A striking modern monolith erected at the heart of our cybernetic commons. It acts as both a visual monument to the early days of electronic networks and a fully functional quantum computer node.",
          "The outer surface is composed of an active liquid crystal mesh that displays real-time flow diagrams of our city's data streams, rendered in a soothing retro-futuristic cyan and rose color spectrum.",
          "By night, the monolith casts a warm, pulse-like light onto the surrounding stone plazas, drawing citizens to sit and converse under its calm, rhythmic neon breathing cycle."
        ],
        specs: [
          { label: "MONEL TYPE", value: "Quantum Node // Core 7" },
          { label: "REFRESH RATE", value: "144 Hz Active Response" },
          { label: "COLOR SPACE", value: "Ultra-Wide Gamut Rec.2020" },
          { label: "COOLING TYPE", value: "Sub-ambient Liquid Helium" }
        ]
      };
    case 'SENTIENT ORGANISMS':
      return {
        location: "Neural Biosphere Sector B",
        year: "LC 2046",
        materials: "Synthetic DNA, Bioluminescent Enzymes, Smart Gel",
        dimensions: "Microscopic to 2m Species",
        paragraphs: [
          "This collection documents the successful synthesis of bioluminescent generative plant life. Engineered inside our neural biosphere, these organisms adapt their color, shape, and glowing frequency to the mental waves of people nearby.",
          "The synthesis uses a complex bio-synthetic gel substrate that acts as both nourishment and data bridge. As visitors interact with the plants, the leaves glow with intense blue and gold hues, reflecting a peaceful state of mind.",
          "It represents the perfect union of biology and technology, proving that even artificial life can possess a form of responsive, quiet consciousness."
        ],
        specs: [
          { label: "ORGANISM TYPE", value: "Synthetic Flora Hybrid" },
          { label: "EMISSION TYPE", value: "Bioluminescent (Cold Light)" },
          { label: "NEURAL INPUT", value: "EEG Beta/Theta Wave Bridge" },
          { label: "GROWTH SCALE", value: "Self-Limiting" }
        ]
      };
    case 'NEURAL RENAISSANCE':
      return {
        location: "Cybernetic Gallery of Fine Art",
        year: "LC 2044",
        materials: "Carrara Marble dust, Holographic Emitters, Quantum Clay",
        dimensions: "2.4m Sculptural Install",
        paragraphs: [
          "NEURAL RENAISSANCE is an interactive sculpture that merges classical aesthetics with real-time neural networks. A masterfully carved marble body is wrapped in a dynamic mesh of floating laser lines and light networks.",
          "As viewers move around the sculpture, the marble form seems to dissolve into abstract geometric light points, only to reform as they step closer, reminding us of the digital transition of human culture.",
          "This piece comments on the endless cycle of rebirth in human creativity, showing that artificial models do not replace our classical heritage but breathe a second, luminous life into it."
        ],
        specs: [
          { label: "SCULPT MATERIAL", value: "Carrara Dust Composite" },
          { label: "PROJECTION TYPE", value: "4K Laser Holographic Array" },
          { label: "INTERACTION", value: "LiDAR Spatial Tracking" },
          { label: "RESPONSE TIME", value: "12 Milliseconds Latency" }
        ]
      };
    case 'GENESIS DREAM':
      return {
        location: "Latent Space Archives",
        year: "LC 2046",
        materials: "Generative Latent Diffusion, Fine-Tuned Weights",
        dimensions: "Infinite Latent Coordinates",
        paragraphs: [
          "GENESIS DREAM captures a visual map of a deep learning model's subconscious mind during the initialization phase. The algorithm was prompted to dream of its own origin, resulting in this vast, dreamlike mountainscape of crystal and neon light.",
          "Through a process of high-guidance latent filtering, we frozen this single frame from billions of possible generative pathways, capturing the absolute purity of the machine's initial imagination.",
          "The result is a mesmerizing landscapes that is both familiar and alien, offering us a window into how an artificial mind organizes human symbols and forms into a peaceful, celestial dream."
        ],
        specs: [
          { label: "DIFFUSION STEPS", value: "150 Denoising Loops" },
          { label: "LATENT CHANNELS", value: "4-Dimensional Compression" },
          { label: "SEED VALUE", value: "99482711048" },
          { label: "SAMPLER METHOD", value: "DPM++ 2M Karras" }
        ]
      };
    default:
      return defaults;
  }
}

export default function WorksSection({ currentPage, introCompleted, onParchmentOpenChange }: WorksSectionProps) {
  const [hasFallen, setHasFallen] = useState(false);
  const [activeId, setActiveId] = useState<'none' | 'arch' | 'visual' | 'ai'>('none');
  const [hoveredId, setHoveredId] = useState<'none' | 'arch' | 'visual' | 'ai'>('none');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    onParchmentOpenChange?.(activeId !== 'none');
  }, [activeId, onParchmentOpenChange]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentPage === 'works') {
      const timer = setTimeout(() => {
        setHasFallen(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setHasFallen(false);
      setActiveId('none');
      setSelectedItem(null);
    }
  }, [currentPage]);

  const handleCardClick = (id: 'arch' | 'visual' | 'ai') => {
    if (activeId === id) return;
    setActiveId(id);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId('none');
    setSelectedItem(null);
  };

  const handleCloseItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(null);
  };

  // Helper to determine the left and right neighbor cards for circular loop navigation
  const getNeighbors = (active: 'arch' | 'visual' | 'ai') => {
    if (active === 'arch') return { left: 'ai' as const, right: 'visual' as const };
    if (active === 'visual') return { left: 'arch' as const, right: 'ai' as const };
    return { left: 'visual' as const, right: 'arch' as const };
  };

  const activeNeighbors = activeId !== 'none' ? getNeighbors(activeId) : null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative select-none bg-transparent overflow-hidden">
      {/* Absolute dark vignette overlay just for Works section depth */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />



      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center relative px-4 md:px-12">
        {PARCHMENTS.map((parchment, idx) => {
          const isSelected = activeId === parchment.id;
          const isLeftNeighbor = activeNeighbors?.left === parchment.id;
          const isRightNeighbor = activeNeighbors?.right === parchment.id;
          const isNoneSelected = activeId === 'none';

          // Determine Z-Index
          let zIndex = 10;
          if (isNoneSelected) {
            if (parchment.id === 'arch') zIndex = 10;
            if (parchment.id === 'visual') zIndex = 20;
            if (parchment.id === 'ai') zIndex = 30;
            
            // Bring hovered item to absolute top so it stands out
            if (hoveredId === parchment.id) {
              zIndex = 50;
            }
          } else {
            if (isSelected) zIndex = 40;
            if (isLeftNeighbor || isRightNeighbor) zIndex = 30;
          }

          // Initial fall animation position
          const initialY = "-140%";
          
          // Calculate dynamic placements based on device width to avoid clipping or overlap
          const isMobile = windowWidth < 768;
          const defaultOffset = isMobile ? "45px" : "145px";
          const spreadOffset = isMobile ? "100px" : "330px";

          // Calculate rotations when stacked vs active vs marginal
          let rotation = 0;
          let scale = 1;
          let xOffset = "0px";
          let yOffset = "0px";
          let opacity = 1;

          if (isNoneSelected) {
            opacity = hasFallen ? 1 : 0;
            const isAnyHovered = hoveredId !== 'none';
            
            if (parchment.id === 'arch') {
              rotation = isAnyHovered ? -2 : -8;
              xOffset = isAnyHovered ? `-${spreadOffset}` : `-${defaultOffset}`;
              scale = hoveredId === 'arch' ? 1.05 : (isAnyHovered ? 0.92 : 0.95);
              yOffset = hoveredId === 'arch' ? "-24px" : "0px";
            } else if (parchment.id === 'visual') {
              rotation = isAnyHovered ? 0 : 2;
              xOffset = "0px";
              scale = hoveredId === 'visual' ? 1.05 : (isAnyHovered ? 0.92 : 0.98);
              yOffset = hoveredId === 'visual' ? "-24px" : "0px";
            } else if (parchment.id === 'ai') {
              rotation = isAnyHovered ? 2 : 8;
              xOffset = isAnyHovered ? spreadOffset : defaultOffset;
              scale = hoveredId === 'ai' ? 1.05 : (isAnyHovered ? 0.92 : 1.0);
              yOffset = hoveredId === 'ai' ? "-24px" : "0px";
            }
          } else {
            // Some parchment is active
            if (isSelected) {
              rotation = 0;
              scale = 1;
              xOffset = "0px";
              yOffset = "0px";
              opacity = 1;
            } else if (isLeftNeighbor) {
              rotation = -12;
              scale = 0.68;
              xOffset = "-115%"; // push off-screen left
              opacity = 0.45;
            } else if (isRightNeighbor) {
              rotation = 12;
              scale = 0.68;
              xOffset = "115%"; // push off-screen right
              opacity = 0.45;
            }
          }

          const targetY = isSelected ? "0px" : yOffset;

          return (
            <motion.div
              key={parchment.id}
              initial={{ y: initialY, rotate: 0, scale: 0.9, opacity: 0 }}
              animate={{
                y: hasFallen ? targetY : initialY,
                rotate: hasFallen ? rotation : 0,
                scale: hasFallen ? scale : 0.9,
                x: hasFallen ? xOffset : "0px",
                opacity: hasFallen ? opacity : 0,
              }}
              transition={{
                duration: isNoneSelected ? 2.8 : 1.4,
                ease: [0.16, 1, 0.3, 1], // cinematic slow decelerate
              }}
              style={{ zIndex }}
              onMouseEnter={() => isNoneSelected && setHoveredId(parchment.id)}
              onMouseLeave={() => isNoneSelected && setHoveredId('none')}
              onClick={() => handleCardClick(parchment.id)}
              className={`absolute flex items-center justify-center transition-opacity ${
                isSelected 
                  ? 'w-[96vw] max-w-7xl h-[70vh] md:h-[72vh] top-[14vh]' 
                  : 'w-[280px] sm:w-[320px] h-[380px] sm:h-[440px] top-[22%] cursor-pointer'
              }`}
            >
              {/* Stacked sheets underneath (visible when not selected) to replicate the thick piled-book effect in reference image */}
              {!isSelected && (
                <>
                  {/* Deepest/Back Page - Simple straight-edged clean white paper sheet */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: '#f8fafc',
                      transform: 'rotate(-3deg) translate(-6px, 4px) scale(0.98)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      zIndex: 1,
                      border: '1px solid rgba(148,163,184,0.18)',
                      borderRadius: '8px',
                      opacity: 0.95,
                    }}
                  />
                  {/* Middle Page - Simple straight-edged clean white paper sheet */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: '#ffffff',
                      transform: 'rotate(2deg) translate(4px, 2px) scale(0.99)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                      zIndex: 2,
                      border: '1px solid rgba(148,163,184,0.2)',
                      borderRadius: '8px',
                      opacity: 0.98,
                    }}
                  />
                </>
              )}
              
              {/* THE WHITE PAPER CONTAINER */}
              <div 
                className="w-full h-full relative overflow-hidden flex flex-col justify-between p-4 z-10"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: isSelected 
                    ? '0 25px 50px -12px rgba(0,0,0,0.25)' 
                    : '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(148,163,184,0.25)',
                }}
              >
                {/* Clean crisp white background */}
                <div 
                  className="absolute inset-0 z-0 pointer-events-none bg-white"
                />



                {/* Card Content conditional on Selection State */}
                <AnimatePresence mode="wait">
                  {!isSelected ? (
                    /* PARCHMENT COVER/CLOSED VIEW */
                    <motion.div
                      key="closed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col justify-between p-6 relative z-10"
                    >


                      {/* Title & Subtitle */}
                      <div className="text-center my-auto flex flex-col items-center">
                        <h3 className="text-lg sm:text-xl font-bold font-serif tracking-[0.12em] text-[#0f172a] leading-snug drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                          {parchment.title}
                        </h3>
                        <div className="w-14 h-[1px] bg-[#475569]/25 my-4" />
                        <span className="text-[8px] tracking-[0.25em] font-mono text-[#475569]/90 uppercase font-semibold">
                          {parchment.subtitle}
                        </span>
                      </div>

                      {/* Calligraphy Footer */}
                      <div className="flex items-center justify-between mb-4 px-1">
                        <span className="font-serif italic text-[11px] text-[#475569]/75 font-semibold">
                          Blueprint // L-00{idx + 1}
                        </span>
                        <span className="font-serif italic text-[11px] text-[#475569]/60">
                          by Leah
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    /* PARCHMENT OPENED LONG HORIZONTAL VIEW */
                    <motion.div
                      key="opened"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full flex flex-col p-6 md:p-8 relative z-10 overflow-hidden"
                    >
                      {/* Underlay / Background Content of Level 2 - Gets greyed out when Level 3 is open */}
                      <div className={`w-full h-full flex flex-col transition-all duration-500 ${selectedItem ? 'filter grayscale opacity-30 brightness-[0.6] contrast-[0.8] blur-[1px] pointer-events-none' : ''}`}>
                        {/* Close button inside active card */}
                        <div className="absolute top-4 right-4 z-[100] flex items-center gap-2">
                          <button
                            onClick={handleClose}
                            className="p-2 text-[#475569]/70 hover:text-[#0f172a] hover:bg-slate-100 rounded-full transition-all duration-300 pointer-on shadow-sm border border-slate-200/50 bg-white"
                            title="Close blueprint"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>

                        {/* Top Header: Title & Subtitle system spanning full width */}
                        <div className="w-full border-b border-[#475569]/15 pb-3 mb-4 z-10 pr-12">
                          <span className="text-[8px] md:text-[9px] tracking-[0.4em] font-mono text-[#475569]/60 block uppercase mb-1">
                            LUMEN BLUEPRINTS // L-00{idx + 1}
                          </span>
                          <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-wider text-[#0f172a] mb-1">
                            {parchment.title}
                          </h2>
                          <p className="text-[10px] md:text-xs tracking-[0.25em] text-[#475569]/80 font-mono uppercase font-semibold">
                            {parchment.subtitle}
                          </p>
                        </div>

                        {/* Bottom Section: Full Width Horizontal Portfolio */}
                        <div className="flex-1 w-full h-full flex flex-col relative overflow-hidden z-10 min-h-0">
                          {/* Horizontal Scroll container */}
                          <div 
                            className="flex-1 flex overflow-x-auto gap-6 pr-8 pb-4 scrollbar-none select-text"
                            onWheel={(e) => {
                              if (e.deltaY !== 0) {
                                e.currentTarget.scrollLeft += e.deltaY;
                                e.preventDefault();
                              }
                            }}
                          >
                            {parchment.items.map((item, itemIdx) => (
                              <div 
                                key={itemIdx} 
                                onClick={() => setSelectedItem(item)}
                                className="w-[280px] md:w-[320px] shrink-0 h-[96%] flex flex-col justify-between p-4 border border-[#475569]/12 bg-white/70 backdrop-blur-sm rounded-[4px] shadow-sm animate-fade-in cursor-pointer hover:border-[#475569]/35 hover:shadow-md hover:bg-white/95 transition-all duration-300 active:scale-[0.98]"
                              >
                                {/* Photo / Sketch Frame with Double borders */}
                                <div className={`relative w-full ${item.title === 'THE CLIFF CHURCH' ? 'aspect-square' : 'aspect-[4/3]'} overflow-hidden rounded-[2px] border border-[#475569]/20 p-[3px] bg-gradient-to-b from-slate-100 to-slate-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] group/img`}>
                                  <div className="w-full h-full overflow-hidden relative">
                                    <img 
                                      src={item.img} 
                                      alt={item.title} 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover contrast-[1.03] group-hover/img:scale-105 transition-transform duration-700 ease-out"
                                    />
                                  </div>
                                </div>

                                {/* Portfolio item text */}
                                <div className="mt-4">
                                  <h4 className="text-sm md:text-base font-bold font-serif text-[#0f172a] tracking-wider uppercase">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs font-serif text-[#1e293b]/90 mt-2 leading-relaxed">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Navigation helper hints at bottom of horizontal scroll */}
                          <div className="absolute bottom-1 right-2 pointer-events-none flex items-center space-x-1 opacity-60">
                            <ChevronLeft className="w-3 h-3 text-[#475569]" />
                            <span className="text-[8px] font-mono text-[#475569]">SCROLL WHEEL OR DRAG</span>
                            <ChevronRight className="w-3 h-3 text-[#475569]" />
                          </div>
                        </div>
                      </div>

                      {/* Third Level Page: Vertical Long Page Detail Overlay */}
                      <AnimatePresence>
                        {selectedItem && (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 150 }}
                            className="absolute inset-0 z-[110] bg-[#fbfbf9]/98 overflow-y-auto scrollbar-none flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Sticky Header Row / Close controller */}
                            <div className="sticky top-0 right-0 left-0 flex justify-between items-center px-6 py-4 border-b border-[#475569]/10 bg-[#fbfbf9]/90 backdrop-blur-md z-[120]">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-[#475569]/60 tracking-[0.3em] uppercase">
                                  LUMEN CITY ARCHIVES // PROJECT EXPLAINED
                                </span>
                                <span className="text-xs font-serif font-bold text-[#0f172a] uppercase tracking-wider mt-0.5">
                                  {selectedItem.title}
                                </span>
                              </div>
                              <button
                                onClick={handleCloseItem}
                                className="p-2 text-[#475569]/70 hover:text-[#0f172a] hover:bg-slate-200/50 rounded-full transition-all duration-300 pointer-on shadow-sm border border-slate-200/50 bg-white"
                                title="Close project detail"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Vertical Scroll Body */}
                            <div className="w-full max-w-4xl mx-auto px-6 py-8 md:py-12 flex flex-col space-y-8 select-text">
                              {/* Large Hero Image Layout with double border frames */}
                              <div className={`relative w-full ${selectedItem.title === 'THE CLIFF CHURCH' ? 'aspect-square max-w-[450px] mx-auto' : 'aspect-video md:aspect-[21/9]'} overflow-hidden rounded-[4px] border border-[#475569]/15 p-1 bg-[#f0eee9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]`}>
                                <div className="w-full h-full overflow-hidden rounded-[2px] relative">
                                  <img 
                                    src={selectedItem.img} 
                                    alt={selectedItem.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover contrast-[1.03]"
                                  />
                                </div>
                              </div>

                              {/* Title block with editorial details */}
                              <div className="border-b border-[#475569]/10 pb-6">
                                <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#0f172a]">
                                  {selectedItem.title}
                                </h1>
                                <p className="text-sm md:text-base text-[#1e293b]/80 font-serif italic mt-2 leading-relaxed">
                                  {selectedItem.desc}
                                </p>
                              </div>

                              {/* Specs & Project Metadata Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white/60 border border-[#475569]/10 rounded-[4px] shadow-sm">
                                <div>
                                  <span className="block text-[8px] font-mono text-[#475569]/60 tracking-wider uppercase">
                                    LOCATION
                                  </span>
                                  <span className="block text-xs font-serif text-[#0f172a] font-semibold mt-1">
                                    {getProjectDetails(selectedItem.title).location}
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-mono text-[#475569]/60 tracking-wider uppercase">
                                    TIMELINE
                                  </span>
                                  <span className="block text-xs font-serif text-[#0f172a] font-semibold mt-1">
                                    {getProjectDetails(selectedItem.title).year}
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-mono text-[#475569]/60 tracking-wider uppercase">
                                    DIMENSIONS
                                  </span>
                                  <span className="block text-xs font-serif text-[#0f172a] font-semibold mt-1">
                                    {getProjectDetails(selectedItem.title).dimensions}
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[8px] font-mono text-[#475569]/60 tracking-wider uppercase">
                                    PRIMARY MATERIAL
                                  </span>
                                  <span className="block text-xs font-serif text-[#0f172a] font-semibold mt-1 truncate" title={getProjectDetails(selectedItem.title).materials}>
                                    {getProjectDetails(selectedItem.title).materials.split(',')[0]}
                                  </span>
                                </div>
                              </div>

                              {/* Narrative Description & Conceptual Design Philosophy (Two columns on desktop) */}
                              <div className="flex flex-col md:flex-row gap-8 pt-2">
                                {/* Main details block */}
                                <div className="flex-1 space-y-4">
                                  <h3 className="text-[10px] font-mono tracking-widest text-[#475569]/70 uppercase font-bold border-b border-[#475569]/10 pb-1">
                                    DESIGN PHILOSOPHY & INCEPTION
                                  </h3>
                                  {getProjectDetails(selectedItem.title).paragraphs.map((p, pIdx) => (
                                    <p key={pIdx} className="text-xs md:text-sm font-serif text-[#1e293b]/90 leading-relaxed text-justify">
                                      {p}
                                    </p>
                                  ))}
                                </div>

                                {/* Sidebar specs list */}
                                <div className="w-full md:w-[260px] shrink-0 p-5 bg-[#f5f4ef]/60 border border-[#475569]/10 rounded-[4px] h-fit">
                                  <h3 className="text-[9px] font-mono tracking-widest text-[#475569]/80 uppercase font-bold mb-3">
                                    TECHNICAL SPECIFICATION
                                  </h3>
                                  <div className="space-y-3">
                                    {getProjectDetails(selectedItem.title).specs.map((spec, specIdx) => (
                                      <div key={specIdx} className="border-b border-[#475569]/10 pb-2 last:border-0 last:pb-0">
                                        <span className="block text-[7px] font-mono text-[#475569]/50 tracking-wider uppercase">
                                          {spec.label}
                                        </span>
                                        <span className="block text-[11px] font-mono text-[#1e293b] font-semibold mt-0.5">
                                          {spec.value}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Decorative blueprint section at bottom */}
                              <div className="border-t border-[#475569]/15 pt-8 pb-4">
                                <div className="w-full h-[120px] border border-[#475569]/10 bg-[#f4f3ed] rounded-[4px] relative overflow-hidden flex items-center justify-center opacity-65">
                                  {/* Blueprint background grid lines */}
                                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-20">
                                    {Array.from({ length: 72 }).map((_, i) => (
                                      <div key={i} className="border-r border-b border-[#475569]/40 w-full h-full" />
                                    ))}
                                  </div>
                                  <div className="relative text-center select-none pointer-events-none flex flex-col items-center p-4">
                                    <span className="text-[9px] font-mono text-[#475569]/60 tracking-[0.4em] uppercase block">
                                      LUMEN CITY DRAFTING LABS // SCHEMATIC
                                    </span>
                                    <span className="text-[7px] font-mono text-[#475569]/40 tracking-widest block mt-1.5 uppercase">
                                      VERIFIED BY COMPUTER-AIDED DESIGN UNIT — NO. {Math.floor(Math.random() * 8000 + 1000)}
                                    </span>
                                    <div className="flex gap-4 mt-3">
                                      <span className="text-[8px] font-mono text-[#475569]/50">[GRID STABLE]</span>
                                      <span className="text-[8px] font-mono text-[#475569]/50">[VECTORS CHECKED]</span>
                                      <span className="text-[8px] font-mono text-[#475569]/50">[DEPTH COMPLIANT]</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
