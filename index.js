import fs from 'fs/promises';
import chalk from 'chalk';
import readline from 'readline';
import generateImage from './generateImage.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInterval(minMs, maxMs) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
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

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function run(loopCount) {
  let tokens = await loadTokens();

  if (!tokens.length) {
    console.error(chalk.red('Error: tokens.json kosong atau tidak valid.'));
    process.exit(1);
  }

  let tokenIndex = 0;
  let failedTokens = new Set();

  for (let i = 0; i < loopCount; i++) {
    if (tokens.length === 0) {
      console.error(chalk.red('Semua token habis atau gagal, berhenti generate.'));
      process.exit(1);
    }

    const prompt = pickRandom(GENRES);
    let token = tokens[tokenIndex];

    try {
      console.log(chalk.blue(`Generating prompt (${i + 1}/${loopCount}): "${prompt}"`));
      await generateImage(token, prompt);
      console.log(chalk.green(`✓ Success: "${prompt}"`));
    } catch (err) {
      console.error(chalk.red(`✗ Error saat generateImage: ${err.message}`));
      console.log(chalk.yellow(`Token dah habis bang.`));
      failedTokens.add(token);
      tokens = tokens.filter(t => !failedTokens.has(t));

      if (tokens.length === 0) {
        console.error(chalk.red('Semua token habis, berhenti generate.'));
        process.exit(1);
      }
      tokenIndex = tokenIndex % tokens.length;
      i--;
      await sleep(5000);
      continue;
    }

    tokenIndex = (tokenIndex + 1) % tokens.length;

    if (i < loopCount - 1) {
      const waitTime = randomInterval(10000, 30000);
      console.log(chalk.cyan(`Gambar selesai dibuat. Menunggu ${waitTime / 1000}s sebelum generate berikutnya...\n`));
      await sleep(waitTime);
    }
  }
}

async function main() {
  const input = await askQuestion('Masukkan jumlah gambar yang ingin dibuat: ');
  const loopCount = parseInt(input, 10);

  if (isNaN(loopCount) || loopCount <= 0) {
    console.log(chalk.red('Input tidak valid, menggunakan default 5 gambar.'));
    await run(5);
  } else {
    await run(loopCount);
  }
}

main().catch(console.error);
