// frontend/src/pages/Feed.jsx                                                   // global feed + composer

import { useEffect, useState } from "react";                                     // React hooks
import Card from "/src/components/ui/Card.jsx";                                  // UI card
import Button from "/src/components/ui/Button.jsx";                              // UI button
import { postsList, postCreate } from "/src/lib/api.js";                         // API helpers

export default function Feed() {                                                 // default export component
  const [posts, setPosts] = useState([]);                                        // feed items
  const [text, setText] = useState("");                                          // composer text
  const [msg, setMsg] = useState("Loading…");                                    // status line
  const [busy, setBusy] = useState(false);                                       // create in progress

  useEffect(() => {                                                               // load on mount
    postsList(20)                                                                 // fetch recent 20
      .then(setPosts)                                                             // hydrate list
      .catch(() => setMsg("Failed to load posts"))                                // error message
      .finally(() => setMsg(""));                                                 // clear status
  }, []);                                                                         // once

  async function onPost(e) {                                                      // submit handler
    e.preventDefault();                                                           // stop page reload
    if (!text.trim()) return;                                                     // ignore empty posts
    setBusy(true);                                                                // lock composer
    try {                                                                         // try create
      const created = await postCreate({ text: text.trim() });                    // POST new item
      setPosts((p) => [created, ...p]);                                           // prepend to feed
      setText("");                                                                // clear composer
    } catch {                                                                      // failure
      setMsg("Failed to post");                                                   // show error
    } finally {                                                                    // always
      setBusy(false);                                                             // unlock composer
    }
  }

  return (                                                                        // render
    <div className="max-w-xl mx-auto mt-6 space-y-4">                             {/* centered column */}
      <Card>                                                                      {/* composer card */}
        <form onSubmit={onPost} className="space-y-3">                            {/* form wrapper */}
          <textarea                                                                // post text input
            className="w-full rounded-2xl px-4 py-2 bg-surface text-text border border-brand-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none min-h-24"
            value={text}                                                           // controlled value
            onChange={(e) => setText(e.target.value)}                              // update text
            placeholder="Share something (text or a media link in the next rev)"   // hint
          />
          <div className="flex justify-end">                                       {/* actions row */}
            <Button type="submit" variant="primary">                               {/* submit */}
              {busy ? "Posting…" : "Post"}                                         {/* dynamic label */}
            </Button>
          </div>
        </form>
        {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}                  {/* status */}
      </Card>

      {posts.map((p) => (                                                          // render feed items
        <Card key={p.id}>                                                          {/* post card */}
          <div className="text-sm text-muted mb-1">                                {/* author line */}
            @{p.author.username} · {new Date(p.created_at).toLocaleString()}       {/* name + time */}
          </div>
          <div className="whitespace-pre-wrap">{p.text}</div>                      {/* post text */}
          {p.media_url && (                                                         // optional media URL
            <a className="text-sm underline" href={p.media_url} target="_blank" rel="noreferrer">
              {p.media_url}
            </a>
          )}
        </Card>
      ))}
    </div>
  );
}
