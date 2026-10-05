// Sav tekst sajta je na jednom mestu. Izmene ovde se automatski pojavljuju na sajtu.

export const site = {
  name: "Janko Visuals",
  email: "jankovisuals@gmail.com",
  calendly: "https://calendly.com/jankovisuals/30min",
  description:
    "Video koji izgleda tačno onako kako ste ga zamislili. VSL, igrane forme i animacije proizvoda za 10 dana.",
};

export const hero = {
  eyebrow: "VSL, igrane forme i animacije proizvoda",
  titleBefore: "Video koji izgleda ",
  titleEmphasis: "tačno",
  titleAfter: " onako kako ste ga zamislili.",
  sub: "Za 10 dana, bez agencijske cene.",
  proof: "4× veće konverzije za SANCREA Srbija",
};

export const works = {
  intro:
    "Svaki projekat počinje problemom klijenta, a završava se rezultatom koji može da se izmeri.",
  // youtube: ID videa iz linka (youtu.be/ID). Bez njega se prikazuje privremena ilustracija (scene).
  items: [
    {
      category: "Prezentaciona animacija",
      title: "Asserta",
      desc: "Tech Tailors. Aplikacija je postala jasna i onima koji nisu IT stručnjaci, a to je donelo veću prodaju.",
      ratio: "16 / 9",
      ratioLabel: "16:9",
      youtube: "JCNb1NS0M8k",
    },
    {
      category: "Showcase animacija",
      title: "Naziv projekta",
      desc: "Klijent. Šta je proizvod i šta je video promenio.",
      ratio: "16 / 9",
      ratioLabel: "16:9",
      duration: "00:00:45",
      scene: "product",
    },
    {
      category: "Igrana forma",
      title: "Naziv projekta",
      desc: "Klijent. Priča iza kampanje u dve rečenice.",
      ratio: "2.39 / 1",
      ratioLabel: "2.39:1",
      duration: "00:01:30",
      scene: "narrative",
    },
    {
      category: "Animacija aplikacije",
      title: "Naziv projekta",
      desc: "Klijent. Za društvene mreže.",
      ratio: "9 / 16",
      ratioLabel: "9:16",
      duration: "00:00:30",
      scene: "app",
      vertical: true,
    },
  ],
};

export const proof = {
  number: "4",
  line: "veće konverzije, dugoročno.",
  client: "SANCREA Srbija",
  clients: ["Tech Tailors", "Philips", "Tenderly"],
};

export const process = {
  title: "Gotov video za 10 dana.",
  intro: "Jedan razgovor, jasna cena i rok koji važi. Bez sastanaka radi sastanaka.",
  // track: red na vremenskoj liniji (1 ili 2), start i end: dani od 1 do 10.
  steps: [
    { name: "Razgovor i procena", track: 1, start: 1, end: 1 },
    { name: "Scenario i plan", track: 1, start: 2, end: 3 },
    { name: "Snimanje ili animacija", track: 1, start: 4, end: 7 },
    { name: "Montaža i kolor", track: 2, start: 6, end: 8 },
    { name: "Vaše izmene", track: 2, start: 9, end: 9 },
    { name: "Predaja", track: 1, start: 10, end: 10, final: true },
  ],
};

export const contact = {
  titleBefore: "Imate proizvod. Hajde da ga prikažemo ",
  titleEmphasis: "kako zaslužuje.",
};
