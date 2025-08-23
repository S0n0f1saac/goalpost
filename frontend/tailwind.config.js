// frontend/tailwind.config.js                                                   // Tailwind config mapping tokens → utilities

/** @type {import('tailwindcss').Config} */                                      // type hint for editors
module.exports = {                                                               // export config object
  content: [                                                                     // files to scan for class names
    "./index.html",                                                              // HTML entry
    "./src/**/*.{js,jsx,ts,tsx}",                                                // all source files
  ],
  theme: {                                                                       // theme customization
    extend: {                                                                    // extend default theme rather than replace
      colors: {                                                                  // semantic color aliases backed by CSS vars
        bg: "var(--bg)",                                                         // page background
        surface: "var(--surface)",                                               // cards / inputs
        "surface-2": "var(--surface-2)",                                         // raised surfaces
        text: "var(--text)",                                                     // primary text
        muted: "var(--muted)",                                                   // secondary text
        border: "var(--border)",                                                 // borders and hairlines
        accent: "var(--accent)",                                                 // brand/interactive
        "on-accent": "var(--on-accent)",                                         // text on accent
        /* compatibility aliases used in current components                     */
        brand: {                                                                 // simple brand scale mapped to accent
          100: "var(--accent)",                                                  // light-ish usage
          500: "var(--accent)",                                                  // main usage (rings/borders)
        },
        success: "var(--success)",                                               // status colors
        "on-success": "var(--on-success)",                                       // text on success
        warning: "var(--warning)",                                               // status colors
        "on-warning": "var(--on-warning)",                                       // text on warning
        danger: "var(--danger)",                                                 // status colors
        "on-danger": "var(--on-danger)",                                         // text on danger
      },
      borderColor: {                                                             // ensure border utilities see semantic var
        DEFAULT: "var(--border)",                                                // default border color
        border: "var(--border)",                                                 // explicit alias
      },
      boxShadow: {                                                               // semantic shadow scale
        0: "var(--shadow-0)",                                                    // none
        1: "var(--shadow-1)",                                                    // subtle
        2: "var(--shadow-2)",                                                    // card
        3: "var(--shadow-3)",                                                    // modal
      },
      borderRadius: {                                                            // radius tokens
        sm: "var(--radius-sm)",                                                  // small
        md: "var(--radius-md)",                                                  // medium
        lg: "var(--radius-lg)",                                                  // large
        xl: "var(--radius-xl)",                                                  // x-large
        pill: "var(--radius-pill)",                                              // pill
      },
      transitionDuration: {                                                      // motion durations
        fast: "var(--duration-fast)",                                            // fast
        med: "var(--duration-med)",                                              // medium
        slow: "var(--duration-slow)",                                            // slow
      },
    },
  },
  plugins: [],                                                                    // keep lean; add forms/typography later if needed
};



