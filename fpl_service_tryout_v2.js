const fs = require('fs-extra');
const Request = require('request');

const baseUrl = `https://o8bbxwfg8k.execute-api.eu-west-1.amazonaws.com/dev/api/fpl_alerts_aws_live`;
const fplUrl = `https://fantasy.premierleague.com/api`;

const admin = require("firebase-admin");
const serviceAccount = require('./fantasy-gold-firebase-adminsdk-klt28-6a7768e941.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fantasy-gold.firebaseio.com"
});
const firestore = admin.firestore();

const getFPLData = async (url) => {
    const request = {
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    try {
        let response = await (new Promise(function (resolve, reject) {
            Request(request, function (error, res, body) {
                if (!error && res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 203)) {
                    resolve(body)
                } else {
                    reject(body);
                }
            })
        }));
        const result = response ? JSON.parse(response) : null;
        return result
    }
    catch (err) {
        console.error(err);
    }
};

const getManager = async (id) => {
    //const url = `${fplUrl}/api/entry/${id}/event/${GAMEWEEK}/picks/`;
    const url = `${fplUrl}/entry/${id}/`;

    return getFPLData(url);
};

const getManagerJson = (data) => {
    //change this when real scores start coming
    const points = data.summary_event_points;
    //const points = 0
    const name = `${data.player_first_name} ${data.player_last_name}`;
    const country = data.player_region_name;
    const teamName = data.name;
    const teamId = data.id.toString();
    return { name, teamId, teamName, country, points };
};

const groupDataByField = async (data, key) => {
    return data.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

const getWeekPlayersData = async (weekGamesData) => {
    const playersData = [];

    for (const game of weekGamesData) {
        const home = game['players']['h'];
        const away = game['players']['a'];

        const players = [...home, ...away];
        playersData.push(...players)
    }

    return groupDataByField(playersData, 'plcode');
};

const getAllManagers = async (id) => {
    try {
        const manager = await getManager(id);
        return getManagerJson(manager);
    } catch (exception) {
        console.log(`problem ${exception}`, id);
    }
};

const managers = async (gameweek = false) => {
    const gameweekName = gameweek ? `BTS-GW${gameweek}` : 'BTS-GW33';
    const gameRef = firestore.collection(`2020Games/${gameweekName}/players`);
    let ids = [];
    let managers = [];

    await gameRef.get().then(snapshot => {
        if (snapshot.empty) {
            console.log('Empty');
            return
        }
        snapshot.forEach(doc => {
            ids.push(doc.id)
        });
        console.log('Num managers:', ids.length)
    }).catch(error => console.error(error));


    const promises = ids.map(getAllManagers);
    await Promise.all(promises).then(results => {
        managers = [...results];
    });

    return managers;
};

const checkPoints = (player, weekData, isCaptainPlayed) => {
    let points = parseFloat(weekData.wk_pts);

    if (player.is_captain){
        points *= 2;
    } else if (player.is_vice_captain && !isCaptainPlayed) {
        points *= 2;
    }

    return points;
};

const getTeamGameWeekDetails = async (manager, players, GAMEWEEK, bootstrapData) => {
    let elements = [];
    let points = 0;
    let isCaptainPlayed = true;
    const weekPicks = await getFPLData(`${fplUrl}/entry/${manager.teamId}/event/${GAMEWEEK}/picks/`);


    for (const pick of (weekPicks.picks).slice(0, 11)) {
        let player = bootstrapData.filter(item => item.id === pick.element);

        if(player.length){
            player = player[0];
            //elements.push(players[player.code][0]);
            const activePlayer = players[player.code];


            if (activePlayer === undefined) {
                if (pick.is_captain){
                    isCaptainPlayed = false;
                }
                //points += 0;
            }else {
                elements.push(players[player.code][0]);

                points += checkPoints(pick, players[player.code][0], isCaptainPlayed);
                //points += player.isCaptain ? parseFloat(players[player.code][0].wk_pts) * 2 : parseFloat(players[player.code][0].wk_pts);
            }

        }
    }

    return {
        name: manager.name,
        teamId: manager.teamId,
        teamName: manager.name,
        country: manager.country,
        points
    };
};

const getGameWeekData = async(gameWeek = false) => {
    const managersData = await managers(gameWeek);
    let playersData = {};
    let formattedWeekData = [];

    const request = {
        url: gameWeek ? `${baseUrl}/${gameWeek}` : baseUrl,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        let response = await (new Promise(function (resolve, reject) {
            Request(request, function (error, res, body) {
                if (!error && res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 203)) {
                    resolve(body)
                } else {
                    reject(body);
                }
            })
        }));
        const result = response ? JSON.parse(response) : null;

        const playerPoints = await getWeekPlayersData(result.details);
        playersData = {...playerPoints};

        const bootstrapData = await getFPLData(`${fplUrl}/bootstrap-static/`);

        const promises = managersData.map((manager) => getTeamGameWeekDetails(manager, playersData, result.status.gw, bootstrapData.elements));
        await Promise.all(promises).then(results => {
            formattedWeekData = [...results];
        });

        fs.writeFileSync(`data/finalData.json`, JSON.stringify(formattedWeekData), 'binary');
    } catch (err) {
        console.error(err);
    }
};

getGameWeekData().then(() => console.log('I AM DONE'));
