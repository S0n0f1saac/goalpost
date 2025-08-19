// frontend/src/components/ui/Input.jsx                               // reusable input + label + error
export default function Input({                                       // export a single component
  label,                                                               // text shown above the input
  type = "text",                                                       // input type (text/password/email...)
  value,                                                               // controlled value from parent state
  onChange,                                                            // change handler from parent
  placeholder = "",                                                    // placeholder text
  error = "",                                                          // optional error message to display
  helper = "",                                                         // optional helper text (below input)
  name,                                                                // optional name attribute
  autoComplete = "off",                                                // browser autocomplete behavior
}) {
  return (                                                             // return JSX tree
    <div className="mb-3">                                            {/* field wrapper with spacing */}
      {label && (                                                      /* render label only if provided */
        <label className="block mb-1 text-sm text-muted">             {/* small muted label */}
          {label}                                                      {/* label text */}
        </label>
      )}
      <input
        className={                                                     // Tailwind classes for the input
          [
            "w-full",                                                   // full width
            "rounded-2xl",                                              // pill-ish corners
            "px-4 py-2",                                                // comfy padding
            "bg-surface text-text",                                     // use theme tokens
            "border",                                                   // 1px border
            error ? "border-danger" : "border-brand-100",               // red on error, light brand otherwise
            "outline-none",                                             // remove default outline
            "focus:ring-2 focus:ring-brand-500 focus:border-brand-500"  // focus ring + border in brand color
          ].join(" ")                                                   // join into a single string
        }
        type={type}                                                     // native input type
        value={value}                                                   // controlled value
        onChange={onChange}                                             // propagate changes up
        placeholder={placeholder}                                       // show hint text
        name={name}                                                     // name attribute (forms)
        autoComplete={autoComplete}                                     // browser autocomplete
      />
      {(helper || error) && (                                           /* if helper or error exists, show row */
        <div className="mt-1 text-xs">                                  {/* small text below input */}
          {error ? (                                                    // prefer error if present
            <span className="text-danger">{error}</span>                // red error text
          ) : (
            <span className="text-muted">{helper}</span>                // muted helper text
          )}
        </div>
      )}
    </div>
  );
}
