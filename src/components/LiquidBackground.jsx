import React from 'react';

export default function LiquidBackground({ palette }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#090b10] transition-colors duration-1000">
      {/* Base subtle pastel mesh gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out opacity-80"
        style={{
          background: `
            radial-gradient(at 15% 20%, ${palette.primary} 0px, transparent 60%),
            radial-gradient(at 85% 25%, ${palette.secondary} 0px, transparent 55%),
            radial-gradient(at 50% 80%, ${palette.tertiary} 0px, transparent 65%),
            radial-gradient(at 10% 90%, ${palette.primary} 0px, transparent 50%)
          `,
        }}
      />

      {/* Blob 1 - Organic liquid shape 1 */}
      <div
        className="absolute -top-24 -left-20 w-[520px] h-[520px] rounded-[45%_55%_65%_35%/50%_60%_40%_50%] opacity-45 mix-blend-screen filter blur-[100px] animate-blob-1 transition-colors duration-1000"
        style={{
          backgroundColor: palette.primary,
        }}
      />

      {/* Blob 2 - Organic liquid shape 2 */}
      <div
        className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-[55%_45%_40%_60%/45%_50%_55%_50%] opacity-40 mix-blend-screen filter blur-[120px] animate-blob-2 transition-colors duration-1000"
        style={{
          backgroundColor: palette.secondary,
        }}
      />

      {/* Blob 3 - Organic liquid shape 3 */}
      <div
        className="absolute -bottom-32 left-1/4 w-[650px] h-[550px] rounded-[60%_40%_50%_50%/50%_40%_60%_50%] opacity-35 mix-blend-screen filter blur-[110px] animate-blob-3 transition-colors duration-1000"
        style={{
          backgroundColor: palette.tertiary,
        }}
      />

      {/* Frosted Glass Depth Vignette & Noise Sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
}
