// Charakter-Stil "Chibi": großer Kopf, kleiner Körper, dicke Umrisse.
// Ein Stil-Paket liefert: Aussehen-Optionen, render(look, equipped) für den ganzen Helden
// und icon(item) für die Item-Kacheln. Weitere Stile (Pixel, Anime …) kommen später
// genauso als eigene Datei in diesen Ordner und tragen sich in CharacterStyles ein.
window.CharacterStyles = window.CharacterStyles || {};
CharacterStyles.chibi = (() => {
  const INK = "#24172b";
  const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

  // Farbe heller (amt > 0) oder dunkler (amt < 0) machen
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const mix = c => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  // Dicke Linie mit Umriss (Arme, Stäbe, Griffe)
  const limb = (d, color, w) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const TORSO = "M70,124 Q100,116 130,124 L134,176 Q100,184 66,176 Z";
  const torso = fill => `<path d="${TORSO}" fill="${fill}" ${O}/><path d="M70,162 Q100,170 132,162 L134,176 Q100,184 66,176 Z" fill="${INK}" opacity=".18"/>`;
  const sleeves = c => limb("M74,130 Q60,138 57,158", c, 15) + limb("M126,130 Q140,138 143,158", c, 15);

  // ---------- Aussehen ----------
  // options = Auswahl per Knopf, palettes = Auswahl per Farbe
  const options = {
    hair: { label: "Frisur", values: { short: "Kurz", spiky: "Stachelig", sidepart: "Seitenscheitel", buzz: "Raspel", mohawk: "Irokese", curly: "Locken", afro: "Afro", bob: "Bob", long: "Lang", ponytail: "Zopf", bun: "Dutt", pigtails: "Zöpfe", samurai: "Samurai", wild: "Wuschel", braid: "Flechtzopf" } },
    mouth: { label: "Ausdruck", values: { smile: "Lächeln", grin: "Grinsen", smirk: "Cool", neutral: "Ernst" } },
    beard: { label: "Bart", values: { none: "Kein Bart", stubble: "Stoppeln", mustache: "Schnurrbart", goatee: "Spitzbart", full: "Vollbart" } },
    glasses: { label: "Brille", values: { none: "Keine", round: "Rund", square: "Eckig", sun: "Sonnenbrille" } },
    detail: { label: "Details", values: { none: "Keine", freckles: "Sommersprossen", scar: "Narbe", bandage: "Pflaster" } }
  };
  const palettes = {
    hairColor: { label: "Haarfarbe", colors: ["#2b2233", "#5a3a24", "#a0612f", "#e8c26a", "#d9483b", "#ff8fc8", "#8e7cff", "#4fb6c9", "#58c46a", "#e6e6f0"] },
    skin: { label: "Hautton", colors: ["#ffe0c2", "#f6c9a0", "#e0a777", "#b97a4f", "#8a5534", "#5e3a24"] },
    eyes: { label: "Augen", colors: ["#3a2a5a", "#2f6fd6", "#3a9a5a", "#8a5a2a", "#c0392b", "#8e7cff", "#4fb6c9", "#e0a93a"] },
    outfit: { label: "Kleidung", colors: ["#5b6cff", "#d94a4a", "#3aa37a", "#e0a93a", "#8a5ad6", "#f08a24", "#2f9fb0", "#d9487f", "#3b3f55", "#e6e6f0"] }
  };
  const defaults = { style: "chibi", hair: "short", hairColor: "#2b2233", skin: "#f6c9a0", eyes: "#3a2a5a", outfit: "#5b6cff", mouth: "smile", beard: "none", glasses: "none", detail: "none" };

  const FRONT_SHORT = "M55,88 C50,52 74,36 100,36 C126,36 150,52 145,88 C140,76 132,68 122,64 C118,72 108,76 98,70 C90,76 78,74 72,68 C64,74 58,80 55,88 Z";
  const FRONT_BOB = "M52,112 C42,62 68,36 100,36 C132,36 158,62 148,112 L138,112 C140,88 132,74 122,68 C110,76 88,76 78,68 C68,74 60,88 62,112 Z";
  const FRONT_BUZZ = "M56,84 C54,50 76,40 100,40 C124,40 146,50 144,84 C138,70 124,62 100,62 C76,62 62,70 56,84 Z";
  const path = (d, fill) => `<path d="${d}" fill="${fill}" ${O}/>`;
  // Lockige Formen: Kreise mit Umriss, darüber dieselben Kreise ohne Umriss (so verschwinden die inneren Linien)
  const curls = (pts, fill) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${O}/>`).join("") + pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 2.5}" fill="${fill}"/>`).join("");
  const ring = (cx, cy, rad, r, from, to, step) => { const pts = []; for (let a = from; a <= to; a += step) pts.push([cx + rad * Math.cos(a * Math.PI / 180), cy + rad * Math.sin(a * Math.PI / 180), r]); return pts; };
  const HAIR = {
    short: { front: c => path(FRONT_SHORT, c) },
    spiky: { front: c => path("M53,90 L46,62 L62,62 L58,38 L78,48 L84,24 L100,40 L114,22 L120,46 L140,36 L138,60 L154,60 L147,90 C140,76 130,68 120,66 C112,72 96,74 88,68 C76,72 62,78 53,90 Z", c) },
    sidepart: { front: c => path("M54,92 C46,52 72,34 104,36 C134,38 152,58 146,90 C142,74 134,64 120,60 C104,70 80,72 64,70 C60,76 56,84 54,92 Z", c) + `<path d="M76,42 Q80,54 66,68" fill="none" stroke="${shade(c, -0.35)}" stroke-width="2.5" stroke-linecap="round"/>` },
    buzz: { front: c => path(FRONT_BUZZ, c), noShine: true },
    mohawk: { front: c => `<path d="${FRONT_BUZZ}" fill="${shade(c, 0.25)}" opacity=".55"/>` + path("M86,62 L80,42 L90,44 L86,22 L97,32 L100,6 L106,30 L116,20 L114,42 L122,40 L114,62 Z", c), noShine: true },
    curly: { front: c => path(FRONT_SHORT, c) + curls(ring(100, 80, 44, 13, 190, 350, 20), c), noShine: true },
    afro: { back: c => curls([[100, 70, 54], ...ring(100, 72, 54, 18, 0, 359, 30)], c), front: c => curls(ring(100, 74, 40, 12, 200, 340, 20), c), noShine: true },
    bob: { front: c => path(FRONT_BOB, c) },
    long: { front: c => path(FRONT_BOB, c), back: c => path("M56,80 C44,120 48,152 62,158 L138,158 C152,152 156,120 144,80 Z", c) },
    ponytail: { front: c => path(FRONT_SHORT, c), back: c => path("M136,58 C178,50 184,108 160,136 C162,110 154,90 138,82 Z", c) },
    bun: { front: c => path(FRONT_SHORT, c), back: c => `<circle cx="100" cy="30" r="17" fill="${c}" ${O}/><path d="M90,26 Q100,20 110,26" fill="none" stroke="${shade(c, 0.35)}" stroke-width="3" stroke-linecap="round"/>` },
    pigtails: {
      front: c => path(FRONT_SHORT, c),
      back: c => path("M60,84 C34,92 28,128 40,150 C46,130 54,112 66,104 Z", c) + path("M140,84 C166,92 172,128 160,150 C154,130 146,112 134,104 Z", c)
        + `<circle cx="58" cy="90" r="6" fill="#ff7a8a" ${O}/><circle cx="142" cy="90" r="6" fill="#ff7a8a" ${O}/>`
    },
    // v3.0: freischaltbare Frisuren
    samurai: {
      front: c => path("M55,86 C52,50 76,38 100,38 C124,38 148,50 145,86 C136,70 120,64 100,64 C80,64 64,70 55,86 Z", c)
        + `<path d="M72,52 Q100,42 128,52" fill="none" stroke="${shade(c, 0.3)}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,
      back: c => `<ellipse cx="100" cy="24" rx="11" ry="13" fill="${c}" ${O}/><rect x="92" y="33" width="16" height="7" rx="3" fill="#e8484f" ${O}/>`,
      noShine: true
    },
    wild: { front: c => path("M50,92 L40,70 L54,66 L44,44 L64,48 L62,26 L82,38 L90,16 L104,34 L118,14 L124,38 L144,28 L140,50 L160,48 L148,68 L162,76 L150,92 C140,76 128,68 116,66 C108,74 92,74 86,68 C72,72 60,80 50,92 Z", c) },
    braid: {
      front: c => path("M54,92 C46,52 72,34 104,36 C134,38 152,58 146,90 C142,74 134,64 120,60 C104,70 80,72 64,70 C60,76 56,84 54,92 Z", c),
      back: c => [0, 1, 2, 3, 4].map(i => `<ellipse cx="${146 + i * 1.5}" cy="${98 + i * 14}" rx="10" ry="9" fill="${c}" ${O}/>`).join("") + `<circle cx="153" cy="166" r="5" fill="#8e7cff" ${O}/>`
    }
  };
  function hairBack(look) {
    const h = HAIR[look.hair] || HAIR.short;
    return h.back ? h.back(shade(look.hairColor, -0.2)) : "";
  }
  function hairFront(look) {
    const h = HAIR[look.hair] || HAIR.short;
    return h.front(look.hairColor) + (h.noShine ? "" : `<path d="M74,50 Q90,40 108,42" fill="none" stroke="${shade(look.hairColor, 0.35)}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`);
  }
  const MOUTHS = {
    smile: `<path d="M94,109 Q100,115 106,109" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    grin: `<path d="M92,107 Q100,120 108,107 Z" fill="#8a2a3c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M94,108 L106,108" stroke="#fff" stroke-width="2.5"/>`,
    smirk: `<path d="M93,111 Q102,114 108,107" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    neutral: `<path d="M95,111 L105,111" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
  };
  const BEARDS = {
    stubble: c => `<path d="M62,100 C66,122 84,128 100,128 C116,128 134,122 138,100 C130,114 118,120 100,120 C82,120 70,114 62,100 Z" fill="${c}" opacity=".35"/>`,
    full: c => `<path d="M57,92 C56,128 82,138 100,138 C118,138 144,128 143,92 C136,108 124,116 112,115 C108,108 92,108 88,115 C76,116 64,108 57,92 Z" fill="${c}" ${O}/>`,
    goatee: c => `<path d="M91,116 C93,128 107,128 109,116 C104,119 96,119 91,116 Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`
  };
  const GLASSES = {
    round: `<circle cx="83" cy="94" r="11" fill="#ffffff22" stroke="${INK}" stroke-width="2.5"/><circle cx="117" cy="94" r="11" fill="#ffffff22" stroke="${INK}" stroke-width="2.5"/>`,
    square: `<rect x="71" y="85" width="24" height="18" rx="4" fill="#ffffff22" stroke="${INK}" stroke-width="2.5"/><rect x="105" y="85" width="24" height="18" rx="4" fill="#ffffff22" stroke="${INK}" stroke-width="2.5"/>`,
    sun: `<path d="M70,86 L96,86 L94,100 Q83,106 72,100 Z M104,86 L130,86 L128,100 Q117,106 106,100 Z" fill="${INK}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M76,90 L84,90 M110,90 L118,90" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`
  };
  const glassesFrame = `<path d="M94,93 Q100,89 106,93 M72,91 L57,89 M128,91 L143,89" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
  const DETAILS = {
    freckles: [[68, 100], [74, 104], [70, 108], [126, 104], [132, 100], [130, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#a0612f" opacity=".7"/>`).join(""),
    scar: `<path d="M110,80 L124,104 M112,88 L119,85 M116,95 L123,92" stroke="#c4566a" stroke-width="2.2" stroke-linecap="round" fill="none"/>`,
    bandage: `<g transform="rotate(-20 128 104)"><rect x="118" y="99" width="20" height="10" rx="3" fill="#f3d9b5" stroke="${INK}" stroke-width="2"/><path d="M126,101 L126,107 M130,101 L130,107" stroke="#c9a77d" stroke-width="1.5"/></g>`
  };
  function face(look) {
    const eye = x => `<ellipse cx="${x}" cy="94" rx="6.5" ry="8.5" fill="${look.eyes}" stroke="${INK}" stroke-width="2"/><circle cx="${x + 2}" cy="90" r="2.8" fill="#fff"/><circle cx="${x - 2}" cy="98" r="1.3" fill="#fff" opacity=".8"/>`;
    const beardColor = shade(look.hairColor, -0.1);
    let s = `<g class="eyes-blink">${eye(83) + eye(117)}</g>`
      + `<ellipse cx="72" cy="106" rx="7" ry="4" fill="#ff7a8a" opacity=".35"/><ellipse cx="128" cy="106" rx="7" ry="4" fill="#ff7a8a" opacity=".35"/>`
      + (DETAILS[look.detail] || "");
    if (BEARDS[look.beard]) s += BEARDS[look.beard](beardColor);
    s += MOUTHS[look.mouth] || MOUTHS.smile;
    if (look.beard === "mustache" || look.beard === "full") s += `<path d="M86,106 C90,100 98,102 100,105 C102,102 110,100 114,106 C108,108 102,108 100,106 C98,108 92,108 86,106 Z" fill="${beardColor}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    return s;
  }
  function glasses(look) { return GLASSES[look.glasses] ? glassesFrame + GLASSES[look.glasses] : ""; }

  // ---------- Ausrüstung ----------
  // Jedes Item zeichnet sich selbst. head/body/back in Charakter-Koordinaten,
  // weapon/hands/feet in eigenen Koordinaten (Griff bzw. Mitte bei 0,0).
  const glove = (fist, cuff, extra = "") => `${extra}<circle cx="0" cy="0" r="10" fill="${fist}" ${O}/><rect x="-11" y="-16" width="22" height="8" rx="3" fill="${cuff}" ${O}/>`;
  const boot = (shaft, foot, band, extra = "") => `${extra}<rect x="-9" y="-20" width="18" height="18" rx="4" fill="${shaft}" ${O}/><ellipse cx="2" cy="0" rx="13" ry="7.5" fill="${foot}" ${O}/><rect x="-10" y="-23" width="20" height="6" rx="3" fill="${band}" ${O}/>`;
  const PARTS = {
    // Kopf
    cap: { draw: `<path d="M54,74 C54,40 76,30 100,30 C124,30 146,40 146,74 Z" fill="#3f7be0" ${O}/><path d="M120,70 Q150,64 168,76 Q146,84 120,80 Z" fill="#2c5bb0" ${O}/><circle cx="100" cy="31" r="4" fill="#ffcc4d" ${O}/><path d="M70,48 Q86,38 102,38" stroke="#8fb6ff" stroke-width="4" fill="none" stroke-linecap="round"/>` },
    tophat: { draw: `<path d="M66,58 C80,38 92,14 128,2 C116,20 120,38 136,58 Z" fill="#6a48c4" ${O}/><ellipse cx="100" cy="60" rx="58" ry="12" fill="#5b3fa8" ${O}/><path d="M70,52 Q100,44 132,52" stroke="#ffcc4d" stroke-width="5" fill="none"/><path d="M104,30 l3,6 6,1 -5,4 1,6 -5,-3 -5,3 1,-6 -5,-4 6,-1 Z" fill="#ffe27a"/>` },
    helmet: { draw: `<path d="M52,84 C50,40 74,28 100,28 C126,28 150,40 148,84 L136,84 L136,72 L64,72 L64,84 Z" fill="#a3acbd" ${O}/><path d="M56,66 L144,66" stroke="${INK}" stroke-width="3"/><rect x="95" y="62" width="10" height="34" rx="4" fill="#8a93a6" ${O}/><path d="M70,44 Q86,34 102,34" stroke="#e6ebf3" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="66" cy="58" r="2.5" fill="${INK}"/><circle cx="134" cy="58" r="2.5" fill="${INK}"/>` },
    headband: { draw: `<path d="M146,74 L170,62 L166,80 Z" fill="#c43a3f" ${O}/><path d="M146,76 L166,90 L156,94 Z" fill="#c43a3f" ${O}/><path d="M55,70 Q100,56 145,70 L146,82 Q100,68 54,82 Z" fill="#e8484f" ${O}/><circle cx="146" cy="76" r="5" fill="#e8484f" ${O}/>` },
    crown: { draw: `<path d="M64,56 L64,28 L80,42 L92,18 L100,36 L108,18 L120,42 L136,28 L136,56 Z" fill="#ffcc4d" ${O}/><rect x="62" y="50" width="76" height="10" rx="3" fill="#f0a520" ${O}/><circle cx="100" cy="46" r="5" fill="#e8484f" ${O}/><circle cx="80" cy="50" r="3.5" fill="#4fb6ff"/><circle cx="120" cy="50" r="3.5" fill="#4fb6ff"/><circle cx="92" cy="18" r="3" fill="#fff6c8" ${O}/><circle cx="108" cy="18" r="3" fill="#fff6c8" ${O}/>` },
    laurel: { draw: [[58, 74, -60], [64, 62, -45], [73, 52, -30], [85, 45, -15], [115, 45, 15], [127, 52, 30], [136, 62, 45], [142, 74, 60]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4.5" transform="rotate(${a} ${x} ${y})" fill="#5bb174" ${O}/>`).join("") + `<circle cx="100" cy="43" r="6" fill="#ffcc4d" ${O}/>` },
    hood: { draw: `<path d="M44,100 C40,50 66,24 100,24 C134,24 160,50 156,100 C150,124 140,128 132,126 C140,104 138,80 128,70 C116,62 84,62 72,70 C62,80 60,104 68,126 C60,128 50,124 44,100 Z" fill="#33304d" ${O}/><path d="M72,70 C84,62 116,62 128,70" stroke="#8e7cff" stroke-width="3" fill="none"/><path d="M60,48 Q80,32 104,30" stroke="#4a4670" stroke-width="5" fill="none" stroke-linecap="round"/>` },
    // Rüstung
    shirt: { fill: "#eadfc4", deco: `<path d="M100,122 L100,142 M94,127 L106,131 M94,134 L106,138" stroke="${INK}" stroke-width="2" fill="none"/><path d="M67,164 Q100,173 133,164" stroke="${INK}" stroke-width="8" fill="none"/><path d="M67,164 Q100,173 133,164" stroke="#a0612f" stroke-width="5" fill="none"/>` },
    vest: { deco: `<path d="M68,126 Q80,120 90,121 L93,180 Q78,180 66,176 Z" fill="#8a5a34" ${O}/><path d="M132,126 Q120,120 110,121 L107,180 Q122,180 134,176 Z" fill="#8a5a34" ${O}/><circle cx="88" cy="140" r="2.5" fill="#ffcc4d"/><circle cx="88" cy="156" r="2.5" fill="#ffcc4d"/><circle cx="112" cy="140" r="2.5" fill="#ffcc4d"/><circle cx="112" cy="156" r="2.5" fill="#ffcc4d"/>` },
    robe: { fill: "#f4f4f6", deco: `<path d="M88,120 L116,172" stroke="${INK}" stroke-width="2.5" fill="none"/><path d="M67,158 Q100,166 133,158 L134,168 Q100,176 66,168 Z" fill="#2b2b33" ${O}/><path d="M110,168 L118,190 L108,191 L103,170 Z" fill="#2b2b33" ${O}/>` },
    dragonmail: {
      fill: "#2f8f5b", sleeve: "#2a7a4f",
      deco: [132, 144, 156].map((y, row) => [0, 1, 2, 3, 4].map(i => `<path d="M${76 + i * 10 + (row % 2) * 5},${y} q5,7 10,0" fill="none" stroke="#1d5e3b" stroke-width="2.5"/>`).join("")).join("")
        + `<path d="M67,164 Q100,172 133,164 L134,172 Q100,181 66,172 Z" fill="#ffcc4d" ${O}/><ellipse cx="70" cy="128" rx="14" ry="10" fill="#1f6b43" ${O}/><ellipse cx="130" cy="128" rx="14" ry="10" fill="#1f6b43" ${O}/><path d="M64,124 l4,-8 4,8 M128,124 l4,-8 4,8" fill="#ffcc4d" ${O}/>`
    },
    // Waffen (Griff bei 0,0, Spitze nach oben)
    stick: { draw: limb("M0,28 L0,-64", "#8a5a34", 6) + `<circle cx="0" cy="-70" r="8" fill="#6b4226" ${O}/>` },
    dagger: { draw: `<rect x="-4" y="-10" width="8" height="24" rx="3" fill="#6b4226" ${O}/><path d="M-6,-14 L-6,-58 L0,-70 L6,-58 L6,-14 Z" fill="#e6edf5" ${O}/><path d="M0,-16 L0,-60" stroke="#b8c4d4" stroke-width="2"/><rect x="-15" y="-18" width="30" height="7" rx="3" fill="#ffcc4d" ${O}/><circle cx="0" cy="17" r="5" fill="#ffcc4d" ${O}/>` },
    goldsword: { draw: `<rect x="-4" y="-10" width="8" height="24" rx="3" fill="#7a2a3c" ${O}/><path d="M-8,-14 L-8,-64 L0,-80 L8,-64 L8,-14 Z" fill="#ffe27a" ${O}/><path d="M0,-16 L0,-70" stroke="#fff6c8" stroke-width="3"/><path d="M-20,-20 L20,-20 L16,-12 L-16,-12 Z" fill="#f0a520" ${O}/><circle cx="0" cy="-16" r="4.5" fill="#e8484f" ${O}/><circle cx="0" cy="17" r="5.5" fill="#f0a520" ${O}/>` },
    sunblade: { draw: `<path d="M0,-90 L0,-12" stroke="#fff6c8" stroke-width="22" stroke-linecap="round" opacity=".35"/><rect x="-4" y="-10" width="8" height="24" rx="3" fill="#5b3fa8" ${O}/><path d="M-9,-14 L-9,-70 L0,-88 L9,-70 L9,-14 Z" fill="#fff6c8" ${O}/><path d="M0,-18 L0,-78" stroke="#ffe07a" stroke-width="4"/><path d="M-22,-22 Q0,-8 22,-22 L18,-12 Q0,-2 -18,-12 Z" fill="#ffcc4d" ${O}/><circle cx="0" cy="-17" r="5" fill="#6fe0ff" ${O}/><circle cx="0" cy="17" r="6" fill="#ffcc4d" ${O}/>` },
    bow: { draw: `<path d="M-4,-64 L-4,42" stroke="#f3e9d2" stroke-width="2"/><path d="M-4,-64 Q36,-12 -4,42" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-4,-64 Q36,-12 -4,42" fill="none" stroke="#b5722f" stroke-width="6" stroke-linecap="round"/><rect x="8" y="-20" width="9" height="18" rx="3" fill="#6b4226" ${O}/>` },
    axe: { draw: limb("M0,28 L0,-62", "#8a5a34", 6) + `<path d="M2,-66 C30,-76 42,-46 32,-26 C24,-34 12,-36 2,-34 Z" fill="#c4ccd8" ${O}/><path d="M28,-64 C37,-52 37,-38 31,-28" stroke="#fff" stroke-width="2.5" fill="none" opacity=".8"/><path d="M-2,-58 L-14,-52 L-2,-44 Z" fill="#a3acbd" ${O}/>` },
    shield: { left: true, view: "-34 -36 68 76", draw: `<path d="M-22,-26 L22,-26 L22,0 Q22,22 0,34 Q-22,22 -22,0 Z" fill="#3f7be0" ${O}/><path d="M-15,-19 L15,-19 L15,-1 Q15,15 0,25 Q-15,15 -15,-1 Z" fill="none" stroke="#ffcc4d" stroke-width="3"/><path d="M0,-12 L0,16 M-9,-2 L9,-2" stroke="#ffcc4d" stroke-width="4" stroke-linecap="round"/>` },
    club: { draw: limb("M0,26 L0,-48", "#efe6d0", 9) + `<circle cx="-7" cy="-56" r="8" fill="#efe6d0" ${O}/><circle cx="7" cy="-56" r="8" fill="#efe6d0" ${O}/><circle cx="-5" cy="30" r="6" fill="#efe6d0" ${O}/><circle cx="5" cy="30" r="6" fill="#efe6d0" ${O}/>` },
    orb: { draw: `<defs><radialGradient id="chibiOrb" cx=".35" cy=".35"><stop offset="0" stop-color="#f2fdff"/><stop offset=".5" stop-color="#6fe0ff"/><stop offset="1" stop-color="#3a6fd5"/></radialGradient></defs>` + limb("M0,30 L0,-54", "#5b3fa8", 6) + `<path d="M-10,-52 Q0,-46 10,-52 L12,-64 M-10,-52 L-12,-64" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-68" r="20" fill="#6fe0ff" opacity=".25"/><circle cx="0" cy="-68" r="12" fill="url(#chibiOrb)" ${O}/>` },
    // Hände (Mitte der Faust bei 0,0)
    gloves: { draw: glove("#8a5a34", "#6b4226") },
    gauntlets: { draw: glove("#aeb7c6", "#7c8596") + `<path d="M-6,-3 L6,-3 M-6,3 L6,3" stroke="${INK}" stroke-width="2"/>` },
    flamefists: { draw: glove("#d9483b", "#ffcc4d", `<path d="M-12,-2 C-20,-22 -6,-26 -3,-38 C4,-26 18,-28 12,-2 Z" fill="#ffb02e" ${O}/><path d="M-6,-6 C-8,-18 0,-20 1,-28 C5,-18 10,-18 7,-6 Z" fill="#ffe27a"/>`) },
    // Füße (Mitte der Sohle bei 0,0)
    boots: { draw: boot("#7a4a2a", "#5e3a24", "#a0612f") },
    ironboots: { draw: boot("#a3acbd", "#7c8596", "#ffcc4d") },
    // Legendäre Items aus der Edelstein-Truhe
    thunderfists: { draw: glove("#3f6fd6", "#ffcc4d", `<path d="M-4,-40 L-12,-20 L-3,-20 L-9,-4 L8,-26 L-1,-26 L6,-40 Z" fill="#ffe27a" ${O}/>`) },
    cometboots: { draw: boot("#3b3f8a", "#24204f", "#ffcc4d", `<path d="M-10,-10 L-30,-18 L-24,-10 L-34,-6 L-12,-4 Z" fill="#8fd6ff" ${O}/><circle cx="-3" cy="-11" r="3" fill="#ffe27a"/>`) },
    dragonhelm: { draw: `<path d="M60,56 L36,20 L68,42 Z M140,56 L164,20 L132,42 Z" fill="#ffcc4d" ${O}/><path d="M52,84 C50,40 74,26 100,26 C126,26 150,40 148,84 L136,84 L136,72 L64,72 L64,84 Z" fill="#c43a3f" ${O}/><path d="M64,72 L136,72" stroke="#ffcc4d" stroke-width="5"/><path d="M100,26 L94,46 L100,62 L106,46 Z" fill="#ffcc4d" ${O}/><circle cx="100" cy="66" r="5" fill="#6fe0ff" ${O}/><path d="M68,42 Q84,32 98,32" stroke="#ff9a9a" stroke-width="5" fill="none" stroke-linecap="round"/>` },
    starcape: {
      back: `<path d="M70,120 Q100,112 130,120 Q158,168 156,208 Q128,198 100,206 Q72,198 44,208 Q42,168 70,120 Z" fill="#24204f" ${O}/><path d="M78,128 Q100,122 122,128 Q144,168 142,196 Q122,190 100,196 Q78,190 58,196 Q56,168 78,128 Z" fill="#3b3f8a"/>`
        + [[80, 150], [112, 140], [96, 176], [124, 182], [68, 186], [134, 158]].map(([x, y]) => `<path d="M${x},${y - 5} L${x + 1.5},${y - 1.5} L${x + 5},${y} L${x + 1.5},${y + 1.5} L${x},${y + 5} L${x - 1.5},${y + 1.5} L${x - 5},${y} L${x - 1.5},${y - 1.5} Z" fill="#ffe07a"/>`).join(""),
      front: `<circle cx="76" cy="126" r="6" fill="#ffcc4d" ${O}/><circle cx="124" cy="126" r="6" fill="#ffcc4d" ${O}/>`,
      view: "34 104 132 112"
    },
    wingboots: { draw: boot("#f4f4f6", "#e3c06a", "#ffcc4d", `<path d="M-8,-14 C-26,-24 -30,-8 -22,-2 C-18,-8 -13,-8 -8,-7 Z" fill="#fff" ${O}/>`) },
    // Rücken (hinter dem Körper, optional "front" vor dem Körper)
    backpack: {
      back: `<rect x="58" y="104" width="84" height="16" rx="8" fill="#6d8a4a" ${O}/><path d="M60,116 L140,116 Q146,116 146,124 L146,168 Q146,174 140,174 L60,174 Q54,174 54,168 L54,124 Q54,116 60,116 Z" fill="#9a6a3c" ${O}/>`,
      front: limb("M80,124 L84,170", "#6b4226", 4) + limb("M120,124 L116,170", "#6b4226", 4)
    },
    scarf: {
      back: `<path d="M118,122 Q152,118 168,140 Q146,138 124,132 Z" fill="#c43a3f" ${O}/>`,
      front: `<path d="M78,122 Q100,138 122,122 L124,132 Q100,148 76,132 Z" fill="#e5484d" ${O}/><path d="M104,136 L114,164 L103,166 L97,138 Z" fill="#e5484d" ${O}/>`,
      view: "60 96 120 84"
    },
    herocape: {
      back: `<path d="M70,120 Q100,112 130,120 Q156,166 154,206 Q128,198 100,204 Q72,198 46,206 Q44,166 70,120 Z" fill="#c43a3f" ${O}/><path d="M78,128 Q100,122 122,128 Q142,166 140,194 Q122,190 100,194 Q78,190 60,194 Q58,166 78,128 Z" fill="#e5484d"/><path d="M48,200 Q72,192 100,198 Q128,192 152,200" fill="none" stroke="#ffcc4d" stroke-width="4"/>`,
      front: `<circle cx="76" cy="126" r="6" fill="#ffcc4d" ${O}/><circle cx="124" cy="126" r="6" fill="#ffcc4d" ${O}/>`,
      view: "34 104 132 112"
    },
    feather: {
      back: `<path d="M70,120 Q100,112 130,120 Q160,168 158,208 Q130,198 100,206 Q70,198 42,208 Q40,168 70,120 Z" fill="#e8572e" ${O}/><path d="M76,128 Q100,121 124,128 Q146,168 144,196 Q124,190 100,196 Q76,190 56,196 Q54,168 76,128 Z" fill="#ffb02e"/><path d="M100,132 L100,192 M84,140 L72,186 M116,140 L128,186" stroke="#e8572e" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      front: `<circle cx="76" cy="126" r="5" fill="#ffcc4d" ${O}/><circle cx="124" cy="126" r="5" fill="#ffcc4d" ${O}/>`,
      view: "34 104 132 112"
    },

    // ---------- v3.0: Outfits (nur Aussehen, keine Werte). Teile beginnen mit "c_" ----------
    // Ritter
    c_knighthelm: { draw: `<path d="M100,28 C96,8 116,-4 136,4 C122,8 112,16 110,30 Z" fill="#e8484f" ${O}/><path d="M52,92 C48,40 74,26 100,26 C126,26 152,40 148,92 L138,92 C138,72 128,62 100,62 C72,62 62,72 62,92 Z" fill="#b8c2d4" ${O}/><path d="M57,66 Q100,52 143,66" fill="none" stroke="${INK}" stroke-width="3"/><path d="M70,42 Q86,32 102,32" stroke="#eef2f8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="64" cy="80" r="2.5" fill="${INK}"/><circle cx="136" cy="80" r="2.5" fill="${INK}"/>` },
    c_knightarmor: { fill: "#b8c2d4", sleeve: "#9aa5ba", pants: "#4a5266",
      deco: `<path d="M76,130 Q100,142 124,130" fill="none" stroke="#7c8596" stroke-width="3"/><path d="M92,140 L108,140 L106,154 L100,159 L94,154 Z" fill="#e8484f" ${O}/><path d="M67,164 Q100,172 133,164 L134,172 Q100,181 66,172 Z" fill="#6b4226" ${O}/><rect x="94" y="163" width="12" height="11" rx="2" fill="#ffcc4d" ${O}/><ellipse cx="70" cy="128" rx="13" ry="9" fill="#9aa5ba" ${O}/><ellipse cx="130" cy="128" rx="13" ry="9" fill="#9aa5ba" ${O}/>` },
    c_knightgloves: { draw: glove("#9aa5ba", "#7c8596") + `<path d="M-6,-3 L6,-3 M-6,3 L6,3" stroke="${INK}" stroke-width="2"/>` },
    c_knightboots: { draw: boot("#9aa5ba", "#7c8596", "#ffcc4d") },
    // Magier
    c_magehat: { draw: `<path d="M62,62 C80,52 92,24 128,-6 C116,22 120,44 138,62 Z" fill="#4a3aa8" ${O}/><ellipse cx="100" cy="62" rx="56" ry="11" fill="#3b2f8a" ${O}/><path d="M66,56 Q100,48 136,56" stroke="#ffcc4d" stroke-width="5" fill="none"/><path d="M106,26 l3,6 6,1 -5,4 1,6 -5,-3 -5,3 1,-6 -5,-4 6,-1 Z" fill="#ffe27a"/><circle cx="88" cy="44" r="2" fill="#ffe27a"/>` },
    c_magerobe: { fill: "#4a3aa8", sleeve: "#3b2f8a", pants: "#2a2160",
      skirt: `<path d="M66,168 Q100,178 134,168 L146,204 Q100,214 54,204 Z" fill="#4a3aa8" ${O}/><path d="M58,196 Q100,206 142,196" fill="none" stroke="#ffcc4d" stroke-width="3"/>`,
      deco: `<path d="M90,119 L100,150 L110,119" fill="none" stroke="#ffcc4d" stroke-width="3"/><path d="M67,160 Q100,168 133,160 L134,168 Q100,176 66,168 Z" fill="#ffcc4d" ${O}/><path d="M82,140 l1.5,3 3,.5 -2.2,2 .5,3 -2.8,-1.5 -2.8,1.5 .5,-3 -2.2,-2 3,-.5 Z M120,146 l1.5,3 3,.5 -2.2,2 .5,3 -2.8,-1.5 -2.8,1.5 .5,-3 -2.2,-2 3,-.5 Z" fill="#ffe27a"/>` },
    c_magecape: {
      back: `<path d="M70,120 Q100,112 130,120 Q156,166 154,206 Q128,198 100,204 Q72,198 46,206 Q44,166 70,120 Z" fill="#2a2160" ${O}/><path d="M78,128 Q100,122 122,128 Q142,166 140,194 Q122,190 100,194 Q78,190 60,194 Q58,166 78,128 Z" fill="#6a48c4"/>`,
      front: `<circle cx="76" cy="126" r="6" fill="#6fe0ff" ${O}/><circle cx="124" cy="126" r="6" fill="#6fe0ff" ${O}/>`, view: "34 104 132 112" },
    // Ninja (Maske verdeckt den Mund)
    c_ninjamask: { draw: `<path d="M57,100 C60,124 80,130 100,130 C120,130 140,124 143,100 C130,106 116,108 100,108 C84,108 70,106 57,100 Z" fill="#2b2b3a" ${O}/><path d="M55,72 Q100,58 145,72 L146,84 Q100,70 54,84 Z" fill="#2b2b3a" ${O}/><rect x="88" y="63" width="24" height="12" rx="3" fill="#c9d1de" ${O}/><path d="M146,76 L172,68 L165,84 Z M146,80 L168,94 L157,97 Z" fill="#2b2b3a" ${O}/>` },
    c_ninjasuit: { fill: "#2b2b3a", sleeve: "#232331", pants: "#1b1b26",
      deco: `<path d="M86,122 L114,168 M114,122 L86,168" stroke="#3d3d52" stroke-width="5"/><path d="M67,160 Q100,168 133,160 L134,170 Q100,178 66,170 Z" fill="#c43a3f" ${O}/><path d="M118,166 L128,188 L120,190 L112,170 Z" fill="#c43a3f" ${O}/>` },
    c_ninjagloves: { draw: glove("#2b2b3a", "#c43a3f") },
    c_ninjaboots: { draw: boot("#2b2b3a", "#1b1b26", "#c43a3f") },
    // Pirat
    c_piratehat: { draw: `<path d="M64,58 C66,26 134,26 136,58 Z" fill="#2b2233" ${O}/><path d="M42,68 C58,40 142,40 158,68 C132,56 68,56 42,68 Z" fill="#2b2233" ${O}/><path d="M48,62 C66,48 134,48 152,62" fill="none" stroke="#ffcc4d" stroke-width="3"/><circle cx="100" cy="42" r="7" fill="#fff" ${O}/><path d="M97,41 h.1 M103,41 h.1" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` },
    c_piratecoat: { fill: "#9a2a3a", sleeve: "#7a1f2e", pants: "#3b2a20",
      deco: `<path d="M88,120 L100,152 L112,120 Z" fill="#f4efe2" ${O}/><circle cx="88" cy="148" r="3" fill="#ffcc4d" ${O}/><circle cx="112" cy="148" r="3" fill="#ffcc4d" ${O}/><path d="M67,162 Q100,170 133,162 L134,172 Q100,180 66,172 Z" fill="#2b2233" ${O}/><rect x="91" y="161" width="18" height="13" rx="2" fill="#ffcc4d" ${O}/>` },
    c_pirateboots: { draw: boot("#2b2233", "#1b1622", "#ffcc4d") },

    // ---------- v3.0: Skins (ersetzen nur das Aussehen von Waffe/Rücken). Beginnen mit "s_" ----------
    s_flamesword: { draw: `<rect x="-4" y="-10" width="8" height="24" rx="3" fill="#3b2a20" ${O}/><path d="M-8,-14 C-15,-40 -4,-58 0,-86 C6,-60 17,-42 8,-14 Z" fill="#ff7a2e" ${O}/><path d="M-3,-18 C-6,-38 0,-52 1,-68 C5,-50 8,-36 4,-18 Z" fill="#ffe27a"/><path d="M-18,-20 L18,-20 L14,-12 L-14,-12 Z" fill="#c43a3f" ${O}/><circle cx="0" cy="17" r="5" fill="#c43a3f" ${O}/>` },
    s_dragonshield: { left: true, view: "-36 -40 72 80", draw: `<path d="M-24,-28 L-31,-38 L-17,-28 Z M24,-28 L31,-38 L17,-28 Z" fill="#ffcc4d" ${O}/><path d="M-24,-28 L24,-28 L24,0 Q24,24 0,36 Q-24,24 -24,0 Z" fill="#c43a3f" ${O}/><path d="M-16,-20 L16,-20 L16,-1 Q16,16 0,26 Q-16,16 -16,-1 Z" fill="none" stroke="#ffcc4d" stroke-width="3"/><path d="M-8,-10 L0,-17 L8,-10 L6,4 L0,13 L-6,4 Z" fill="#ffcc4d" ${O}/><circle cx="0" cy="-4" r="2.5" fill="${INK}"/>` },
    s_angelwings: {
      back: [0, 1].map(m => `<g ${m ? `transform="translate(200,0) scale(-1,1)"` : ""}><path d="M76,132 C52,100 20,100 10,116 C24,118 28,124 20,132 C34,132 38,138 28,146 C44,148 54,152 72,152 Z" fill="#fff" ${O}/><path d="M66,124 C50,116 36,116 28,122 M64,136 C50,132 40,134 34,140" fill="none" stroke="#cfd8e6" stroke-width="2.5" stroke-linecap="round"/></g>`).join(""),
      view: "4 96 192 70" },
    s_batcape: {
      back: `<path d="M70,120 Q100,112 130,120 Q156,166 156,204 L142,194 L130,206 L116,196 L100,208 L84,196 L70,206 L58,194 L44,204 Q44,166 70,120 Z" fill="#3a2a5a" ${O}/><path d="M78,128 Q100,122 122,128 Q142,166 142,190 L130,184 L116,192 L100,186 L84,192 L70,184 L58,190 Q58,166 78,128 Z" fill="#9a2a4a"/>`,
      front: `<circle cx="76" cy="126" r="6" fill="#c43a3f" ${O}/><circle cx="124" cy="126" r="6" fill="#c43a3f" ${O}/>`, view: "34 104 132 112" }
  };

  function render(look, eq) {
    look = { ...defaults, ...look };
    const p = slot => (eq[slot] && PARTS[eq[slot]]) || null;
    const back = p("back"), body = p("body"), head = p("head"), weapon = p("weapon"), hands = p("hands"), feet = p("feet");
    const pants = (body && body.pants) || shade(look.outfit, -0.55);
    let s = `<svg viewBox="0 -4 200 226" xmlns="http://www.w3.org/2000/svg" class="chibi">`;
    s += `<ellipse cx="100" cy="208" rx="44" ry="7" fill="${INK}" opacity=".28"/>`;
    if (back) s += back.back;
    s += hairBack(look);
    // Beine + Füße
    s += `<rect x="82" y="166" width="16" height="36" rx="7" fill="${pants}" ${O}/><rect x="102" y="166" width="16" height="36" rx="7" fill="${pants}" ${O}/>`;
    s += feet
      ? `<g transform="translate(88,204)">${feet.draw}</g><g transform="translate(112,204)">${feet.draw}</g>`
      : `<ellipse cx="88" cy="204" rx="12" ry="7" fill="#4a3428" ${O}/><ellipse cx="112" cy="204" rx="12" ry="7" fill="#4a3428" ${O}/>`;
    // Körper (lange Gewänder bekommen einen Rock über den Beinen)
    if (body && body.skirt) s += body.skirt;
    s += sleeves((body && body.sleeve) || (body && body.fill) || look.outfit);
    s += torso((body && body.fill) || look.outfit);
    s += body ? body.deco : `<path d="M90,119 L100,132 L110,119" fill="none" ${O}/><path d="M67,164 Q100,171 133,164 L134,172 Q100,180 66,172 Z" fill="#3b2a20" ${O}/><rect x="95" y="165" width="10" height="9" rx="2" fill="#ffcc4d" ${O}/>`;
    if (back && back.front) s += back.front;
    // Kopf
    s += `<rect x="92" y="108" width="16" height="16" rx="5" fill="${shade(look.skin, -0.12)}" ${O}/>`;
    s += `<ellipse cx="57" cy="94" rx="7" ry="9" fill="${look.skin}" ${O}/><ellipse cx="143" cy="94" rx="7" ry="9" fill="${look.skin}" ${O}/>`;
    s += `<ellipse cx="100" cy="84" rx="45" ry="41" fill="${look.skin}" ${O}/>`;
    s += face(look) + hairFront(look) + glasses(look);
    if (head) s += head.draw;
    // Waffe rechts, Hände, Schild links
    if (weapon && !weapon.left) s += `<g transform="translate(145,163) rotate(18)">${weapon.draw}</g>`;
    s += hands
      ? `<g transform="translate(56,164)">${hands.draw}</g><g transform="translate(144,164)">${hands.draw}</g>`
      : `<circle cx="56" cy="164" r="9" fill="${look.skin}" ${O}/><circle cx="144" cy="164" r="9" fill="${look.skin}" ${O}/>`;
    if (weapon && weapon.left) s += `<g transform="translate(50,166)">${weapon.draw}</g>`;
    return s + `</svg>`;
  }

  // Item einzeln zeichnen (für Kacheln, Shop, Beute-Popup)
  function icon(item) {
    const part = PARTS[item.id];
    if (!part) return `<span class="emoji-icon">${item.icon}</span>`;
    const svg = (view, inner) => `<svg viewBox="${part.view || view}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    switch (item.slot) {
      case "head": return svg("44 0 120 120", part.draw);
      case "body": return svg("44 104 112 92", sleeves(part.sleeve || part.fill || "#5b6cff") + torso(part.fill || "#5b6cff") + part.deco);
      case "back": return svg("44 96 112 92", part.back + (part.front || ""));
      case "weapon": return part.left ? svg("", part.draw) : svg("-60 -82 120 120", `<g transform="rotate(40 0 -22)">${part.draw}</g>`);
      case "hands": return svg("-30 -42 60 60", `<g transform="translate(-12,-6) rotate(-12)">${part.draw}</g><g transform="translate(12,-6) rotate(12)">${part.draw}</g>`);
      case "feet": return svg("-30 -34 60 46", `<g transform="translate(-12,0)">${part.draw}</g><g transform="translate(13,0)">${part.draw}</g>`);
    }
    return "";
  }

  return { name: "Chibi", options, palettes, defaults, render, icon };
})();
