// Zeichnet die Helden auf der Startseite (gleiche Figuren wie in der App)
(function () {
  const st = window.CharacterStyles && CharacterStyles.chibi; if (!st) return;
  const looks = [
    [{ hair: "spiky", hairColor: "#e8c26a", outfit: "#5b6cff" }, { weapon: "dagger", back: "backpack", feet: "boots" }],
    [{ hair: "long", hairColor: "#d9483b", skin: "#e0a777", eyes: "#3a9a5a" }, { head: "c_magehat", body: "c_magerobe", back: "c_magecape", weapon: "orb" }],
    [{ hair: "short", hairColor: "#2b2233", skin: "#b97a4f" }, { head: "c_knighthelm", body: "c_knightarmor", hands: "c_knightgloves", feet: "c_knightboots", weapon: "s_dragonshield" }],
    [{ hair: "bun", hairColor: "#ff8fc8", mouth: "grin" }, { head: "c_ninjamask", body: "c_ninjasuit", hands: "c_ninjagloves", feet: "c_ninjaboots", weapon: "s_flamesword" }]
  ];
  document.querySelectorAll("[data-heroes]").forEach(el => {
    el.innerHTML = looks.map(([look, gear]) => `<div>${st.render(look, gear)}</div>`).join("");
  });
})();
