'use client';

import { Stack, Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses, Tabs, Tab } from "@mui/material";
import { getColor, getColorName, getCssColor, getTextColor } from "../colors";
import { Fragment, useEffect, useRef, useState } from "react";
import { RankBadge, ServiceRecordPlaceholder } from "./ServiceRecordPlaceholder";
import { Emblem } from "./Emblem";
import { text } from "stream/consumers";
import { getTeamColor, getTeamName, getTeamTextColor } from "../utils/teams";
import { CarnageReport } from "../api/sunrise/carnage-report/schema";
import { formatSeconds, getGametypeName } from "../utils/gametype";
import { getDamageSourceCategory, getDamageSourceName } from "../api/sunrise/carnage-report/players";


export const PGCRBreakdown = ({report}: {report: CarnageReport}) => {
    const [value, setValue] = useState("CARNAGE");

    let foo = Object.fromEntries(
        report.players.map((player, index) => [index, [player.statistics.kills]])
    );

    return (
        <>
            <Tabs value={value} onChange={(e, v) => setValue(v)} aria-label="basic tabs example">
            <Tab label="Carnage" value="CARNAGE" />
            {/* <Tab label="Results" value="RESULTS" /> */}
            {/* <Tab label={getGametypeName(report.game_variant.game_engine)} value="GAMETYPE" /> */}
            <Tab label="Kill Breakdown" value="KILL_BREAKDOWN" />
            <Tab label="Field Stats" value="FIELD_STATS" />
            </Tabs>
            {value === "CARNAGE" && <Carnage report={report} />}
            {value === "GAMETYPE" && <KOTH report={report} />}
            {value === "FIELD_STATS" && <FieldStats report={report} />}
            {value === "KILL_BREAKDOWN" && <KillBreakdown report={report} />}
        </>
    )
}

