const data = [
  {c:"Hearts",s:"♡",n:"White Heart"},
  {c:"Hearts",s:"♥",n:"Black Heart"},
  {c:"Hearts",s:"ღ",n:"Heart Symbol"},
  {c:"Hearts",s:"❥",n:"Rotated Heart"},
  {c:"Stars",s:"✦",n:"Four Point Star"},
  {c:"Stars",s:"✧",n:"White Star"},
  {c:"Stars",s:"★",n:"Black Star"},
  {c:"Stars",s:"☆",n:"White Star"},
  {c:"Arrows",s:"➜",n:"Arrow"},
  {c:"Arrows",s:"➤",n:"Right Arrow"},
  {c:"Arrows",s:"⇢",n:"Arrow"},
  {c:"Arrows",s:"↗",n:"Up Right Arrow"},
  {c:"Flowers",s:"❀",n:"Flower"},
  {c:"Flowers",s:"✿",n:"Black Flower"},
  {c:"Flowers",s:"❁",n:"Flower"},
  {c:"Flowers",s:"❃",n:"Flower"},
  {c:"Crowns",s:"♛",n:"Queen Crown"},
  {c:"Crowns",s:"♕",n:"White Queen"},
  {c:"Crowns",s:"♚",n:"King Crown"},
  {c:"Crowns",s:"♔",n:"White King"},
  {c:"Faces",s:"ツ",n:"Smile"},
  {c:"Faces",s:"シ",n:"Happy Face"},
  {c:"Faces",s:"☻",n:"Smiling Face"},
  {c:"Faces",s:"㋡",n:"Smile Face"}
];


// GWEN EXTENDED UNICODE COLLECTION
const extraRanges = [
  [0x2600, 0x26FF, "Symbols"],
  [0x2700, 0x27BF, "Dingbats"],
  [0x2190, 0x21FF, "Arrows"],
  [0x25A0, 0x25FF, "Shapes"],
  [0x2200, 0x22FF, "Math"],
  [0x2B00, 0x2BFF, "More Arrows"]
];

const seen = new Set(data.map(item => item.s));

extraRanges.forEach(([start, end, category]) => {
  for (let cp = start; cp <= end; cp++) {
    const symbol = String.fromCodePoint(cp);
    if (/^\p{Assigned}$/u.test(symbol) && !seen.has(symbol)) {
      data.push({
        c: category,
        s: symbol,
        n: "Unicode U+" + cp.toString(16).toUpperCase()
      });
      seen.add(symbol);
    }
  }
});

const container = document.getElementById("symbols");
const search = document.getElementById("search");

let activeCategory = "All";

const categories = ["All", ...new Set(data.map(x => x.c))];

const tabs = document.createElement("div");
tabs.style.cssText =
  "display:flex;gap:9px;flex-wrap:wrap;margin-bottom:20px";

document.getElementById("categories")
  .insertBefore(tabs, container);

function renderTabs() {
  tabs.innerHTML = "";

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.style.cssText = `
      padding:11px 16px;
      border:0;
      border-radius:9px;
      background:${activeCategory === category ? "#ed654e" : "#fff"};
      color:#202321;
      font-weight:bold;
    `;

    btn.onclick = () => {
      activeCategory = category;
      renderTabs();
      renderSymbols();
    };

    tabs.appendChild(btn);
  });
}

function renderSymbols() {
  container.innerHTML = "";

  const query = search.value.toLowerCase();

  const filtered = data.filter(item => {
    const matchesCategory =
      activeCategory === "All" ||
      item.c === activeCategory;

    const matchesSearch =
      item.s.includes(query) ||
      item.n.toLowerCase().includes(query) ||
      item.c.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "symbol-card";

    const symbol = document.createElement("div");
    symbol.textContent = item.s;
    symbol.style.fontSize = "36px";

    const name = document.createElement("p");
    name.textContent = item.n;
    name.style.marginTop = "10px";

    const copy = document.createElement("small");
    copy.textContent = "TAP TO COPY";
    copy.style.cssText =
      "display:block;margin-top:12px;color:#ed654e";

    card.append(symbol, name, copy);

    card.onclick = async () => {
      try {
        await navigator.clipboard.writeText(item.s);
        copy.textContent = "COPIED ✓";
      } catch {
        const area = document.createElement("textarea");
        area.value = item.s;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
        copy.textContent = "COPIED ✓";
      }

      setTimeout(() => {
        copy.textContent = "TAP TO COPY";
      }, 1200);
    };

    container.appendChild(card);
  });

  if (!filtered.length) {
    container.textContent = "No symbols found.";
  }
}

search.addEventListener("input", renderSymbols);

renderTabs();
renderSymbols();
