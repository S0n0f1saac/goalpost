// frontend/src/components/ui/Card.jsx                               // simple card surface wrapper
export default function Card({ children, className = "" }) {         // accept children + extra classes
  return (                                                           // return a styled container
    <div
      className={[
        "bg-surface",                                               // themed surface color
        "rounded-2xl",                                              // soft corners
        "shadow-card",                                              // subtle elevation
        "p-6",                                                      // internal padding
        className,                                                  // allow caller to extend styles
      ].join(" ")}                                                  // join classes
    >
      {children}                                                    {/* render content inside */}
    </div>
  );
}
