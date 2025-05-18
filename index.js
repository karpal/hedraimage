import fs from 'fs/promises';
import chalk from 'chalk';
import generateImage from './generateImage.js';

// Utility delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Ambil item acak dari array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GENRES = [
  "spy flying over haunted mansion cellar minimalist style",
  "fantasy forest with dragons",
  "cyberpunk city at night",
  "space exploration futuristic art",
  "Steam-powered airship above foggy London, sepia photograph",
  "Clockwork owl perched on brass gear tower, intricate steampunk illustration",
  "Victorian detective in neon steampunk goggles, dramatic chiaroscuro",
  "Overgrown city streets with nature reclaiming skyscrapers, matte-painting style",
  "Solitary survivor with gas mask crossing desert highway, gritty concept art",
  "Broken mech half-buried in sand, sunset palette, melancholic mood",
  "Bioluminescent jellyfish forest in deep ocean, glowing dark ambience",
  "Ancient sunken temple guarded by sea turtles, photoreal 3-D render",
  "Steampunk submarine window view of colossal whale, vintage poster",
  "Greek goddess Artemis on moonlit cliff, classical painting",
  "Nordic valkyrie riding wolf across snowy tundra, high-detail fantasy",
  "Hindu Garuda soaring above Himalayas, vibrant traditional style",
  "Astronauts confronting bug-eyed alien on red planet, 1950s pulp cover",
  "Chrome rocket launching from art-deco spaceport, bold primary colors",
  "Ray-gun duel under twin suns, vintage comic flair",
  "Sun-dappled rustic kitchen with fresh bread, warm soft focus",
  "Fox napping in flower-filled meadow, dreamy pastel watercolor",
  "Old stone cottage covered in ivy, evening lantern glow",
  "Samurai crossing red Torii gate in snowfall, ukiyo-e woodblock",
  "Ancient Chinese mountain monastery among mist, Xieyi ink wash",
  "K-pop idol cyber samurai on neon Seoul rooftop, mash-up style",
  "Alchemist’s desk cluttered with glowing potions, moody candlelight",
  "Students dueling with arcane sigils in gothic courtyard, cinematic",
  "Secret library staircase spiraling into darkness, enchanted dust motes",
  "Formula 1 car drifting on neon Tron track, motion blur",
  "Snowboarder launching off cliff under northern lights, GoPro angle",
  "Sleek futuristic motorcycle racing through desert canyon, dynamic comic",
  "Galaxy-glazed doughnut on reflective surface, macro photography",
  "Sushi platter arranged like colorful mandala, top-down minimalism",
  "Matcha latte with 3-D foam art dragon, cozy café scene"
];

async function loadTokens() {
  const data = await fs.readFile('./tokens.json', 'utf-8');
  return JSON.parse(data);
}

async function runBatches(batchSize = 1, intervalMs = 60000) {
  const tokens = await loadTokens();

  if (!tokens.length) {
    console.error(chalk.red('Error: tokens.json kosong atau tidak valid.'));
    process.exit(1);
  }

  let tokenIndex = 0;

  while (true) {
    const prompts = Array.from({ length: batchSize }, () => pickRandom(GENRES));

    for (const prompt of prompts) {
      const token = tokens[tokenIndex];
      tokenIndex = (tokenIndex + 1) % tokens.length;

      try {
        console.log(chalk.blue(`Generating prompt: "${prompt}"`));
        await generateImage(token, prompt);
        console.log(chalk.green(`✓ Success: "${prompt}"`));
      } catch (err) {
        console.error(chalk.red(`✗ Error saat generateImage: ${err.message}`));
      }
    }

    console.log(chalk.yellow(`Batch selesai: ${batchSize} gambar dibuat. Menunggu ${intervalMs / 1000}s...\n`));
    await sleep(intervalMs);
  }
}

const [, , argBatchSize, argInterval] = process.argv;
const batchSize = (Number(argBatchSize) > 0) ? Number(argBatchSize) : 1;
const intervalMs = (Number(argInterval) > 0) ? Number(argInterval) : 60000;

runBatches(batchSize, intervalMs).catch(console.error);