const BreakdownTable = ({report, headings, players}: {report: CarnageReport, headings: string[], players: Record<number, (string | number)[]>}) => (
    <TableContainer component={Paper}>
        <Table size="small">
          <colgroup>
            <col width="1"/>
            {headings.map((_, index) => <col key={index} />)}
          </colgroup>
          <TableHead>
            <TableRow>
                <TableCell sx={{fontWeight: 'bold'}}>Player Name</TableCell>
                {headings.map((headings) => (
                    <TableCell sx={{fontWeight: 'bold'}} key={headings}>{headings}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {report.players.map((player, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Box gap={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Emblem 
                                    emblem={{
                                        primary: player.foreground_emblem,
                                        secondary: player.emblem_flags === 0,
                                        background: player.background_emblem,
                                        primaryColor: player.emblem_primary_color,
                                        secondaryColor: player.emblem_secondary_color,
                                        backgroundColor: player.emblem_background_color,
                                        armourPrimaryColor: player.primary_color,
                                    }} 
                                    size={25} 
                                />
                                {player.player_name}
                            </Box>
                            <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row', gap: 1}}>
                                {player.global_statistics_highest_skill}
                                <RankBadge rank={player.host_stats_global_rank} grade={player.host_stats_global_grade} size={25}/>
                            </Box>
                        </Box>
                    </TableCell>
                    {players[player.player_index].map((cell, index) => <TableCell key={index}>{cell}</TableCell>)}
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
)

const Carnage = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
            headings={[
                "Kills", 
                "Assists", 
                "Deaths", 
                "K/D Spread", 
                "Suicides", 
                "Betrayals", 
                "Score"
            ]}
            players={Object.fromEntries(
                report.players.map((player, index) => [index, [
                    player.statistics.kills,
                    player.statistics.assists,
                    player.statistics.deaths,
                    player.statistics.kills - player.statistics.deaths,
                    player.statistics.suicides,
                    player.statistics.betrayals,
                    player.score
                ]])
            )} 
        />
    )
}

const KillBreakdown = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
            headings={[
                "Weapon", 
                "Melee", 
                "Grenade", 
                "Vehicle",
                "Other",
                "Tool of Destruction"
            ]}
            players={Object.fromEntries(
                report.players.map((player, index) => {
                    let sortedDamageStats = player.damage_statistics.sort((a, b) => b.kills - a.kills);
                    let toolOfDestruction = '-';
                    if (sortedDamageStats.length > 0) {
                        toolOfDestruction = getDamageSourceName(sortedDamageStats[0].damage_source);
                    }

                    return [index, [
                        player.damage_statistics.filter(stat => getDamageSourceCategory(stat.damage_source) === 'WEAPON').reduce((acc, stat) => acc + stat.kills, 0),
                        player.damage_statistics.filter(stat => getDamageSourceCategory(stat.damage_source) === 'MELEE').reduce((acc, stat) => acc + stat.kills, 0),
                        player.damage_statistics.filter(stat => getDamageSourceCategory(stat.damage_source) === 'GRENADE').reduce((acc, stat) => acc + stat.kills, 0),
                        player.damage_statistics.filter(stat => getDamageSourceCategory(stat.damage_source) === 'VEHICLE').reduce((acc, stat) => acc + stat.kills, 0),
                        player.damage_statistics.filter(stat => getDamageSourceCategory(stat.damage_source) === 'OTHER').reduce((acc, stat) => acc + stat.kills, 0),
                        toolOfDestruction
                    ]]
                })
            )} 
        />
    )
}

const FieldStats = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
            headings={[
                "Headshots", 
                "Best Spree", 
                "Avg. Life", 
                "Medals",
                "Most Killed",
                "Most Killed By"
            ]}
            players={Object.fromEntries(
                report.players.map((player, index) => {
                    const totalMedals = Object.values(player.medals).reduce((acc, val) => acc + val, 0);
                    let sorted_kills = report.player_interactions
                        .filter(interaction => interaction.left_player_index === player.player_index)
                        .filter(interaction => interaction.killed > 0)
                        .sort((a, b) => b.killed - a.killed);
                    let sorted_killed_by = report.player_interactions
                        .filter(interaction => interaction.left_player_index === player.player_index)
                        .filter(interaction => interaction.killed_by > 0)
                        .sort((a, b) => b.killed_by - a.killed_by);
                    
                    let most_killed = sorted_kills.length > 0 ? report.players.filter(player => player.player_index === sorted_kills[0].right_player_index)[0].player_name : '-';
                    let most_killed_by = sorted_killed_by.length > 0 ? report.players.filter(player => player.player_index === sorted_killed_by[0].right_player_index)[0].player_name : '-';

                    return [index, [
                        player.medals.sniper_kill,
                        player.statistics.most_kills_in_a_row,
                        formatSeconds(player.statistics.seconds_alive / (player.statistics.deaths + 1)),
                        totalMedals,
                        most_killed,
                        most_killed_by,
                    ]]
                })
            )} 
        />
    )
}

const PlayerCells = ({player}: {player: CarnageReport['players'][0]}) => <>
    <TableCell sx={{paddingLeft: 1, paddingRight: 1}}>
        <Emblem 
        emblem={{
            primary: player.foreground_emblem,
            secondary: player.emblem_flags === 0,
            background: player.background_emblem,
            primaryColor: player.emblem_primary_color,
            secondaryColor: player.emblem_secondary_color,
            backgroundColor: player.emblem_background_color,
            armourPrimaryColor: player.primary_color,
        }} 
        size={25} 
        />
    </TableCell>
    <TableCell sx={{paddingLeft: 0}}>{player.player_name}</TableCell>
    <TableCell>
        <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row', gap: 1}}>
            {player.global_statistics_highest_skill}
            <RankBadge rank={player.host_stats_global_rank} grade={player.host_stats_global_grade} size={25}/>
        </Box>
    </TableCell>
</>

const KOTH = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
            headings={[
                "Time on Hill", 
                "Uncontested Time", 
                "Score"
            ]}
            players={Object.fromEntries(
                report.players.map((player, index) => [index, [
                    formatSeconds(player.statistics.king_time_on_hill), 
                    formatSeconds(player.statistics.king_total_control_time), 
                    player.score
                ]])
            )} 
        />
    )
}