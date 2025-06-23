/** @type {import('tailwindcss').Config} */
export default {
  // *** Asegúrate que esta ruta es correcta respecto a la raíz de tu proyecto 'client/' ***
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Esto le dice a Tailwind que escanee todos estos archivos
  ],
  theme: {
    extend: {
      colors: {
        // Asegúrate de que estos nombres coincidan EXACTAMENTE con tus variables CSS
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        ring: "hsl(var(--ring))",
        // También puedes añadir los colores de chart y sidebar si planeas usarlos directamente en clases de Tailwind
        // 'chart-1': "hsl(var(--chart-1))",
        // 'chart-2': "hsl(var(--chart-2))",
        // 'chart-3': "hsl(var(--chart-3))",
        // 'chart-4': "hsl(var(--chart-4))",
        // 'chart-5': "hsl(var(--chart-5))",
        // 'sidebar-background': "hsl(var(--sidebar-background))",
        // 'sidebar-foreground': "hsl(var(--sidebar-foreground))",
        // 'sidebar-primary': "hsl(var(--sidebar-primary))",
        // 'sidebar-primary-foreground': "hsl(var(--sidebar-primary-foreground))",
        // 'sidebar-accent': "hsl(var(--sidebar-accent))",
        // 'sidebar-accent-foreground': "hsl(var(--sidebar-accent-foreground))",
        // 'sidebar-border': "hsl(var(--sidebar-border))",
        // 'sidebar-ring': "hsl(var(--sidebar-ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // Asegúrate de que este plugin esté instalado. Si no, quítalo temporalmente o instálalo.
    // npm install tailwindcss-animate
    require("tailwindcss-animate"), 
  ],
};
