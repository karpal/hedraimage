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
