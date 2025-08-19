// frontend/src/components/ui/Button.jsx                          // file path: reusable Button component

export default function Button({                                  // export a default React component
  children,                                                       // content inside the button (label/icon)
  type = "button",                                                // HTML button type (button/submit/reset)
  variant = "primary",                                            // visual style variant
  onClick,                                                        // click handler (optional)
}) {                                                              // start component function body
  const base =                                                    // base Tailwind classes shared by all variants
    "inline-flex items-center justify-center px-4 py-2 " +        // layout, padding
    "rounded-2xl text-sm font-medium transition-colors";          // shape, size, smooth hover

  const styles = {                                                // map of variant → class string
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow",   // solid brand-like button
    outline: "bg-transparent text-blue-700 border border-blue-600 hover:bg-blue-50", // outline look
    danger: "bg-red-600 hover:bg-red-700 text-white shadow",      // destructive action
  };                                                              // end styles map

  const cls = `${base} ${styles[variant] ?? styles.primary}`;     // pick classes for the chosen variant

  return (                                                        // return JSX to render the button
    <button                                                       // native button element
      type={type}                                                 // set button type
      onClick={onClick}                                           // attach click handler if provided
      className={cls}                                             // apply computed Tailwind classes
    >
      {children}                                                  {/* render whatever was passed inside */}
    </button>                                                     // end button element
  );                                                              // end JSX return
}                                                                  // end component
