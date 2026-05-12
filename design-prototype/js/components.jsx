// Shared UI components — loaded as text/babel; React must be on window.

const D = window.TROCAI_DATA;

/* ── Avatar ──────────────────────────────────────────────────────────── */
function Avatar({ user, size = 36, dot = false }) {
  const style = {
    width: size, height: size,
    fontSize: size * 0.42,
    background: user.color || "#0FA958",
  };
  return (
    <span className="ta-avi" style={style} aria-label={user.name}>
      {user.name[0]}
      {dot && <span className="ta-avi-dot"/>}
    </span>
  );
}

/* ── Button ──────────────────────────────────────────────────────────── */
function Button({ children, variant = "primary", size = "md", onClick, full = false }) {
  const cls = [
    "ta-btn",
    `ta-btn-${variant}`,
    `ta-btn-${size}`,
    full ? "ta-btn-full" : "",
  ].filter(Boolean).join(" ");
  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

/* ── Pill ────────────────────────────────────────────────────────────── */
function Pill({ children, tone = "neutral" }) {
  return <span className={`ta-pill ta-pill-${tone}`}>{children}</span>;
}

/* ── Segmented tabs ──────────────────────────────────────────────────── */
function Segmented({ options, value, onChange }) {
  return (
    <div className="ta-seg">
      {options.map(o => (
        <button
          key={o.value}
          className={`ta-seg-btn ${o.value === value ? "active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Sticker card ────────────────────────────────────────────────────── */
function StickerCard({ sticker, onClick }) {
  const { number, name, team, state, dupeCount, rare } = sticker;
  const teamObj = D.TEAMS[team];
  const cls = ["ta-sc", `ta-sc-${state}`, rare ? "ta-sc-rare" : ""].filter(Boolean).join(" ");

  return (
    <button className={cls} onClick={onClick} title={`#${number} ${name}`}>
      <div
        className="ta-sc-top"
        style={state === "have" || state === "dupe" ? { color: teamObj.color } : undefined}
      >
        {state === "missing"
          ? <span className="ta-sc-q">?</span>
          : <span className="ta-sc-mono">{name[0]}</span>
        }
        {dupeCount > 1 && <span className="ta-sc-badge">×{dupeCount}</span>}
        {rare && <span className="ta-sc-foil-corner"/>}
      </div>
      <div className="ta-sc-bot">
        <span className="ta-sc-num">#{number}</span>
        <span className="ta-sc-name">{state === "missing" ? "—" : name}</span>
      </div>
    </button>
  );
}

/* ── Match row ───────────────────────────────────────────────────────── */
function MatchRow({ match, onAct }) {
  const u = D.USERS.find(x => x.id === match.user);
  return (
    <div className="ta-match" onClick={onAct}>
      <Avatar user={u} size={44} dot/>
      <div className="ta-match-who">
        <div className="ta-match-name">
          {u.name} <span className="ta-match-city">· {u.city}</span>
        </div>
        <div className="ta-match-meta">
          {u.trades} trocas concluídas
          {match.note && <> · "{match.note}"</>}
        </div>
      </div>
      <div className="ta-match-swap">
        <span className="ta-match-give">#{match.youGive}</span>
        <span className="ta-match-arr">⇄</span>
        <span className="ta-match-get">#{match.youGet}</span>
      </div>
      <Button size="sm">Pedir troca</Button>
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────── */
function Sidebar({ current, onNav }) {
  const items = [
    { id: "album",   label: "Meu álbum", icon: "album"  },
    { id: "matches", label: "Matches",   icon: "match"  },
    { id: "chat",    label: "Chat",      icon: "swap"   },
    { id: "profile", label: "Perfil",    icon: "trophy" },
  ];
  return (
    <aside className="ta-side">
      <div className="ta-side-logo">
        <img src="assets/logo/trocai-mark.svg" width="36" height="36" alt="trocai"/>
        <span>trocai<em>.app</em></span>
      </div>
      <nav className="ta-side-nav">
        {items.map(it => (
          <button
            key={it.id}
            className={`ta-side-item ${current === it.id ? "active" : ""}`}
            onClick={() => onNav(it.id)}
          >
            <img src={`assets/icons/${it.icon}.svg`} width="20" height="20" alt=""/>
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
      <div className="ta-side-user">
        <Avatar user={{ name: "Você", color: "#0D1B2A" }} size={36}/>
        <div>
          <div className="ta-side-user-name">Você</div>
          <div className="ta-side-user-meta">100 / 640 figurinhas</div>
        </div>
      </div>
    </aside>
  );
}

/* ── App header ──────────────────────────────────────────────────────── */
function AppHeader({ title, eyebrow, actions }) {
  return (
    <header className="ta-hdr">
      <div className="ta-hdr-titles">
        {eyebrow && <div className="ta-hdr-eb">{eyebrow}</div>}
        <h1 className="ta-hdr-t">{title}</h1>
      </div>
      <div className="ta-hdr-actions">{actions}</div>
    </header>
  );
}

/* ── Stat tile ───────────────────────────────────────────────────────── */
function StatTile({ label, value, tone = "neutral", sub }) {
  return (
    <div className={`ta-stat ta-stat-${tone}`}>
      <div className="ta-stat-val">{value}</div>
      <div className="ta-stat-lbl">{label}</div>
      {sub && <div className="ta-stat-sub">{sub}</div>}
    </div>
  );
}

Object.assign(window, {
  Avatar, Button, Pill, Segmented,
  StickerCard, MatchRow, Sidebar, AppHeader, StatTile,
});
