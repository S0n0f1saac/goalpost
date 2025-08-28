// frontend/tailwind.config.js                                                   // Tailwind config mapping tokens → utilities

/** @type {import('tailwindcss').Config} */                                      // type hint for editors and tooling
module.exports = {                                                               // export a single Tailwind configuration object
  darkMode: ["class", '[data-theme="dark"]'],                                    // enable dark mode using .dark or [data-theme="dark"]
  content: [                                                                     // globs Tailwind scans for class usage
    "./index.html",                                                              // Vite/React HTML entry
    "./src/**/*.{js,jsx,ts,tsx}",                                                // all React source files
  ],
  theme: {                                                                       // theme customization root
    container: {                                                                 // configure Tailwind's .container utility
      center: true,                                                              // center the container by default
      padding: "1rem",                                                           // default horizontal padding for small screens
      screens: {                                                                 // explicit container max-widths per breakpoint
        sm: "640px",                                                             // small screens container width
        md: "768px",                                                             // medium screens container width
        lg: "1024px",                                                            // large screens container width
        xl: "1200px",                                                            // xl chosen to align with ~feed/profile max width
        "2xl": "1320px",                                                         // optional wider layouts if needed later
      },
    },
    screens: {                                                                   // breakpoints for responsive rules
      sm: "640px",                                                               // phones → small tablets
      md: "768px",                                                               // tablets
      lg: "1024px",                                                              // small laptop
      xl: "1280px",                                                              // desktop
      "2xl": "1536px",                                                           // large desktop
    },
    extend: {                                                                    // extend default Tailwind theme instead of replacing
      fontFamily: {                                                              // typography mapping for Tailwind font utilities
        sans: ['var(--font-sans)'],                                              // make 'font-sans' resolve to our CSS token (Inter)
      },
      colors: {                                                                  // semantic color aliases backed by CSS variables
        bg: "var(--bg)",                                                         // page background
        surface: "var(--surface)",                                               // cards / inputs
        "surface-2": "var(--surface-2)",                                         // raised surfaces (menus/modals)
        text: "var(--text)",                                                     // primary text
        muted: "var(--muted)",                                                   // secondary text
        border: "var(--border)",                                                 // borders and hairlines
        accent: "var(--accent)",                                                 // brand/interactive
        "on-accent": "var(--on-accent)",                                         // text on accent backgrounds
        /* compatibility aliases used in current components                     */
        brand: {                                                                 // brand scale mapped to accent for current usage
          100: "var(--accent)",                                                  // light-ish usage
          500: "var(--accent)",                                                  // main usage (rings/borders/buttons)
        },
        success: "var(--success)",                                               // status: success
        "on-success": "var(--on-success)",                                       // text on success
        warning: "var(--warning)",                                               // status: warning
        "on-warning": "var(--on-warning)",                                       // text on warning
        danger: "var(--danger)",                                                 // status: danger
        "on-danger": "var(--on-danger)",                                         // text on danger
      },
      borderColor: {                                                             // ensure border utilities use semantic token by default
        DEFAULT: "var(--border)",                                                // default border color for 'border' classes
        border: "var(--border)",                                                 // explicit alias for readability
      },
      boxShadow: {                                                               // semantic shadow scale mapped to tokens
        0: "var(--shadow-0)",                                                    // no shadow
        1: "var(--shadow-1)",                                                    // subtle raise (inputs)
        2: "var(--shadow-2)",                                                    // card shadow
        3: "var(--shadow-3)",                                                    // modal/popover shadow
      },
      borderRadius: {                                                            // radius tokens from design system
        sm: "var(--radius-sm)",                                                  // small radius
        md: "var(--radius-md)",                                                  // medium radius
        lg: "var(--radius-lg)",                                                  // large radius
        xl: "var(--radius-xl)",                                                  // extra large radius
        pill: "var(--radius-pill)",                                              // full pill radius
      },
      transitionDuration: {                                                      // motion tokens for consistent timings
        fast: "var(--duration-fast)",                                            // hover transitions
        med: "var(--duration-med)",                                              // toggles / small interactions
        slow: "var(--duration-slow)",                                            // dialogs / sheets
      },
      outlineColor: {                                                            // outline color mapping for focus states
        DEFAULT: "var(--focus)",                                                 // default outline color = focus token
      },
      ringColor: {                                                               // ring color used by focus styles (if you use ring utilities)
        DEFAULT: "var(--focus)",                                                 // default ring color = focus token
      },
    },
  },
  plugins: [                                                                     // optional official plugins (kept lean)
    // require("@tailwindcss/forms"),                                            // uncomment if you want normalized form styles
    // require("@tailwindcss/typography"),                                       // uncomment for prose styling
  ],
};




