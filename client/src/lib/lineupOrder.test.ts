/**
 * Unit tests for lineupOrder (sortLineupPlayers / getSector).
 * Run: npx tsx client/src/lib/lineupOrder.test.ts
 */
import { getSector, sortLineupPlayers, type LineupPlayer } from './lineupOrder';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function deepEqual<T>(a: T, b: T, msg?: string) {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  assert(ok, msg ?? `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// --- getSector (normalize position to GK/DEF/MID/ATT) ---
assert(getSector('Goalkeeper') === 'GK', 'Goalkeeper -> GK');
assert(getSector('GK') === 'GK', 'GK -> GK');
assert(getSector('Centre-Back') === 'DEF', 'Centre-Back -> DEF');
assert(getSector('Left-Back') === 'DEF', 'Left-Back -> DEF');
assert(getSector('CB') === 'DEF', 'CB -> DEF');
assert(getSector('Central Midfield') === 'MID', 'Central Midfield -> MID');
assert(getSector('CM') === 'MID', 'CM -> MID');
assert(getSector('Centre-Forward') === 'ATT', 'Centre-Forward -> ATT');
assert(getSector('ST') === 'ATT', 'ST -> ATT');
assert(getSector(null) === 'ATT', 'null -> ATT (fallback)');
assert(getSector('') === 'ATT', 'empty string -> ATT');

// --- sortLineupPlayers: GK first, then DEF, MID, ATT ---
const unsorted: LineupPlayer[] = [
  { playerId: 'a', name: 'Striker', position: 'ST', shirtNumber: 9 },
  { playerId: 'b', name: 'Keeper', position: 'Goalkeeper', shirtNumber: 1 },
  { playerId: 'c', name: 'Centre-Back', position: 'Centre-Back', shirtNumber: 5 },
  { playerId: 'd', name: 'Mid', position: 'CM', shirtNumber: 8 },
];
const sorted = sortLineupPlayers(unsorted);
assert(sorted[0].playerId === 'b', 'First must be GK');
assert(sorted[1].playerId === 'c', 'Second must be DEF');
assert(sorted[2].playerId === 'd', 'Third must be MID');
assert(sorted[3].playerId === 'a', 'Fourth must be ATT');

// --- sortLineupPlayers: does not mutate input ---
const copy: LineupPlayer[] = [
  { playerId: 'x', name: 'A', position: 'ATT', shirtNumber: 11 },
  { playerId: 'y', name: 'G', position: 'GK', shirtNumber: 1 },
];
const out = sortLineupPlayers(copy);
assert(copy[0].playerId === 'x', 'Input array unchanged (first)');
assert(out[0].playerId === 'y', 'Output sorted (GK first)');

console.log('✅ All lineupOrder tests passed.');