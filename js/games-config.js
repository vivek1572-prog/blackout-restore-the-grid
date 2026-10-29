/**
 * BLACKOUT: RESTORE THE GRID
 * Centralized Game Configuration
 * Sphinx @ MNIT Jaipur
 *
 * MANDATORY ARCHITECTURAL REQUIREMENT:
 * This file is the single structured source of truth for the five temporary game entries.
 * When game requirements are confirmed, game titles, descriptions, and settings can be
 * updated here without rewriting the website markup or shared layout components.
 */

export const GAMES_CONFIG = [
  {
    id: "game-01",
    slot: "01",
    name: "Game 01",
    status: "Specification Pending",
    description: "Placeholder — Game concept, rules, and technical mechanics are unconfirmed.",
    leaderboardInfo: "Dedicated Leaderboard (Game 01)",
    structureInfo: "No stage-wise leaderboards"
  },
  {
    id: "game-02",
    slot: "02",
    name: "Game 02",
    status: "Specification Pending",
    description: "Placeholder — Game concept, rules, and technical mechanics are unconfirmed.",
    leaderboardInfo: "Dedicated Leaderboard (Game 02)",
    structureInfo: "No stage-wise leaderboards"
  },
  {
    id: "game-03",
    slot: "03",
    name: "Game 03",
    status: "Specification Pending",
    description: "Placeholder — Game concept, rules, and technical mechanics are unconfirmed.",
    leaderboardInfo: "Dedicated Leaderboard (Game 03)",
    structureInfo: "No stage-wise leaderboards"
  },
  {
    id: "game-04",
    slot: "04",
    name: "Game 04",
    status: "Specification Pending",
    description: "Placeholder — Game concept, rules, and technical mechanics are unconfirmed.",
    leaderboardInfo: "Dedicated Leaderboard (Game 04)",
    structureInfo: "No stage-wise leaderboards"
  },
  {
    id: "game-05",
    slot: "05",
    name: "Game 05",
    status: "Specification Pending",
    description: "Placeholder — Game concept, rules, and technical mechanics are unconfirmed.",
    leaderboardInfo: "Dedicated Leaderboard (Game 05)",
    structureInfo: "No stage-wise leaderboards"
  }
];

export function getGameById(id) {
  if (!id) return null;
  return GAMES_CONFIG.find(game => game.id.toLowerCase() === id.toLowerCase()) || null;
}
