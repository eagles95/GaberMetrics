//----------------Imports-------------------
const express = require("express");
const router = express.Router();
const request = require('request');

//----------------Constants-----------------
const apiUrl = "http://statsapi.mlb.com:80/api/v1/";

//----------------Routes--------------------

//todays games
router.get('/games', (req, res, next) => {
    let gamesPromise = requestGames();
    gamesPromise.then(gamesData => {
        res.json(getGames(gamesData));
    })
        .catch(err => res.json({ error: "CouldNotFetchData", detail: err }));
});

//games from certain date
router.get('/games/:date', (req, res, next) => {
    let gamesPromise = requestGames(req.params.date);
    gamesPromise.then(gamesData => {
        res.json(getGames(gamesData));
    })
        .catch(err => res.json({ error: "InvalidDate", detail: err }));
});


//----------------API Parsing----------------

function getGames(gamesData) {
    //returned Json
    returnObj = {};
    //Total Games and games in progress
    returnObj.totalGames = gamesData.totalGames;
    returnObj.totalGamesInProgress = gamesData.totalGamesInProgress;

    //gamesArray
    let gamesArray = getGamesArray(gamesData.dates[0].games);
    returnObj.games = gamesArray;

    return returnObj;
}

/**
 * GET request to MLB api games for date
 */
function requestGames(date = "") {
    url = apiUrl + "schedule?sportId=1&date=" + date + "&hydrate=linescore(runners),decisions,probablePitcher,stats&useLatestGames=false&language=en";
    return new Promise((resolve, reject) => {
        request({ url: url, json: true }, (error, response, body) => {
            if (error) {
                resolve(error);
            } else {
                resolve(body);
            }
        })
    })
}

/**
 * get games info: status,team info, game current state, decisions
 */
function getGamesArray(data) {
    let numGames = data.length;
    games = [];
    for (let i = 0; i < numGames; i++) {
        games[i] = {};
        games[i].date = data[i].gameDate;
        games[i].state = data[i].status.detailedState;
        games[i].statusCode = getStatusCode(data[i].status.detailedState);
        games[i].teams = getTeamsFromGame(data[i].teams);
        if (games[i].statusCode == 1) {
            games[i].live = getLive(data[i].linescore);
        }
        if (games[i].statusCode == 0) {
            games[i].decison = getDecision(data[i].decisions);
        }
    }
    return games;
}

function getLive(linescore) {
    live = {};
    live.Inning = linescore.currentInning;
    live.isTop = linescore.isTopInning;
    live.outs = linescore.outs;
    let bases = ["first", "second", "third"];
    for (let i = 0; i < 3; i++) {
        if (linescore.offense[bases[i]] === undefined) {
            live[bases[i]] = false;
        }
        else {
            live[bases[i]] = true;
        }
    }
    return live;
}

function getDecision(decisionData) {
    decision = {}
    decision.winner = decisionData.winner.fullName;
    decision.loser = decisionData.loser.fullName;
    if (decisionData.save != undefined) {
        decision.save = decisionData.save.fullName;
    }
    return decision;
}
/**
 * get info from both home and away teams
 */
function getTeamsFromGame(teamsData) {
    let teams = {};
    let homeAway = ["home", "away"];
    for (let i = 0; i < homeAway.length; i++) {
        teams[homeAway[i]] = {};
        teams[homeAway[i]].name = teamsData[homeAway[i]].team.name;
        teams[homeAway[i]].id = teamsData[homeAway[i]].team.id;
        teams[homeAway[i]].record = teamsData[homeAway[i]].leagueRecord;
        teams[homeAway[i]].isWinner = teamsData[homeAway[i]].isWinner;
        teams[homeAway[i]].score = teamsData[homeAway[i]].score;
        if (teamsData[homeAway[i]].probablePitcher === undefined) {
            teams[homeAway[i]].starter = "TBA";
        }
        else {
            teams[homeAway[i]].starter = getStarterInfo(teamsData[homeAway[i]].probablePitcher);
        }
    }
    return teams;
}


/**
 * Gets name, wins, losses, era from probable starters
 */
function getStarterInfo(pitcherData) {
    let pitcher = {};
    let fullName = pitcherData.fullName.split(",")
    let pitcherStats = pitcherData.stats[(pitcherData.stats.length) - 1].stats;
    pitcher.name = fullName[1].trim() + " " + fullName[0];
    pitcher.wins = pitcherStats.wins;
    pitcher.losses = pitcherStats.losses;
    pitcher.era = pitcherStats.era;
    return pitcher;
}

/**
 * getGameCodes
 * 0 - game ended
 * 1 - game is live
 * 2 - game not ended/delayed
 * 3 - game didnt start
*/
function getStatusCode(gameState) {
    if (gameState == "In Progress") {
        return 1;
    }
    else if (gameState == "Final" || gameState == "Game Over") {
        return 0;
    }
    else if (gameState == "Postponed" || gameState == "Delayed" || gameState == "Delayed Start") {
        return 2;
    }
    else {
        return 3;
    }
}

//----------------Exports--------------------
module.exports = router;