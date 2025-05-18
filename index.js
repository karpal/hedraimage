import fs from 'fs/promises';

import generateImage from './generateImage.js';

async function loadTokens() {
  const data = await fs.readFile('./tokens.json', 'utf-8');
  return JSON.parse(data);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const tokens = await loadTokens();

  // Keyword/genre input dari user (bisa ganti ini dengan argumen CLI atau input lain)
  const genres = [
    "spy flying over haunted mansion cellar minimalist style",
    "fantasy forest with dragons",
    "cyberpunk city at night",
    "space exploration futuristic art"
    // ✨ Steampunk & Viktorian
"Steam-powered airship above foggy London, sepia photograph",
"Clockwork owl perched on brass gear tower, intricate steampunk illustration",
"Victorian detective in neon steampunk goggles, dramatic chiaroscuro",

// 🛸 Post-apokaliptik & dystopia
"Overgrown city streets with nature reclaiming skyscrapers, matte-painting style",
"Solitary survivor with gas mask crossing desert highway, gritty concept art",
"Broken mech half-buried in sand, sunset palette, melancholic mood",

// 🌊 Bawah laut
"Bioluminescent jellyfish forest in deep ocean, glowing dark ambience",
"Ancient sunken temple guarded by sea turtles, photoreal 3-D render",
"Steampunk submarine window view of colossal whale, vintage poster",

// 🐉 Mitologi dunia
"Greek goddess Artemis on moonlit cliff, classical painting",
"Nordic valkyrie riding wolf across snowy tundra, high-detail fantasy",
"Hindu Garuda soaring above Himalayas, vibrant traditional style",

// 🚀 Retro pulp sci-fi
"Astronauts confronting bug-eyed alien on red planet, 1950s pulp cover",
"Chrome rocket launching from art-deco spaceport, bold primary colors",
"Ray-gun duel under twin suns, vintage comic flair",

// 🌿 Cozy & cottagecore
"Sun-dappled rustic kitchen with fresh bread, warm soft focus",
"Fox napping in flower-filled meadow, dreamy pastel watercolor",
"Old stone cottage covered in ivy, evening lantern glow",

// 🏯 Asia timur klasik
"Samurai crossing red Torii gate in snowfall, ukiyo-e woodblock",
"Ancient Chinese mountain monastery among mist, Xieyi ink wash",
"K-pop idol cyber samurai on neon Seoul rooftop, mash-up style",

// 🔮 Magic dark academia
"Alchemist’s desk cluttered with glowing potions, moody candlelight",
"Students dueling with arcane sigils in gothic courtyard, cinematic",
"Secret library staircase spiraling into darkness, enchanted dust motes",

// 🏎️ Speed & sport
"Formula 1 car drifting on neon Tron track, motion blur",
"Snowboarder launching off cliff under northern lights, GoPro angle",
"Sleek futuristic motorcycle racing through desert canyon, dynamic comic",

// 🍣 Makanan artistik
"Galaxy-glazed doughnut on reflective surface, macro photography",
"Sushi platter arranged like colorful mandala, top-down minimalism",
"Matcha latte with 3-D foam art dragon, cozy café scene"
];

  let idxToken = 0;
  let idxGenre = 0;

  // Loop scheduler, generate tiap 1 menit
  while (true) {
    const token = tokens[idxToken];
    const prompt = genres[idxGenre];

    await generateImage(token, prompt);

    // Next token dan genre secara bergantian
    idxToken = (idxToken + 1) % tokens.length;
    idxGenre = (idxGenre + 1) % genres.length;

    // Delay 60 detik sebelum generate berikutnya
    await sleep(60000);
  }
}

main().catch(console.error);
