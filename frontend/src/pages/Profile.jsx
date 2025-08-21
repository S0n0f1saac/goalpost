// frontend/src/pages/Profile.jsx                                                     // Profile page (view/edit my profile)

import { useEffect, useState } from "react";                                         // React hooks for state + lifecycle
import Card from "/src/components/ui/Card.jsx";                                      // UI: card container
import Input from "/src/components/ui/Input.jsx";                                    // UI: labeled input
import Button from "/src/components/ui/Button.jsx";                                  // UI: button variants
import { profileGet, profileUpdate } from "/src/lib/api.js";                         // API helpers for profile endpoints

export default function Profile() {                                                  // export the page component
  const [role, setRole] = useState("player");                                        // profile.role state
  const [displayName, setDisplayName] = useState("");                                // profile.display_name state
  const [bio, setBio] = useState("");                                                // profile.bio state
  const [msg, setMsg] = useState("Loading…");                                        // status message state
  const [saving, setSaving] = useState(false);                                       // saving flag state

  useEffect(() => {                                                                   // load on mount
    profileGet()                                                                      // GET /api/profile/me/
      .then((p) => {                                                                  // success handler
        setRole(p.role || "player");                                                  // hydrate role (default player)
        setDisplayName(p.display_name || "");                                         // hydrate display_name
        setBio(p.bio || "");                                                          // hydrate bio
        setMsg("");                                                                   // clear loading message
      })
      .catch(() => setMsg("Failed to load profile"));                                 // error handler
  }, []);                                                                             // run once

  async function onSave(e) {                                                          // save handler
    e.preventDefault();                                                               // stop page reload
    setSaving(true);                                                                  // mark saving
    setMsg("Saving…");                                                                // show progress
    try {                                                                             // attempt update
      await profileUpdate({ role, display_name: displayName, bio });                  // PUT /api/profile/me/
      setMsg("Saved");                                                                // success message
    } catch {                                                                          // handle failure
      setMsg("Failed to save");                                                       // error message
    } finally {                                                                        // always run
      setSaving(false);                                                               // clear saving
    }
  }

  return (                                                                            // render tree
    <>
      {/* centered card container */}
      <Card className="max-w-xl mx-auto mt-10 space-y-4">
        {/* page title */}
        <h1 className="text-xl font-semibold">My Profile</h1>

        {/* form wrapper with vertical gaps */}
        <form onSubmit={onSave} className="space-y-3">
          {/* role field block */}
          <div>
            {/* role label */}
            <label className="block mb-1 text-sm text-muted">Role</label>
            {/* native select for role */}
            <select
              className="w-full rounded-2xl px-4 py-2 bg-surface text-text border border-brand-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {/* options */}
              <option value="player">Player</option>
              <option value="coach">Coach</option>
              <option value="fan">Fan</option>
            </select>
          </div>

          {/* display name input */}
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your public name"
          />

          {/* bio field block */}
          <div>
            {/* bio label */}
            <label className="block mb-1 text-sm text-muted">Bio</label>
            {/* multi-line textarea */}
            <textarea
              className="w-full rounded-2xl px-4 py-2 bg-surface text-text border border-brand-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none min-h-28"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Say something about yourself"
            />
          </div>

          {/* actions row */}
          <div className="pt-2">
            {/* submit button with dynamic label */}
            <Button type="submit" variant="primary">
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>

        {/* status line under form */}
        <p className="text-sm text-muted">{msg}</p>
      </Card>
    </>
  );
}

