import { z } from "zod";

// Statistics schema
export const StatisticsSchema = z.object({
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  unused0: z.number(),
  unused1: z.number(),
  unused2: z.number(),
  suicides: z.number(),
  total_wp: z.number(),
  betrayals: z.number(),
  games_won: z.number(),
  games_tied: z.number(),
  rounds_won: z.number(),
  games_played: z.number(),
  king_unused0: z.number(),
  king_unused1: z.number(),
  seconds_alive: z.number(),
  vip_takedowns: z.number(),
  ctf_flag_grabs: z.number(),
  in_round_score: z.number(),
  oddball_unused: z.number(),
  vip_guard_time: z.number(),
  ctf_flag_scores: z.number(),
  games_completed: z.number(),
  vip_time_as_vip: z.number(),
  ctf_flag_returns: z.number(),
  juggernaut_kills: z.number(),
  rounds_completed: z.number(),
  vip_kills_as_vip: z.number(),
  vip_lives_as_vip: z.number(),
  assault_bomb_arms: z.number(),
  juggernaut_unused: z.number(),
  king_time_on_hill: z.number(),
  territories_ousts: z.number(),
  territories_owned: z.number(),
  assault_bomb_grabs: z.number(),
  in_game_total_score: z.number(),
  most_kills_in_a_row: z.number(),
  assault_bomb_disarms: z.number(),
  infection_infections: z.number(),
  territories_captures: z.number(),
  ctf_flag_carrier_kills: z.number(),
  infection_zombie_kills: z.number(),
  oddball_time_with_ball: z.number(),
  infection_time_as_human: z.number(),
  king_total_control_time: z.number(),
  assault_bomb_detonations: z.number(),
  oddball_kills_as_carrier: z.number(),
  oddball_ball_carrier_kills: z.number(),
  juggernaut_total_control_time: z.number(),
  territories_time_in_territory: z.number(),
  juggernaut_kills_as_juggernaut: z.number(),
});
