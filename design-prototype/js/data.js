// Mock data for trocai.app — in-memory only, replace with real API.

window.TROCAI_DATA = (function () {
  const TEAMS = {
    BRA: { name: "Brasil",    color: "#0FA958" },
    ARG: { name: "Argentina", color: "#5BA8E2" },
    FRA: { name: "França",    color: "#1F3A93" },
    GER: { name: "Alemanha",  color: "#22293A" },
    POR: { name: "Portugal",  color: "#A8231F" },
    ESP: { name: "Espanha",   color: "#D6242C" },
  };

  const PLAYERS = [
    ["Marquinhos",  "BRA"], ["Neymar",      "BRA"], ["Vini Jr",     "BRA"], ["Alisson",   "BRA"],
    ["Casemiro",    "BRA"], ["Rodrygo",     "BRA"], ["Richarlison", "BRA"], ["Militão",   "BRA"],
    ["Raphinha",    "BRA"], ["Danilo",      "BRA"],
    ["Messi",       "ARG"], ["Di María",    "ARG"], ["Lautaro",     "ARG"], ["Otamendi",  "ARG"],
    ["Mac Allister","ARG"], ["Álvarez",     "ARG"], ["Paredes",     "ARG"], ["Romero",    "ARG"],
    ["Acuña",       "ARG"], ["Martínez",    "ARG"],
    ["Mbappé",      "FRA"], ["Griezmann",   "FRA"], ["Dembélé",     "FRA"], ["Varane",    "FRA"],
    ["Theo",        "FRA"], ["Tchouaméni",  "FRA"], ["Camavinga",   "FRA"], ["Rabiot",    "FRA"],
    ["Koundé",      "FRA"], ["Maignan",     "FRA"],
    ["Müller",      "GER"], ["Sané",        "GER"], ["Kimmich",     "GER"], ["Goretzka",  "GER"],
    ["Havertz",     "GER"], ["Gnabry",      "GER"], ["Rüdiger",     "GER"], ["Süle",      "GER"],
    ["Neuer",       "GER"], ["Gündogan",    "GER"],
    ["Ronaldo",     "POR"], ["Bruno F.",    "POR"], ["Bernardo S.", "POR"], ["João Félix","POR"],
    ["Dias",        "POR"], ["Pepe",        "POR"], ["Cancelo",     "POR"], ["Leão",      "POR"],
    ["Diogo Jota",  "POR"], ["Rúben N.",    "POR"],
    ["Pedri",       "ESP"], ["Gavi",        "ESP"], ["Morata",      "ESP"], ["Olmo",      "ESP"],
    ["Asensio",     "ESP"], ["Busquets",    "ESP"], ["Carvajal",    "ESP"], ["Laporte",   "ESP"],
    ["Sergio R.",   "ESP"], ["Unai S.",     "ESP"],
  ];

  function pickState(i) {
    const r = (i * 37) % 100;
    if (r < 12) return "missing";
    if (r < 24) return "dupe";
    return "have";
  }

  const STICKERS = PLAYERS.map((p, i) => ({
    id: i + 1,
    number: String(i + 1).padStart(3, "0"),
    name: p[0],
    team: p[1],
    rare: [1, 11, 21, 31, 41, 51].includes(i + 1),
    state: pickState(i),
    dupeCount: pickState(i) === "dupe" ? 1 + (i % 3) : 0,
  }));

  const USERS = [
    { id: "leo", name: "Léo",    city: "São Paulo · 1.2 km",       trades: 23, color: "#E63978" },
    { id: "mar", name: "Marina", city: "Mesma escola",              trades:  8, color: "#F5C518" },
    { id: "ped", name: "Pedro",  city: "Vila Madalena · 3.4 km",   trades: 41, color: "#0FA958" },
    { id: "ana", name: "Ana",    city: "Pinheiros · 5.1 km",       trades: 12, color: "#14202F" },
    { id: "jun", name: "Junior", city: "Mooca · 8.7 km",           trades: 67, color: "#0A8847" },
  ];

  const MATCHES = [
    { user: "leo", youGive: "112", youGet: "021", note: "Topa trocar hoje?" },
    { user: "mar", youGive: "025", youGet: "001", note: "Tô com 3 da #25 sobrando" },
    { user: "ped", youGive: "045", youGet: "011", note: "Encontro na escola amanhã" },
    { user: "ana", youGive: "058", youGet: "031", note: null },
    { user: "jun", youGive: "037", youGet: "041", note: "Achei 5 que te servem" },
  ];

  const CHAT = [
    { from: "leo", text: "oi! vi q vc tem a #112 q tô precisando",     time: "14:22" },
    { from: "me",  text: "Bora! eu preciso da #387 q vc tem",           time: "14:23" },
    { from: "leo", text: "fechou. tô na escola amanhã 17h",             time: "14:23" },
    { from: "leo", text: "encontro perto do portão?",                    time: "14:23" },
    { from: "me",  text: "topo. levo a #112 e tu leva a #387 ✋",       time: "14:25" },
    { from: "leo", text: "perfeito 🤝 marcou aqui no app pra confirmar?", time: "14:25" },
  ];

  return { TEAMS, STICKERS, USERS, MATCHES, CHAT };
})();
