// frontend/src/components/BottomNav.jsx                           // sticky mobile bottom nav
import { NavLink } from "react-router-dom";                        // router link with active state

export default function BottomNav() {                              // default export component
  return (                                                         // render bar
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden"          // stick to bottom; hide on md+
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}     // iOS safe area
    >
      {/* inner grid with 4 equal tabs */}
      <div className="grid grid-cols-4 bg-surface border-t border-brand-100">
        {/* tab: Feed */}
        <Tab to="/feed" label="Feed" />
        {/* tab: Matches */}
        <Tab to="/matches" label="Matches" />
        {/* tab: Teams */}
        <Tab to="/teams" label="Teams" />
        {/* tab: Profile */}
        <Tab to="/profile" label="Profile" />
      </div>
    </nav>
  );
}

function Tab({ to, label }) {                                      // small tab helper
  return (
    <NavLink
      to={to}                                                       // destination
      className={({ isActive }) =>                                  // compute classes
        [
          "flex flex-col items-center justify-center py-2 text-xs", // layout
          "focus:outline-none focus:ring-2 focus:ring-brand-500",   // a11y focus
          isActive ? "text-blue-600" : "text-muted",                // active vs inactive
        ].join(" ")
      }
    >
      {/* simple text label (icons later) */}
      <span>{label}</span>
    </NavLink>
  );
}

