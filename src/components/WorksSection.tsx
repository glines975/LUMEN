import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Edit, Trash2, Plus, Save, Upload, Image as ImageIcon } from 'lucide-react';

const PAPER_BG = `${import.meta.env.BASE_URL}images/project/paper/background.png`;

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
  thumbnailImg?: string;
  detailHeroImg?: string;
  images?: { src: string; name?: string }[];
  location?: string;
  year?: string;
  materials?: string;
  dimensions?: string;
  paragraphs?: string[];
  specs?: { label: string; value: string }[];
}

async function fileToCompressedDataUrl(file: File, maxSize = 1600, quality = 0.86) {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

function PortfolioImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className="w-full h-full relative bg-[#e2e1db] flex items-center justify-center overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e2e1db]/40 z-10">
          <div className="w-5 h-5 border-[1.5px] border-[#475569]/20 border-t-[#475569] rounded-full animate-spin" />
        </div>
      )}
      <img 
        ref={imgRef}
        src={src} 
        alt={alt} 
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className} transition-opacity duration-300 opacity-100`}
      />
    </div>
  );
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
        img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200&auto=format&fit=crop'
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

function getProjectDetails(item: PortfolioItem): ProjectDetail {
  if (item.location || item.year || item.materials || item.dimensions || item.paragraphs || item.specs) {
    return {
      location: item.location || "Sectors of the Inner Ring",
      year: item.year || "LC 2046",
      materials: item.materials || "Titanium Alloy, Smart Glass",
      dimensions: item.dimensions || "Varies dynamically",
      paragraphs: item.paragraphs || [item.desc],
      specs: item.specs || [{ label: "INFO", value: item.spec }]
    };
  }

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

  switch (item.title) {
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

  const [parchments, setParchments] = useState<ParchmentData[]>(() => {
    const saved = localStorage.getItem('LumenPortfolioParchments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PARCHMENTS;
      }
    }
    return PARCHMENTS;
  });

  const saveParchments = (newData: ParchmentData[]) => {
    setParchments(newData);
    localStorage.setItem('LumenPortfolioParchments', JSON.stringify(newData));
  };

  const persistItemImages = async (files: FileList | File[], append = true) => {
    const nextImages = [] as { src: string }[];
    for (const file of Array.from(files)) {
      const src = await fileToCompressedDataUrl(file);
      if (src) nextImages.push({ src });
    }
    setEditImages(prev => append ? [...prev, ...nextImages] : nextImages);
  };

  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [managerActiveTab, setManagerActiveTab] = useState<'arch' | 'visual' | 'ai'>('arch');
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Item edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSpec, setEditSpec] = useState('');
  const [editImg, setEditImg] = useState('');
  const [editThumbnailImg, setEditThumbnailImg] = useState('');
  const [editDetailHeroImg, setEditDetailHeroImg] = useState('');
  const [editImages, setEditImages] = useState<{ src: string }[]>([]);
  const [editLocation, setEditLocation] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editMaterials, setEditMaterials] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editParagraphs, setEditParagraphs] = useState<string[]>([]);
  const [editSpecs, setEditSpecs] = useState<{ label: string; value: string }[]>([]);

  // Category edit states
  const [editCatTitle, setEditCatTitle] = useState('');
  const [editCatSubtitle, setEditCatSubtitle] = useState('');
  const [editCatLetter, setEditCatLetter] = useState('');
  const [editCatSignature, setEditCatSignature] = useState('');

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
        {parchments.map((parchment, idx) => {
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
                  ? 'w-[96vw] max-w-7xl h-[82vh] md:h-[83vh] top-[8vh]' 
                  : 'w-[280px] sm:w-[320px] h-[380px] sm:h-[440px] top-[calc(18%+5px)] cursor-pointer'
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
                className={`w-full h-full relative overflow-hidden flex flex-col justify-between ${isSelected ? 'p-0' : 'p-4'} z-10`}
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
                        <button
                          onClick={handleClose}
                          className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all duration-300 hover:scale-110 active:scale-90 z-[130] bg-transparent"
                          title="Close blueprint"
                        >
                          <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.2} />
                        </button>

                        {/* Top Header: Title & Subtitle system spanning full width */}
                        <div className="w-full border-b border-[#475569]/15 pb-3 mb-4 z-10 pr-12 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                          <div>
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

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setManagerActiveTab(parchment.id);
                              // Sync category text fields
                              setEditCatTitle(parchment.title);
                              setEditCatSubtitle(parchment.subtitle);
                              setEditCatLetter(parchment.letterIntro);
                              setEditCatSignature(parchment.signature);
                              
                              setEditingItemIdx(null);
                              setIsAddingNew(false);
                              setIsManagerOpen(true);
                            }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-[10px] font-mono font-bold tracking-wider rounded border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-sm"
                          >
                            <Edit className="w-3 h-3 text-blue-600" />
                            <span>管理作品集</span>
                          </button>
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
                                <div className="relative w-full h-[380px] overflow-hidden rounded-[2px] border border-[#475569]/20 p-[3px] bg-gradient-to-b from-slate-100 to-slate-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] group/img">
                                  <div className="w-full h-full overflow-hidden relative">
                                    <PortfolioImage 
                                      src={item.thumbnailImg || item.images?.[0]?.src || item.img} 
                                      alt={item.title} 
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

                        </div>

                        {/* Navigation helper hints at bottom of horizontal scroll */}
                        <div className="absolute bottom-1 md:bottom-1.5 right-6 md:right-8 pointer-events-none flex items-center space-x-1 opacity-60 z-20">
                          <ChevronLeft className="w-3 h-3 text-[#475569]" />
                          <span className="text-[8px] font-mono text-[#475569]">SCROLL WHEEL OR DRAG</span>
                          <ChevronRight className="w-3 h-3 text-[#475569]" />
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
                            className="absolute inset-0 z-[110] bg-[#fbfbf9]/98 flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Close button in absolute corner of the overlay - matches secondary perfectly */}
                            <button
                              onClick={handleCloseItem}
                              className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all duration-300 hover:scale-110 active:scale-90 z-[130] bg-transparent"
                              title="Close project detail"
                            >
                              <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.2} />
                            </button>

                            {/* Header Row */}
                            <div className="w-full flex justify-between items-center px-6 py-4 border-b border-[#475569]/10 bg-[#fbfbf9]/95 backdrop-blur-md z-[120] pr-12 md:pr-16">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-[#475569]/60 tracking-[0.3em] uppercase">
                                  LUMEN CITY ARCHIVES // PROJECT EXPLAINED
                                </span>
                                <span className="text-xs font-serif font-bold text-[#0f172a] uppercase tracking-wider mt-0.5">
                                  {selectedItem.title}
                                </span>
                              </div>
                            </div>

                            {/* Scrollable Container */}
                            <div className="flex-1 overflow-y-auto scrollbar-none">
                              <div className="w-full max-w-4xl mx-auto px-6 py-8 md:py-12 flex flex-col space-y-8 select-text">
                                {/* Large Hero Image Layout with double border frames */}
                                <div className="relative w-full aspect-[21/8] overflow-hidden rounded-[4px] border border-[#475569]/15 p-1 bg-[#f0eee9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                                  <div className="w-full h-full overflow-hidden rounded-[2px] relative">
                                    <PortfolioImage 
                                      src={selectedItem.detailHeroImg || selectedItem.images?.[0]?.src || selectedItem.img} 
                                      alt={selectedItem.title}
                                      className="w-full h-full object-cover contrast-[1.03]"
                                    />
                                  </div>
                                </div>

                                {/* Title block with editorial details */}
                                <div className="border-b border-[#475569]/10 pb-6 mx-auto max-w-3xl text-center">
                                  <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#0f172a]">
                                    {selectedItem.title}
                                  </h1>
                                  <p className="text-sm md:text-base text-[#1e293b]/80 font-serif italic mt-2 leading-relaxed">
                                    {selectedItem.desc}
                                  </p>
                                </div>

                                {/* Narrative Description */}
                                <div className="space-y-4 mx-auto max-w-3xl">
                                  {getProjectDetails(selectedItem).paragraphs.map((p, pIdx) => (
                                    <p key={pIdx} className="text-xs md:text-sm font-serif text-[#1e293b]/90 leading-relaxed text-justify text-center md:text-justify md:text-center [text-align-last:center]">
                                      {p}
                                    </p>
                                  ))}
                                </div>

                                {/* More images in upload order */}
                                {selectedItem.images && selectedItem.images.length > 0 && (
                                  <div className="space-y-4">
                                    {selectedItem.images.map((image, imageIdx) => (
                                      <div key={imageIdx} className="w-full overflow-hidden rounded-[4px] border border-[#475569]/10 bg-white shadow-sm">
                                        <img src={image.src} alt={`${selectedItem.title} ${imageIdx + 1}`} className="w-full h-auto object-contain block" referrerPolicy="no-referrer" />
                                      </div>
                                    ))}
                                  </div>
                                )}

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

      {/* Portfolio Manager Modal overlay */}
      <AnimatePresence>
        {isManagerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-text"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full max-w-4xl h-[85vh] bg-[#0c0c14] border border-white/10 rounded-2xl flex flex-col overflow-hidden text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#10101a] flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <Edit className="w-4 h-4 text-blue-400 animate-pulse" />
                  <div className="text-left">
                    <h3 className="text-xs md:text-sm font-sans tracking-widest text-white uppercase font-bold">
                      作品集管理系统 // PORTFOLIO ARCHIVE WORKSTATION
                    </h3>
                    <p className="text-[10px] text-white/40 font-mono tracking-wider mt-0.5">
                      CUSTOMIZE TITLES, INTROS, DESCRIPTIONS, IMAGES & DETAILED BLUEPRINTS
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsManagerOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category selector tabs */}
              <div className="bg-[#12121c]/90 px-6 py-3 border-b border-white/5 flex gap-2 flex-shrink-0">
                {parchments.map((p) => {
                  const isActive = managerActiveTab === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setManagerActiveTab(p.id);
                        // Sync category text fields
                        setEditCatTitle(p.title);
                        setEditCatSubtitle(p.subtitle);
                        setEditCatLetter(p.letterIntro);
                        setEditCatSignature(p.signature);
                        
                        setEditingItemIdx(null);
                        setIsAddingNew(false);
                      }}
                      className={`py-2 px-4 rounded-lg text-xs font-bold font-sans tracking-wider transition-all duration-300 relative border cursor-pointer ${
                        isActive
                          ? 'border-blue-500/40 bg-blue-500/10 text-white'
                          : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]'
                      }`}
                    >
                      {p.title}
                    </button>
                  );
                })}
              </div>

              {/* Main Panel split layout: Left is list / category edit, Right is item edit form */}
              <div className="flex-1 flex overflow-hidden min-h-0 bg-[#08080f]">
                {/* Left side: Category parameters and Item List */}
                <div className="w-1/2 border-r border-white/5 p-6 overflow-y-auto space-y-6">
                  {/* Category settings form */}
                  <div className="space-y-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl text-left">
                    <h4 className="text-xs font-mono tracking-wider text-blue-400 uppercase font-bold flex items-center gap-1.5">
                      <span>[01]</span> 编辑分类头信息
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">分类标题 (Title)</label>
                        <input
                          type="text"
                          value={editCatTitle}
                          onChange={(e) => {
                            setEditCatTitle(e.target.value);
                            const updated = parchments.map(p => p.id === managerActiveTab ? { ...p, title: e.target.value } : p);
                            saveParchments(updated);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">分类副标题 (Subtitle)</label>
                        <input
                          type="text"
                          value={editCatSubtitle}
                          onChange={(e) => {
                            setEditCatSubtitle(e.target.value);
                            const updated = parchments.map(p => p.id === managerActiveTab ? { ...p, subtitle: e.target.value } : p);
                            saveParchments(updated);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-mono text-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">自白信导言 (Intro Letter)</label>
                        <textarea
                          rows={3}
                          value={editCatLetter}
                          onChange={(e) => {
                            setEditCatLetter(e.target.value);
                            const updated = parchments.map(p => p.id === managerActiveTab ? { ...p, letterIntro: e.target.value } : p);
                            saveParchments(updated);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-sans leading-relaxed resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-1">签名 (Signature)</label>
                        <input
                          type="text"
                          value={editCatSignature}
                          onChange={(e) => {
                            setEditCatSignature(e.target.value);
                            const updated = parchments.map(p => p.id === managerActiveTab ? { ...p, signature: e.target.value } : p);
                            saveParchments(updated);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-serif italic text-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono tracking-wider text-blue-400 uppercase font-bold flex items-center gap-1.5">
                        <span>[02]</span> 作品列表
                      </h4>
                      <button
                        onClick={() => {
                          setIsAddingNew(true);
                          setEditingItemIdx(null);
                          // Reset edit form states to empty/defaults
                          setEditTitle('新作品 PROJECT TITLE');
                          setEditDesc('这是一部关于几何与光的探索之作。');
                          setEditSpec('SECTOR // NEW  •  SPEC // DYNAMIC');
                          setEditImg('');
                          setEditThumbnailImg('');
                          setEditDetailHeroImg('');
                          setEditImages([]);
                          setEditLocation('Lumen Sectors');
                          setEditYear('LC 2046');
                          setEditMaterials('Light Matter, Crystal Glass');
                          setEditDimensions('Variable scale');
                          setEditParagraphs(['在这里写下对项目的详细设计理念。第一段。', '这是第二段。']);
                          setEditSpecs([
                            { label: 'TECHNICAL STABILITY', value: 'Quantum Stabilized' },
                            { label: 'ENERGY FLOW', value: 'Photonic Array' }
                          ]);
                        }}
                        className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-mono font-bold tracking-wider rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增作品</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-left">
                      {parchments.find(p => p.id === managerActiveTab)?.items.map((item, itemIdx) => {
                        const isCurrentlyEditingThis = editingItemIdx === itemIdx;
                        return (
                          <div
                            key={itemIdx}
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingItemIdx(itemIdx);
                              // Sync edit form states
                              setEditTitle(item.title);
                              setEditDesc(item.desc);
                              setEditSpec(item.spec);
                              setEditImg(item.img);
                              setEditThumbnailImg(item.thumbnailImg || item.img);
                              setEditDetailHeroImg(item.detailHeroImg || item.images?.[0]?.src || item.img);
                              setEditImages(item.images || (item.img ? [{ src: item.img }] : []));
                              
                              const details = getProjectDetails(item);
                              setEditLocation(details.location);
                              setEditYear(details.year);
                              setEditMaterials(details.materials);
                              setEditDimensions(details.dimensions);
                              setEditParagraphs(details.paragraphs);
                              setEditSpecs(details.specs);
                            }}
                            className={`p-3 border rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                              isCurrentlyEditingThis 
                                ? 'border-blue-500 bg-blue-500/5' 
                                : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <div className="w-14 h-24 rounded border border-white/10 overflow-hidden bg-black flex-shrink-0">
                                <img src={item.images?.[0]?.src || item.img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-bold text-white truncate max-w-[150px]">{item.title}</h5>
                                <p className="text-[9px] font-mono text-white/40 tracking-wider truncate max-w-[180px] mt-0.5">{item.spec}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  // Trigger select
                                  setIsAddingNew(false);
                                  setEditingItemIdx(itemIdx);
                                  setEditTitle(item.title);
                                  setEditDesc(item.desc);
                                  setEditSpec(item.spec);
                                  setEditImg(item.img);
                                  setEditThumbnailImg(item.thumbnailImg || item.img);
                                  setEditDetailHeroImg(item.detailHeroImg || item.images?.[0]?.src || item.img);
                                  setEditImages(item.images || (item.img ? [{ src: item.img }] : []));
                                  const details = getProjectDetails(item);
                                  setEditLocation(details.location);
                                  setEditYear(details.year);
                                  setEditMaterials(details.materials);
                                  setEditDimensions(details.dimensions);
                                  setEditParagraphs(details.paragraphs);
                                  setEditSpecs(details.specs);
                                }}
                                className="p-1 hover:bg-blue-500/20 text-blue-400 hover:text-white rounded transition-colors"
                                title="编辑作品"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  // Delete item
                                  const activeCat = parchments.find(p => p.id === managerActiveTab);
                                  if (activeCat) {
                                    const updatedItems = activeCat.items.filter((_, idx) => idx !== itemIdx);
                                    const updated = parchments.map(p => p.id === managerActiveTab ? { ...p, items: updatedItems } : p);
                                    saveParchments(updated);
                                    setEditingItemIdx(null);
                                    setSelectedItem(null);
                                  }
                                }}
                                className="p-1 hover:bg-rose-500/20 text-rose-400 hover:text-white rounded transition-colors"
                                title="删除作品"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side: Detailed edit form for the selected project */}
                <div className="w-1/2 p-6 overflow-y-auto space-y-5 bg-[#0a0a12]/50">
                  {(editingItemIdx !== null || isAddingNew) ? (
                    <div className="space-y-4 text-left">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h4 className="text-xs font-mono tracking-wider text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                          <span>[FORM]</span> {isAddingNew ? '添加新作品详情' : '编辑作品详情'}
                        </h4>
                        <span className="text-[10px] font-mono text-white/30">{isAddingNew ? 'NEW_ITEM' : `ITEM_#${editingItemIdx! + 1}`}</span>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">作品名称 (Title)</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-bold font-serif"
                        />
                      </div>

                      {/* Brief description */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">简短描述 (Brief Description)</label>
                        <textarea
                          rows={2}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-sans resize-none"
                        />
                      </div>

                      {/* Spec summary label */}
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">卡片底部精简规格 (Card Spec Label)</label>
                        <input
                          type="text"
                          value={editSpec}
                          onChange={(e) => setEditSpec(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-mono text-[10px]"
                        />
                      </div>

                      {/* Image uploader / URL */}
                      <div className="space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">二级页面缩略图 (Thumbnail)</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={editThumbnailImg}
                            onChange={(e) => setEditThumbnailImg(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                          />
                          <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer inline-flex items-center gap-1.5 flex-shrink-0">
                            <Upload className="w-3.5 h-3.5 text-blue-400" />
                            <span>上传</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const src = await fileToCompressedDataUrl(file);
                                  if (src) setEditThumbnailImg(src);
                                }
                                e.currentTarget.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">三级页面主图 (Detail Hero)</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={editDetailHeroImg}
                            onChange={(e) => setEditDetailHeroImg(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                          />
                          <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer inline-flex items-center gap-1.5 flex-shrink-0">
                            <Upload className="w-3.5 h-3.5 text-blue-400" />
                            <span>上传</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const src = await fileToCompressedDataUrl(file);
                                  if (src) setEditDetailHeroImg(src);
                                }
                                e.currentTarget.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">其他上传图片 (Project Images)</label>
                        <div className="space-y-2">
                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {editImages.map((image, imageIdx) => (
                              <div key={`${image.src.slice(0, 24)}-${imageIdx}`} className="space-y-2 rounded-lg border border-white/5 bg-black/20 p-2">
                                <input
                                  type="text"
                                  value={image.src}
                                  onChange={(e) => {
                                    const next = [...editImages];
                                    next[imageIdx].src = e.target.value;
                                    setEditImages(next);
                                  }}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/10 focus:outline-none focus:border-blue-400/50 font-mono"
                                />
                                <button
                                  onClick={() => setEditImages(editImages.filter((_, idx) => idx !== imageIdx))}
                                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-[10px] font-mono text-rose-300 w-fit"
                                >
                                  删除
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <label className="inline-flex px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer pointer-on items-center gap-1.5 w-fit flex-shrink-0">
                              <Upload className="w-3.5 h-3.5 text-blue-400" />
                              <span>上传图片</span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  const nextImages = await Promise.all(
                                    files.map(async (file) => {
                                      const src = await fileToCompressedDataUrl(file);
                                      return src ? { src, name: file.name } : null;
                                    })
                                  );
                                  const validImages = nextImages.filter((img): img is { src: string; name: string } => Boolean(img));
                                  if (validImages.length) {
                                    setEditImages(prev => [...prev, ...validImages]);
                                  }
                                  e.currentTarget.value = '';
                                }}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={() => setEditImages(prev => [...prev, { src: '', name: '' }])}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-sans text-white/80 hover:text-white cursor-pointer"
                            >
                              自定义一张
                            </button>
                          </div>
                        </div>
                        {editImages.length > 0 && (
                          <div className="h-16 w-full bg-black/30 border border-white/5 rounded-lg overflow-hidden flex items-center justify-between px-3 py-1.5">
                            <div className="flex items-center space-x-2.5 h-full">
                              <div className="w-20 h-full rounded border border-white/10 overflow-hidden bg-black flex-shrink-0">
                                <img src={editImages[0].src} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="text-[10px] font-mono text-white/40">{editImages.length} IMAGES READY</span>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">OK</span>
                          </div>
                        )}
                      </div>

                      {/* Editorial Project Metadata details */}
                      <div className="border-t border-white/5 pt-3 space-y-3">
                        <span className="block text-[10px] font-mono text-blue-400 uppercase tracking-widest font-semibold">// 详细蓝图元数据 / DETAILED METADATA</span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] font-mono text-white/40 uppercase tracking-wider mb-1">项目地点 (Location)</label>
                            <input
                              type="text"
                              value={editLocation}
                              onChange={(e) => setEditLocation(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono text-white/40 uppercase tracking-wider mb-1">设计时间 (Timeline)</label>
                            <input
                              type="text"
                              value={editYear}
                              onChange={(e) => setEditYear(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono text-white/40 uppercase tracking-wider mb-1">设计规格尺寸 (Dimensions)</label>
                            <input
                              type="text"
                              value={editDimensions}
                              onChange={(e) => setEditDimensions(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono text-white/40 uppercase tracking-wider mb-1">主选材质 (Primary Material)</label>
                            <input
                              type="text"
                              value={editMaterials}
                              onChange={(e) => setEditMaterials(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detailed narrative paragraphs */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest flex justify-between">
                          <span>设计哲学长文段落 (Narrative Paragraphs)</span>
                          <span className="text-[8px] opacity-60 font-mono font-normal">每一行一个段落</span>
                        </label>
                        <textarea
                          rows={4}
                          value={editParagraphs.join('\n')}
                          onChange={(e) => setEditParagraphs(e.target.value.split('\n'))}
                          placeholder="第一段 design philosophy...&#10;第二段 technology analysis..."
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-400/50 font-sans leading-relaxed resize-y"
                        />
                      </div>

                      {/* Technical specifications specs key-values */}
                      <div className="space-y-2">
                        <label className="block text-[9px] font-mono text-white/40 uppercase tracking-widest">高级技术规格清单 (Technical Specs)</label>
                        <div className="space-y-2">
                          {editSpecs.map((spec, specIdx) => (
                            <div key={specIdx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={spec.label}
                                onChange={(e) => {
                                  const updated = [...editSpecs];
                                  updated[specIdx].label = e.target.value;
                                  setEditSpecs(updated);
                                }}
                                placeholder="指标 (e.g. CAPACITY)"
                                className="w-1/2 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono uppercase"
                              />
                              <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => {
                                  const updated = [...editSpecs];
                                  updated[specIdx].value = e.target.value;
                                  setEditSpecs(updated);
                                }}
                                placeholder="参数 (e.g. 120 Visitors)"
                                className="w-1/2 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white font-mono"
                              />
                              <button
                                onClick={() => setEditSpecs(editSpecs.filter((_, idx) => idx !== specIdx))}
                                className="text-rose-400 hover:text-white p-1 hover:bg-white/5 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => setEditSpecs([...editSpecs, { label: 'NEW SPEC', value: 'Value' }])}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-[9px] font-mono rounded flex items-center gap-1 cursor-pointer w-fit"
                          >
                            <Plus className="w-3 h-3" />
                            <span>添加指标条目</span>
                          </button>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            // Cancel edit
                            setEditingItemIdx(null);
                            setIsAddingNew(false);
                          }}
                          className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold rounded-lg transition-all"
                        >
                          取消
                        </button>
                        <button
                          onClick={() => {
                            // Apply save
                            const activeCat = parchments.find(p => p.id === managerActiveTab);
                            if (activeCat) {
                              const finalImages = editImages.length > 0 ? editImages : (editImg ? [{ src: editImg }] : []);
                              const newItem: PortfolioItem = {
                                title: editTitle,
                                desc: editDesc,
                                spec: editSpec,
                                img: editImg || editThumbnailImg || editDetailHeroImg || finalImages[0]?.src || '',
                                thumbnailImg: editThumbnailImg || editImg || finalImages[0]?.src || '',
                                detailHeroImg: editDetailHeroImg || editImg || finalImages[0]?.src || '',
                                images: finalImages,
                                location: editLocation,
                                year: editYear,
                                materials: editMaterials,
                                dimensions: editDimensions,
                                paragraphs: editParagraphs.filter(p => p.trim() !== ''),
                                specs: editSpecs.filter(s => s.label.trim() !== '')
                              };

                              let updatedItems = [...activeCat.items];
                              if (isAddingNew) {
                                updatedItems.push(newItem);
                              } else if (editingItemIdx !== null) {
                                updatedItems[editingItemIdx] = newItem;
                              }

                              const updated = parchments.map(p => p.id === managerActiveTab ? { ...p, items: updatedItems } : p);
                              saveParchments(updated);

                              const savedItem = updatedItems[isAddingNew ? updatedItems.length - 1 : (editingItemIdx ?? 0)];
                              if (savedItem) {
                                setSelectedItem(savedItem);
                              }
                              
                              // Reset state
                              setEditingItemIdx(null);
                              setIsAddingNew(false);
                            }
                          }}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>保存该作品项</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none p-6">
                      <ImageIcon className="w-10 h-10 text-white/50 mb-3 animate-pulse" />
                      <p className="text-xs font-sans">选择左侧作品或点击「新增作品」以展开表单配置</p>
                      <p className="text-[10px] font-mono tracking-widest text-white/30 uppercase mt-1">NO PROJECT ACTIVE</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/5 bg-[#10101a] flex justify-end flex-shrink-0">
                <button
                  onClick={() => setIsManagerOpen(false)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.25)]"
                >
                  完成退出
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
