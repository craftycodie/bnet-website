import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";

const CarnageReportPlayerSchema = z.object({
    player_name: z.string(),
    highest_skill: z.number(),
    rank: z.number(),
    grade: z.number(),
    place: z.number(),
    score: z.number(),
    primary_color: z.number(),
    secondary_color: z.number(),
    tertiary_color: z.number(),
    emblem_primary_color: z.number(),
    emblem_secondary_color: z.number(),
    emblem_background_color: z.number(),
    foreground_emblem: z.number(),
    background_emblem: z.number(),
  });
  
  const CarnageReportSchema = z.object({
    start_time: z.string(), // ISO 8601 format validation
    finish_time: z.string(),
    game_variant_name: z.string().nullable(),
    map_variant_name: z.string().nullable(),
    map_id: z.number().nullable(),
    hopper_name: z.string().nullable(),
    game_engine: z.number(),
    file_type: z.number(),
    duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Must be in HH:MM:SS format"),
    players: z.array(CarnageReportPlayerSchema),
  });

export const getCarnageReport = publicProcedure.input(
    z.object({ id: z.string().uuid() })
).query(async (opts) => {
    const response = await sunrise2Axios.get(`/blamnet/stats/halo3/carnage-reports/${opts.input.id}`);
    console.log({headers: response.headers});
    console.log({response: response.data});
    const data = CarnageReportSchema.parse(JSON.parse(response.data));
    return data;
});