/*
const Request = require('request');
//const fs = require('fs');
const fs = require('fs-extra');
//const { firestore } = require('./firebase');

import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyBnKwZLXVt933ZY-OAjrLQKwCPVPof77qA",
    authDomain: "fantasy-gold.firebaseapp.com",
    databaseURL: "https://fantasy-gold.firebaseio.com",
    projectId: "fantasy-gold",
    storageBucket: "fantasy-gold.appspot.com",
    messagingSenderId: "255800072598",
    appId: "1:255800072598:web:d8ec7941c69ab4040aa5b7",
    measurementId: "G-CFYB7EFKCJ"
};

firebase.initializeApp(config);
window.firebase = firebase;
const firestore = firebase.firestore();

const baseUrl = `https://o8bbxwfg8k.execute-api.eu-west-1.amazonaws.com/dev/api/fpl_alerts_aws_live`;
const fplUrl = `https://fantasy.premierleague.com/api`;

const managers = ['6730061'];

const getFPLData = async (url) => {
    console.log(url)
    const request = {
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }
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
}

const getGameWeekManagers = async(gameWeek = false) => {
    const gameWeekData = await getGameWeekData(gameWeek);
    const gameCode = 'GJ-GW';
    const gameweekShowing = gameWeekData[1];

    const managersData = [];

    console.table('##########################################');
    console.table('##########################################');
    console.log(gameWeekData);
    const promises = managers.map((manager) => {
        return getFPLData(`${fplUrl}/entry/${manager}/event/${gameweekShowing}/picks/`)
    });

    const results = await Promise.all(promises).then(results => {

    });

    console.table('##########################################');
    console.table('##########################################');
    console.table('##########################################');
    console.table(results);

    console.table('##########################################');
    console.table('##########################################');
    /!*for (const manager of managers) {

    }
    const request = {
        url: fplUrl,
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
        /!*fs.ensureDirSync('data');
        fs.writeFileSync(`data/gameweekData.json`, JSON.stringify(result), 'binary');
        fs.writeFile("gameweekData.json", JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            }
            console.log('Managers sorted ');
        });*!/
        const playerPoints = await getWeekPlayersData(result.details);
        console.log(playerPoints)
        fs.ensureDirSync('data');
        fs.writeFileSync(`data/gameweekPlayersData.json`, JSON.stringify(playerPoints), 'binary');
        return playerPoints;
    }
    catch (err) {
        console.error(err);
    }*!/

    /!*const gameTableRef = firestore.collection(`2020Games/${gameCode}${gameweekShowing}/players`)
        //.orderBy('position')
        .onSnapshot((snapshot) => {
            const playersList =
                snapshot.docs.map(docSnapshot => docSnapshot.data());
            console.log(playersList);

            fs.ensureDirSync('data');
            fs.writeFileSync(`data/managers.json`, JSON.stringify(playersList), 'binary');
        }, (error) => {
            console.log(error);
        });*!/
};

const getManagersGameWeekPoints = async () => {
    const results = await getGameWeekData();


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
        console.log(players);
        playersData.push(...players)

    }
    console.table(playersData);

    return groupDataByField(playersData, 'plcode');
};

const getGameWeekData = async(gameWeek = false) => {
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
        /!*fs.ensureDirSync('data');
        fs.writeFileSync(`data/gameweekData.json`, JSON.stringify(result), 'binary');
        fs.writeFile("gameweekData.json", JSON.stringify(result), (err) => {
            if (err) {
                console.log(err);
            }
            console.log('Managers sorted ');
        });*!/
        const playerPoints = await getWeekPlayersData(result.details);
        console.log(playerPoints)
        //fs.ensureDirSync('data');
        //fs.writeFileSync(`data/gameweekPlayersData.json`, JSON.stringify(playerPoints), 'binary');
        return [playerPoints, result.status.gw];
    }
    catch (err) {
        console.error(err);
    }
};

getGameWeekManagers().then(() => console.log('it is over'));
*/
