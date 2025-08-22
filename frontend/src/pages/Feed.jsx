// frontend/src/pages/Feed.jsx                                                     // feed with Global/My tabs + follow

import { useEffect, useState, useCallback } from "react";                          // React hooks
import Card from "/src/components/ui/Card.jsx";                                    // UI: card
import Button from "/src/components/ui/Button.jsx";                                // UI: button
import {                                                                           // API helpers
  postsList,                                                                        // GET global feed
  postCreate,                                                                       // POST new post
  postsMy,                                                                          // GET my feed
  followingList,                                                                    // GET who I follow
  follow,                                                                           // POST follow
  unfollow,                                                                         // DELETE unfollow
  me,                                                                               // GET current user
} from "/src/lib/api.js";                                                           // central API

export default function Feed() {                                                    // page component
  const [tab, setTab] = useState("global");                                         // 'global' | 'my'
  const [posts, setPosts] = useState([]);                                           // feed items
  const [text, setText] = useState("");                                             // composer text
  const [msg, setMsg] = useState("Loading…");                                       // status line
  const [busy, setBusy] = useState(false);                                          // create flag
  const [followingIds, setFollowingIds] = useState([]);                             // ids I follow
  const [meId, setMeId] = useState(null);                                           // my user id

  const loadFollowing = useCallback(async () => {                                   // load who I follow
    try {                                                                           // try request
      const res = await followingList();                                            // call API
      setFollowingIds(res.following_ids || []);                                     // store ids
    } catch {                                                                        // on failure
      /* silence: not critical for viewing feed */                                  // non-fatal
    }                                                                                // end catch
  }, []);                                                                            // stable fn

  const loadFeed = useCallback(async (which) => {                                   // load posts by tab
    setMsg("Loading…");                                                             // set status
    try {                                                                           // fetch flow
      const data = which === "my" ? await postsMy(20) : await postsList(20);        // choose endpoint
      setPosts(data);                                                                // put into state
      setMsg("");                                                                    // clear status
    } catch {                                                                         // on error
      setMsg("Failed to load posts");                                               // show error
    }                                                                                // end catch
  }, []);                                                                            // stable fn

  useEffect(() => {                                                                  // hydrate on mount
    me().then(u => setMeId(u.id)).catch(() => setMeId(null));                        // get my id (optional)
    loadFollowing();                                                                 // get following ids
    loadFeed("global");                                                              // start on global
  }, [loadFollowing, loadFeed]);                                                     // deps

  useEffect(() => {                                                                  // reload on tab change
    loadFeed(tab);                                                                   // load selected tab
    if (tab === "my") loadFollowing();                                               // ensure following fresh
  }, [tab, loadFeed, loadFollowing]);                                                // deps

  async function onPost(e) {                                                         // create post
    e.preventDefault();                                                              // stop reload
    const value = text.trim();                                                       // normalized text
    if (!value) return;                                                              // ignore empty
    setBusy(true);                                                                   // lock UI
    try {                                                                            // try create
      const created = await postCreate({ text: value });                             // POST
      setPosts((p) => [created, ...p]);                                              // prepend
      setText("");                                                                    // clear box
      if (tab === "global") setMsg("");                                              // clear status
    } catch {                                                                          // on error
      setMsg("Failed to post");                                                      // show error
    } finally {                                                                       // always
      setBusy(false);                                                                // unlock
    }                                                                                // end try/catch
  }                                                                                  // end onPost

  async function toggleFollow(userId, isFollowing) {                                 // follow/unfollow
    try {                                                                            // try op
      if (isFollowing) await unfollow(userId); else await follow(userId);            // call API
      await loadFollowing();                                                         // refresh ids
      if (tab === "my") await loadFeed("my");                                        // refresh my feed
    } catch {                                                                          // on error
      setMsg("Follow action failed");                                                // show error
    }                                                                                // end catch
  }                                                                                  // end toggleFollow

  function isFollowing(id) {                                                         // helper
    return followingIds.includes(id);                                                // membership test
  }                                                                                  // end isFollowing

  return (                                                                           // render UI
    <div className="max-w-xl mx-auto mt-6 space-y-4">                                {/* centered column */}

      {/* tabs row */}
      <div className="flex gap-2">                                                   {/* tab container */}
        <Button variant={tab === "global" ? "primary" : "outline"}                   // global tab button
                onClick={() => setTab("global")}>                                    {/* click handler */}
          Global                                                                     {/* label */}
        </Button>
        <Button variant={tab === "my" ? "primary" : "outline"}                       // my tab button
                onClick={() => setTab("my")}>                                        {/* click handler */}
          My Feed                                                                    {/* label */}
        </Button>
      </div>

      {/* composer */}
      <Card>                                                                         {/* composer card */}
        <form onSubmit={onPost} className="space-y-3">                               {/* form wrapper */}
          <textarea                                                                  // multi-line input
            className="w-full rounded-2xl px-4 py-2 bg-surface text-text border border-brand-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none min-h-24"
            value={text}                                                             // controlled value
            onChange={(e) => setText(e.target.value)}                                // update state
            placeholder="Share something…"                                           // hint
          />
          <div className="flex justify-end">                                         {/* actions row */}
            <Button type="submit" variant="primary">                                 {/* submit */}
              {busy ? "Posting…" : "Post"}                                           {/* dynamic label */}
            </Button>
          </div>
        </form>
        {msg && <p className="mt-2 text-sm text-muted">{msg}</p>}                    {/* status */}
      </Card>

      {/* feed items */}
      {posts.map((p) => {                                                            // iterate posts
        const mine = meId != null && p.author.id === meId;                           // am I the author?
        const iFollow = !mine && isFollowing(p.author.id);                           // follow state
        return (                                                                     // render card
          <Card key={p.id}>                                                          {/* post card */}
            <div className="flex items-center justify-between mb-1">                 {/* header row */}
              <div className="text-sm text-muted">                                   {/* author+time */}
                @{p.author.username} · {new Date(p.created_at).toLocaleString()}     {/* label */}
              </div>
              {!mine && (                                                            // follow button only if not me
                <Button                                                               // button element
                  variant={iFollow ? "outline" : "primary"}                           // style by state
                  onClick={() => toggleFollow(p.author.id, iFollow)}                  // handler
                >
                  {iFollow ? "Unfollow" : "Follow"}                                   {/* label */}
                </Button>
              )}
            </div>
            <div className="whitespace-pre-wrap">{p.text}</div>                      {/* post text */}
            {p.media_url && (                                                        // optional media
              <a className="text-sm underline" href={p.media_url} target="_blank" rel="noreferrer">
                {p.media_url}
              </a>
            )}
          </Card>
        );
      })}
    </div>
  );
}

