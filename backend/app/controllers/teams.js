const Team = require('../models/team');
const {FLAGS} = require('../utils/constant');
const {generateUUID} = require('../utils/shared');
const {createAccessToken} = require('../utils/jwt')

async function createTeam(req, res) {

    try {
        
        const teamAlreadyName = await Team.findOne({
            where: {
                name_team: req.body.name_team,
                id_session: req.body.id_session
            }
        });

        if(teamAlreadyName) return res.status(400).json({error: 'Team already has been created'});

        const idTeam = generateUUID(10);
        const teamCreated = await Team.create({
            name_team: req.body.name_team,
            id_team: idTeam,
            prop_piece: req.body.prop_piece,
            score_game: 0,
            status: true,
            players: req.body.players,
            id_session: req.body.id_session,
            flag_active: req.body.flag_active,
            prev_position: 1,
            position_active: 1
        });

        if(!teamCreated) return res.status(400).json({error: 'Error creando el equipo '+req.body.name_team});

        const token = await createAccessToken({
            idTeam: teamCreated.id_team,
            teamName: teamCreated.name_team,
            prop_piece: teamCreated.prop_piece,
            idRoom: teamCreated.id_session
        });

        res.status(200).json({idRoom: teamCreated.id_session, idTeam: teamCreated.id_team, teamName: teamCreated.name_team, token}); 
        
    } catch (err) {
        return res.status(400).json({error: 'An error occurred: '+err});
    }    
}

function getTeam(req, res) {
    Team.findOne({
        where: {
            id: req.query.idTeam
        }
    }).then(team => {
        res.status(200).json(team)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    });
}

function getTeamByName(req, res) {
    Team.findOne({
        where: {
            name_team: req.query.name_team,
            id_session: req.query.id_session
        }
    }).then(team => {
        res.status(200).json(team)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    });
}

function getTeamById(req, res) {
    console.log(req.query);
    Team.findOne({
        where: {
            id_team: req.query.id_team,
            id_session: req.query.id_session
        }
    }).then(team => {
        res.status(200).json(team)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    });
}

function updatePositionTeam(req, res) {
    Team.update({
        flag_active: req.body.flag_active,
        position_active: req.body.position_active
    },
    {
        where: {
            name_team: req.body.name_team,
            id_session: req.body.id_session
        }
    }).then(team => {
        res.status(200).json(team)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    });
}

function updatePositionTeamFromSocket(name_team, id_session, flag_active, position_active, prev_position) {
    return Team.update({
        flag_active: flag_active,
        position_active: position_active,
        prev_position: prev_position
    },
    {
        where: {
            name_team: name_team,
            id_session: id_session
        }
    });
}

async function addFlagToTeam(id_team, id_session, flag) {

    const teamFound = await Team.findOne({
        where: {
            id_team,
            id_session
        }
    }).then(team => {
        return team;
    }).catch(err => {
        return null;
    });


    let flagsObtained = [];
    if(teamFound){
        const flagsFound = JSON.parse(teamFound.flags_obtained);
        if(flagsFound != null){
            flagsObtained = flagsFound;
        }
    }
    flagsObtained.push(flag);
    const payloadFlags = JSON.stringify(flagsObtained);

    const updateFlag = await Team.update({
        flags_obtained: payloadFlags
    },
    {
        where: {
            id_team,
            id_session
        }
    });

    let countFlags = 0;

    if(updateFlag == 1){
        FLAGS.forEach(flag => {
            flagsObtained.forEach(flagGained => {
                if(flag == flagGained){
                    countFlags ++;
                }
            });
        });
    }
    const winGame = countFlags == 4 ? true : false;
    const result = {
        winGame,
        flagsObtained
    };

    return result;
}

module.exports = {createTeam, 
    getTeam, 
    getTeamByName, 
    updatePositionTeam, 
    updatePositionTeamFromSocket, 
    getTeamById, 
    addFlagToTeam}