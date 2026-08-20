"use client";

import { useMemo, useState } from "react";

const needs = [
  { icon: "🎒", title: "School bags for new term", org: "Sahana Children’s Trust", location: "Kalutara", distance: "3.2 km", priority: "Urgent", progress: 12, total: 20, days: 4, category: "Education" },
  { icon: "💻", title: "Laptops for learning lab", org: "Mannar Youth Foundation", location: "Mannar", distance: "18 km", priority: "High", progress: 3, total: 8, days: 9, category: "Technology" },
  { icon: "🪑", title: "Study desks for community centre", org: "Bright Futures Lanka", location: "Gampaha", distance: "7.8 km", priority: "Medium", progress: 6, total: 15, days: 12, category: "Furniture" },
];

export default function Home() {
  const [tab, setTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => needs.filter((need) => `${need.title} ${need.org} ${need.location}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">H</span><div><strong>Helping Hands</strong><small>உதவிக்கரங்கள்</small></div></div>
        <nav aria-label="Main navigation">
          {["Overview", "Verified needs", "My donations", "Matches", "Messages"].map((item) => (
            <button key={item} className={tab === item ? "nav-item active" : "nav-item"} onClick={() => setTab(item)}>
              <span>{({Overview:"⌂", "Verified needs":"◇", "My donations":"□", Matches:"↗", Messages:"○"} as Record<string,string>)[item]}</span>{item}{item === "Messages" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="nav-label">ORGANIZATION</div>
        <nav><button className="nav-item"><span>◎</span>Impact report</button><button className="nav-item"><span>♙</span>Team & access</button><button className="nav-item"><span>⚙</span>Settings</button></nav>
        <div className="support-card"><span>♧</span><strong>Need support?</strong><p>Our partnership team is here to help.</p><button>Contact support</button></div>
        <div className="profile"><div className="avatar">AM</div><div><strong>Anjali Mendis</strong><small>Program Coordinator</small></div><button aria-label="Profile menu">⋮</button></div>
      </aside>

      <section className="content">
        <header className="topbar"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search needs, organizations, locations…" /></label><div className="top-actions"><button aria-label="Notifications" className="icon-button">♢<i /></button><button className="create">＋ Create donation</button></div></header>
        <div className="page">
          <div className="welcome"><div><p className="eyebrow">THURSDAY, 20 AUGUST</p><h1>Good morning, Anjali.</h1><p>Here’s how your giving is making a difference.</p></div><div className="verified"><span>✓</span><div><strong>Verified organization</strong><small>Identity reviewed · 12 Mar 2026</small></div></div></div>
          <section className="metrics" aria-label="Impact summary">
            <article><span className="metric-icon mint">↗</span><div><small>Total items donated</small><strong>248</strong><p><b>↑ 18%</b> from last month</p></div></article>
            <article><span className="metric-icon peach">♡</span><div><small>Needs supported</small><strong>32</strong><p>Across 11 communities</p></div></article>
            <article><span className="metric-icon lilac">⌁</span><div><small>People reached</small><strong>1,420</strong><p><b>+210</b> this quarter</p></div></article>
            <article><span className="metric-icon gold">✓</span><div><small>Successful matches</small><strong>94%</strong><p>Based on 67 offers</p></div></article>
          </section>
          <section className="main-grid">
            <div className="panel needs-panel"><div className="panel-head"><div><h2>Verified needs near you</h2><p>Real needs, reviewed by trusted organizations.</p></div><button>View all <span>→</span></button></div><div className="filter-row"><button className="chip selected">All needs</button><button className="chip">Urgent</button><button className="chip">Education</button><button className="chip">Within 10 km</button></div><div className="need-list">
              {filtered.map((need) => <article className="need" key={need.title}><div className="need-image">{need.icon}<span className={`priority ${need.priority.toLowerCase()}`}>{need.priority}</span></div><div className="need-body"><div className="need-title"><h3>{need.title}</h3><span>✓ Verified</span></div><p className="org">{need.org}</p><p className="meta">⌖ {need.location} · {need.distance} away &nbsp;·&nbsp; {need.category}</p><div className="progress-label"><span>{need.progress} of {need.total} items fulfilled</span><b>{Math.round(need.progress/need.total*100)}%</b></div><div className="bar"><i style={{width:`${need.progress/need.total*100}%`}} /></div></div><div className="need-action"><small>{need.days} days left</small><button>View need</button></div></article>)}
              {filtered.length === 0 && <div className="empty">No verified needs match your search.</div>}
            </div></div>
            <aside className="right-column"><div className="panel match-card"><div className="spark">✦</div><p className="eyebrow">SMART MATCH</p><h2>Your donations can help nearby</h2><p>We found <strong>4 verified needs</strong> that closely match items you’ve listed.</p><div className="match-preview"><span>📚</span><div><strong>Children’s story books</strong><small>Best match · 94% compatible</small></div><b>94%</b></div><button>Review matches <span>→</span></button><small className="explain">ⓘ Matches are based on item, quantity, distance and urgency.</small></div>
              <div className="panel activity"><div className="panel-head"><div><h2>Recent activity</h2></div><button>View all</button></div><ul><li><span className="activity-icon success">✓</span><div><strong>Donation delivered</strong><p>12 school bags reached Sahana Children’s Trust.</p><small>2 hours ago</small></div></li><li><span className="activity-icon offer">↗</span><div><strong>Offer accepted</strong><p>Bright Futures Lanka accepted your furniture offer.</p><small>Yesterday</small></div></li><li><span className="activity-icon info">◇</span><div><strong>New match found</strong><p>Your books match a verified need in Kalutara.</p><small>2 days ago</small></div></li></ul></div>
            </aside>
          </section>
          <footer><span>Helping Hands · Built for accountable giving</span><span>Privacy & safety &nbsp;·&nbsp; Verification standards &nbsp;·&nbsp; Help centre</span></footer>
        </div>
      </section>
    </main>
  );
}
