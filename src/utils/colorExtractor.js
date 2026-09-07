import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

// Helper to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Convert HSL to rgb string
function hslToRgbStr(h, s, l) {
  h = (h % 360 + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const red = Math.round((r + m) * 255);
  const green = Math.round((g + m) * 255);
  const blue = Math.round((b + m) * 255);

  return `rgb(${red}, ${green}, ${blue})`;
}

export async function extractPastelPalette(imageUrl) {
  const defaultPalette = {
    primary: 'rgb(88, 80, 141)',     // Soft dusty violet
    secondary: 'rgb(120, 105, 168)', // Pastel lavender
    tertiary: 'rgb(62, 85, 120)',    // Calming slate dusk
    glow: 'rgba(120, 105, 168, 0.45)',
    rawHex: '#58508d',
  };

  if (!imageUrl) return defaultPalette;

  try {
    // Route through backend proxy to avoid any CORS/canvas taint issues
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const color = await fac.getColorAsync(proxyUrl, {
      algorithm: 'dominant',
      mode: 'precision',
    });

    const [r, g, b] = color.value;
    const [h, s] = rgbToHsl(r, g, b);

    // Keep saturation in soft pastel / muted range (25% - 48%) to avoid harsh neon
    const pastelSat = Math.max(22, Math.min(45, s * 0.65));
    // Keep lightness elegant for dark-glass backdrop (35% - 50%)
    const pastelLight = 42;

    const primary = hslToRgbStr(h, pastelSat, pastelLight);
    const secondary = hslToRgbStr((h + 35) % 360, pastelSat * 0.9, pastelLight + 6);
    const tertiary = hslToRgbStr((h - 35 + 360) % 360, pastelSat * 0.85, pastelLight - 4);
    const glow = `rgba(${r}, ${g}, ${b}, 0.4)`;

    return {
      primary,
      secondary,
      tertiary,
      glow,
      rawHex: color.hex,
    };
  } catch (error) {
    console.warn('Could not extract dominant color, using fallback pastel palette:', error);
    return defaultPalette;
  }
}
