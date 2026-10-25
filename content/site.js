// Sav tekst sajta je na jednom mestu. Izmene ovde se automatski pojavljuju na sajtu.

export const site = {
  name: "Janko Visuals",
  email: "jankovisuals@gmail.com",
  calendly: "https://calendly.com/jankovisuals/30min",
  description:
    "Video koji izgleda tačno onako kako ste ga zamislili. VSL, igrane forme i animacije proizvoda za 10 dana.",
};

export const hero = {
  titleBefore: "Video koji izgleda ",
  titleEmphasis: "tačno",
  titleAfter: " onako kako ste ga zamislili.",
};

export const works = {
  intro:
    "Svaki projekat počinje problemom klijenta, a završava se rezultatom koji može da se izmeri.",
  // youtube: ID videa iz linka (youtu.be/ID), ili video: fajl iz public/works sa poster slikom.
  // Na sajtu se prikazuju samo radovi koji imaju jedno od ta dva, redom kojim su ovde
  // navedeni. client: radovi istog klijenta se u feedu nikad ne slažu jedan uz drugi.
  items: [
    {
      category: "Reels",
      title: "Well Done",
      client: "Well Done",
      desc: "Steak House Well Done. Atmosfera restorana od kuhinje do stola, za društvene mreže.",
      ratio: "9 / 16",
      ratioLabel: "9:16",
      video: "/works/well-done.mp4",
      poster: "/works/well-done.jpg",
      vertical: true,
    },
    {
      category: "Reels",
      title: "Savršena venčanica",
      client: "LovelyBride",
      desc: "LovelyBride. Trenutak kada mlada pronađe svoju venčanicu, za društvene mreže salona.",
      ratio: "9 / 16",
      ratioLabel: "9:16",
      video: "/works/lovelybride.mp4",
      poster: "/works/lovelybride.jpg",
      vertical: true,
    },
    {
      category: "Stop motion",
      title: "Barske stolice",
      client: "SANCREA",
      desc: "SANCREA Srbija. Kolekcija barskih stolica u stop motion tehnici, kao katalog koji se gleda do kraja.",
      ratio: "9 / 16",
      ratioLabel: "9:16",
      video: "/works/sancrea-barske.mp4",
      poster: "/works/sancrea-barske.jpg",
      vertical: true,
    },
    {
      category: "Reels",
      title: "Veče uz živu svirku",
      client: "Well Done",
      desc: "Steak House Well Done. Muzika, hrana i gosti u jednom kadru, kao poziv na sledeće veče.",
      ratio: "9 / 16",
      ratioLabel: "9:16",
      video: "/works/well-done-2.mp4",
      poster: "/works/well-done-2.jpg",
      vertical: true,
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
