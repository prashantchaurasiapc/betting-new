/**
 * parseGameSnapshot.js
 *
 * Mock OCR + normalization pipeline.
 * In production: replace simulateParse() with a real API call to
 * e.g. Google Vision API / AWS Textract / OpenAI GPT-4V.
 *
 * Flow:
 *   rawFile (File)  →  simulateParse()  →  GameSnapshot (DB object)
 */

/**
 * Known series lookup table for matching team codes extracted from image names / metadata.
 */
const SERIES_LOOKUP = {
  'PHX-OKC': {
    seriesId: 'west-1',
    homeTeam: { code: 'OKC', name: 'OKC Thunder', seed: 1 },
    awayTeam: { code: 'PHX', name: 'PHX Suns', seed: 8 },
    conference: 'West',
    round: 'First Round',
  },
  'OKC-PHX': {
    seriesId: 'west-1',
    homeTeam: { code: 'OKC', name: 'OKC Thunder', seed: 1 },
    awayTeam: { code: 'PHX', name: 'PHX Suns', seed: 8 },
    conference: 'West',
    round: 'First Round',
  },
  'DAL-LAC': {
    seriesId: 'west-2',
    homeTeam: { code: 'LAC', name: 'LAC Clippers', seed: 4 },
    awayTeam: { code: 'DAL', name: 'DAL Mavericks', seed: 5 },
    conference: 'West',
    round: 'First Round',
  },
  'BOS-MIA': {
    seriesId: 'east-1',
    homeTeam: { code: 'BOS', name: 'BOS Celtics', seed: 1 },
    awayTeam: { code: 'MIA', name: 'MIA Heat', seed: 8 },
    conference: 'East',
    round: 'First Round',
  },
  'NYK-PHI': {
    seriesId: 'east-2',
    homeTeam: { code: 'NYK', name: 'NYK Knicks', seed: 2 },
    awayTeam: { code: 'PHI', name: 'PHI 76ers', seed: 7 },
    conference: 'East',
    round: 'First Round',
  },
};

/**
 * Detect team codes and game number from the file name.
 * e.g. "PHX_vs_OKC_Game1_Final.png" → { seriesKey: "PHX-OKC", gameNumber: 1 }
 */
function extractFromFileName(fileName) {
  const upper = fileName.toUpperCase().replace(/[^A-Z0-9]/g, ' ');

  // Detect game number
  const gameMatch = upper.match(/GAME\s*(\d)/);
  const gameNumber = gameMatch ? parseInt(gameMatch[1]) : 1;

  // Detect team codes from known list
  const teamCodes = ['PHX', 'OKC', 'DAL', 'LAC', 'BOS', 'MIA', 'NYK', 'PHI'];
  const found = teamCodes.filter(code => upper.includes(code));

  let seriesKey = null;
  if (found.length >= 2) {
    // Try both orderings
    const key1 = `${found[0]}-${found[1]}`;
    const key2 = `${found[1]}-${found[0]}`;
    seriesKey = SERIES_LOOKUP[key1] ? key1 : (SERIES_LOOKUP[key2] ? key2 : null);
  }

  return { seriesKey, gameNumber };
}

/**
 * Build a normalized GameSnapshot object.
 */
function buildSnapshot({ seriesKey, gameNumber, rawImageUrl, fileName }) {
  const series = seriesKey ? SERIES_LOOKUP[seriesKey] : null;

  // Fallback: default to PHX vs OKC if can't detect
  const resolved = series || SERIES_LOOKUP['PHX-OKC'];
  const resolvedKey = series ? seriesKey : 'PHX-OKC';

  // Game-specific mock scores (Game 1 defaults for PHX@OKC context)
  const MOCK_GAME_DATA = {
    1: { homeScore: 124, awayScore: 118, status: 'Final', date: 'Apr 19' },
    2: { homeScore: 102, awayScore: 112, status: 'Final', date: 'Apr 22' },
    3: { homeScore: 126, awayScore: 109, status: 'Final', date: 'Apr 24' },
    4: { homeScore: 105, awayScore: 98,  status: 'Final', date: 'Apr 26' },
    5: { homeScore: null, awayScore: null, status: 'Upcoming', date: 'Tonight 7:30 PM ET' },
    6: { homeScore: null, awayScore: null, status: 'Scheduled', date: 'May 4' },
    7: { homeScore: null, awayScore: null, status: 'Scheduled', date: 'May 6' },
  };

  const gd = MOCK_GAME_DATA[gameNumber] || MOCK_GAME_DATA[1];
  const homeTeam = { ...resolved.homeTeam, score: gd.homeScore };
  const awayTeam = { ...resolved.awayTeam, score: gd.awayScore };

  const winner =
    gd.homeScore !== null && gd.awayScore !== null
      ? gd.homeScore > gd.awayScore
        ? resolved.homeTeam.code
        : resolved.awayTeam.code
      : null;

  const id = `${resolved.awayTeam.code}-${resolved.homeTeam.code}-g${gameNumber}`;

  return {
    id,
    seriesId: resolved.seriesId,
    gameLabel: `Game ${gameNumber}`,
    gameNumber,
    date: gd.date,
    status: gd.status,
    homeTeam,
    awayTeam,
    winner,
    source: 'upload',
    rawImageUrl,
    fileName,
    conference: resolved.conference,
    round: resolved.round,
    parsedAt: new Date().toISOString(),
    contextFilters: {
      seriesCode: `${resolved.awayTeam.code}@${resolved.homeTeam.code}`,
      gameLabel: `Game ${gameNumber}`,
    },
  };
}

/**
 * Main parse function.
 * Takes a File, returns a Promise<GameSnapshot>.
 *
 * Replace the simulated delay with a real API call in production.
 */
export async function parseGameSnapshot(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const rawImageUrl = e.target.result; // base64 data URL
        const { seriesKey, gameNumber } = extractFromFileName(file.name);

        // ── Production hook ───────────────────────────────────────────────────
        // const apiResult = await callOCRApi(rawImageUrl);
        // const { seriesKey, gameNumber } = apiResult;
        // ─────────────────────────────────────────────────────────────────────

        // Simulate processing delay (400-900ms)
        const delay = 400 + Math.random() * 500;
        setTimeout(() => {
          try {
            const snapshot = buildSnapshot({
              seriesKey,
              gameNumber,
              rawImageUrl,
              fileName: file.name,
            });
            resolve(snapshot);
          } catch (err) {
            reject(new Error('Failed to build game snapshot: ' + err.message));
          }
        }, delay);
      } catch (err) {
        reject(new Error('Failed to read file: ' + err.message));
      }
    };

    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export { SERIES_LOOKUP };
