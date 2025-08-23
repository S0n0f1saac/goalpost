// frontend/src/components/ThemeToggle.jsx                                  // theme toggle button for light/dark
import { useEffect, useState } from "react";                                // React hooks
import Button from "/src/components/ui/Button.jsx";                         // existing button primitive

export default function ThemeToggle() {                                     // default export component
  const [theme, setTheme] = useState("light");                              // local state for current theme

  // Load saved theme (or system preference) on mount and apply to <html>
  useEffect(() => {                                                         // run once on mount
    const saved = localStorage.getItem("gp_theme");                         // read persisted choice
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches; // system hint
    const initial = saved || (prefersDark ? "dark" : "light");              // decide starting theme
    applyTheme(initial);                                                    // set DOM + storage
    setTheme(initial);                                                      // reflect in state
  }, []);                                                                   // no deps

  // Helper: write to <html data-theme="..."> and persist
  function applyTheme(next) {                                               // apply theme to document + storage
    document.documentElement.setAttribute("data-theme", next);              // set data-theme attr (our CSS switch)
    localStorage.setItem("gp_theme", next);                                 // persist across reloads
  }                                                                         // end applyTheme

  // Click handler: toggle between light and dark
  function onToggle() {                                                     // invert current theme
    const next = theme === "dark" ? "light" : "dark";                       // compute next value
    applyTheme(next);                                                       // apply + persist
    setTheme(next);                                                         // update state
  }                                                                         // end onToggle

  return (                                                                  // render a small outline button
    <>
      {/* toggle button; label shows the theme you will switch TO */}
      <Button variant="outline" onClick={onToggle}>                         {/* click toggles theme */}
        {theme === "dark" ? "Light mode" : "Dark mode"}                     {/* dynamic label */}
      </Button>
    </>
  );                                                                        // end render
}                                                                            // end component
