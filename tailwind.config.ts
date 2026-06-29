import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // paleta sofisticada nude / dourado
        champagne: "#f7f1ea",   // fundo quente claro
        linen: "#efe6db",       // cards / seções alternadas
        cacau: "#3a2e26",       // texto principal (marrom profundo, não preto)
        taupe: "#8a7a6c",       // texto secundário
        ouro: "#b8915a",        // acento dourado
        "ouro-rose": "#c9a07a", // dourado rosé suave
        linha: "#e3d6c7",       // bordas hairline
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.2,0.7,0.2,1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
