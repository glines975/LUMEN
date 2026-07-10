/** Home parallax layers — stable paths when present, cinematic fallback when absent. */
const asset = (file: string) => `${import.meta.env.BASE_URL}images/home/${file}`;

const FALLBACK_BG = 'radial-gradient(circle at 50% 25%, rgba(82, 128, 255, 0.20), transparent 35%), radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.10), transparent 28%), linear-gradient(180deg, #11131a 0%, #050608 48%, #020204 100%)';
const FALLBACK_MID = 'radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 0.12), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.00))';
const FALLBACK_FG = 'radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.28), transparent 18%), radial-gradient(circle at 20% 72%, rgba(255, 255, 255, 0.18), transparent 9%), radial-gradient(circle at 80% 74%, rgba(255, 255, 255, 0.18), transparent 9%)';

export const HOME_PARALLAX = {
  backgroundMode: 'layered' as const,
  backgroundImage: asset('background.jpg'),
  depthMapImage: '',
  midgroundImage: asset('midground.png'),
  foregroundImage: asset('foreground.png'),
  fallbackBackground: FALLBACK_BG,
  fallbackMidground: FALLBACK_MID,
  fallbackForeground: FALLBACK_FG,
};
