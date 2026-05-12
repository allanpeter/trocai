// App screens — loaded as text/babel; React and shared components must be on window.

const _D = window.TROCAI_DATA;

/* ── Onboarding ──────────────────────────────────────────────────────── */
function OnboardingScreen({ onDone }) {
  const [step, setStep] = React.useState(0);
  const albums = [
    { id: "wc26",        name: "Copa do Mundo 2026",  stickers: 640, hot: true },
    { id: "wc22",        name: "Copa do Mundo 2022",  stickers: 670 },
    { id: "brasileirao", name: "Brasileirão 2026",    stickers: 480 },
  ];

  if (step === 0) {
    return (
      <div className="ta-onb">
        <div className="ta-onb-eb">PASSO 1 DE 2</div>
        <h1 className="ta-onb-t">Qual álbum tu tá colecionando?</h1>
        <p className="ta-onb-sub">A gente já cadastra todas as 640 figurinhas pra ti. É só ir marcando o que tu tem.</p>
        <div className="ta-onb-list">
          {albums.map(a => (
            <button key={a.id} className="ta-onb-card" onClick={() => setStep(1)}>
              <div className="ta-onb-card-l">
                <img src="assets/icons/album.svg" width="28" height="28" alt=""/>
                <div>
                  <div className="ta-onb-card-name">{a.name}</div>
                  <div className="ta-onb-card-meta">{a.stickers} figurinhas</div>
                </div>
              </div>
              {a.hot && <Pill tone="brand">Em alta</Pill>}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="ta-onb">
      <div className="ta-onb-eb">PASSO 2 DE 2</div>
      <h1 className="ta-onb-t">Marca rapidão o que tu já tem</h1>
      <p className="ta-onb-sub">Toca em cada figurinha. Tu pode terminar depois — sempre dá pra adicionar mais.</p>
      <div className="ta-onb-grid">
        {_D.STICKERS.slice(0, 24).map(s => <StickerCard key={s.id} sticker={s}/>)}
      </div>
      <div className="ta-onb-cta">
        <Button onClick={onDone}>Bora pro álbum</Button>
        <Button variant="ghost" onClick={onDone}>Pulo, faço depois</Button>
      </div>
    </div>
  );
}

/* ── Album ───────────────────────────────────────────────────────────── */
function AlbumScreen({ goto }) {
  const [filter, setFilter] = React.useState("all");
  const [team, setTeam]     = React.useState("ALL");

  let list = _D.STICKERS;
  if (filter !== "all") list = list.filter(s => s.state === filter);
  if (team !== "ALL")   list = list.filter(s => s.team === team);

  const counts = {
    all:     _D.STICKERS.length,
    have:    _D.STICKERS.filter(s => s.state === "have").length,
    missing: _D.STICKERS.filter(s => s.state === "missing").length,
    dupe:    _D.STICKERS.filter(s => s.state === "dupe").length,
  };

  return (
    <>
      <AppHeader
        eyebrow="ÁLBUM · COPA DO MUNDO 2026"
        title="Meu álbum"
        actions={<>
          <Button variant="secondary" size="md">+ Adicionar pacotinho</Button>
          <Button onClick={() => goto("matches")}>Ver matches</Button>
        </>}
      />
      <div className="ta-album-bar">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all",     label: `Tudo · ${counts.all}`         },
            { value: "have",    label: `Tenho · ${counts.have}`        },
            { value: "missing", label: `Falta · ${counts.missing}`     },
            { value: "dupe",    label: `Repetida · ${counts.dupe}`     },
          ]}
        />
        <div className="ta-team-filters">
          {["ALL", ...Object.keys(_D.TEAMS)].map(t => (
            <button
              key={t}
              className={`ta-team-pill ${team === t ? "active" : ""}`}
              onClick={() => setTeam(t)}
            >
              {t === "ALL" ? "Todos times" : _D.TEAMS[t].name}
            </button>
          ))}
        </div>
      </div>
      <div className="ta-album-grid">
        {list.map(s => <StickerCard key={s.id} sticker={s}/>)}
        {list.length === 0 && (
          <div className="ta-empty">Sem figurinhas neste filtro.</div>
        )}
      </div>
    </>
  );
}

/* ── Matches ─────────────────────────────────────────────────────────── */
function MatchesScreen({ goto }) {
  const missingCount = _D.STICKERS.filter(s => s.state === "missing").length;
  const dupeCount    = _D.STICKERS.filter(s => s.state === "dupe").length;

  return (
    <>
      <AppHeader
        eyebrow="MATCHES"
        title="Quem tem o que te falta"
        actions={<Button variant="secondary">Filtros</Button>}
      />
      <div className="ta-stats-row">
        <StatTile label="Faltam"            value={missingCount}          tone="missing"/>
        <StatTile label="Tu tem repetida"   value={dupeCount}             tone="dupe"/>
        <StatTile label="Matches abertos"   value={_D.MATCHES.length}     tone="brand" sub="3 novos hoje"/>
      </div>
      <div className="ta-match-list">
        {_D.MATCHES.map((m, i) => (
          <MatchRow key={i} match={m} onAct={() => goto("chat")}/>
        ))}
      </div>
    </>
  );
}

/* ── Chat ────────────────────────────────────────────────────────────── */
function ChatScreen() {
  const leo = _D.USERS.find(u => u.id === "leo");
  const [draft, setDraft] = React.useState("");
  const [msgs, setMsgs]   = React.useState(_D.CHAT);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { from: "me", text: draft, time: "agora" }]);
    setDraft("");
  };

  return (
    <>
      <AppHeader
        eyebrow="TROCA COM"
        title={
          <>{leo.name} <span style={{ color: "var(--fg-muted)", fontWeight: 500, fontSize: 18 }}>· #112 ⇄ #387</span></>
        }
        actions={<Button variant="secondary">Confirmar troca</Button>}
      />
      <div className="ta-chat">
        <div className="ta-chat-body">
          {msgs.map((m, i) => (
            <div key={i} className={`ta-bubble ${m.from === "me" ? "me" : "them"}`}>
              <div>{m.text}</div>
              <div className="ta-bubble-time">{m.time}</div>
            </div>
          ))}
          <div className="ta-chat-pin">
            <div>
              <div style={{ fontSize: 11, color: "var(--gold-700)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Troca combinada
              </div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>
                Tua #112 ⇄ Léo's #387 · Escola, amanhã 17h
              </div>
            </div>
            <Button size="sm" variant="accent">Confirmar</Button>
          </div>
        </div>
        <div className="ta-chat-input">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Manda uma mensagem pro ${leo.name}…`}
          />
          <Button onClick={send}>Enviar</Button>
        </div>
      </div>
    </>
  );
}

/* ── Profile ─────────────────────────────────────────────────────────── */
function ProfileScreen() {
  const owned      = _D.STICKERS.filter(s => s.state === "have" || s.state === "dupe").length;
  const completion = Math.round((owned / _D.STICKERS.length) * 100);

  return (
    <>
      <AppHeader eyebrow="PERFIL" title="Você"/>
      <div className="ta-profile-hero">
        <Avatar user={{ name: "Você", color: "#0D1B2A" }} size={88}/>
        <div className="ta-profile-info">
          <div className="ta-profile-name">você@trocai.app</div>
          <div className="ta-profile-meta">São Paulo · entrou em mai/2026 · 18 trocas concluídas</div>
          <div className="ta-profile-pills">
            <Pill tone="brand">Colecionador</Pill>
            <Pill tone="gold">Top 5% da cidade</Pill>
            <Pill tone="neutral">Confiável · 100% no prazo</Pill>
          </div>
        </div>
      </div>
      <div className="ta-stats-row">
        <StatTile label="Coladas"    value="100/640" tone="brand"   sub={`${completion}% completo`}/>
        <StatTile label="Faltam"     value="12"      tone="missing"                               />
        <StatTile label="Repetidas"  value="24"      tone="dupe"    sub="todas listadas pra troca"/>
        <StatTile label="Pontos"     value="320"     tone="neutral" sub="+40 esta semana"         />
      </div>
      <div className="ta-profile-progress">
        <div className="ta-profile-progress-h">
          <span>Progresso do álbum</span>
          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{completion}%</span>
        </div>
        <div className="ta-progress-track">
          <div className="ta-progress-fill" style={{ width: `${completion}%` }}/>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  OnboardingScreen, AlbumScreen, MatchesScreen, ChatScreen, ProfileScreen,
});
