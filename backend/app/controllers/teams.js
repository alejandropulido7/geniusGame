const Team = require('../models/team')

function createTeam(req, res) {

    console.log(req.body.name_team)
    console.log(req.body.id_session)

    Team.create({
        name_team: req.body.name_team,
        avatar: req.body.avatar,
        score_game: 0,
        status: true,
        players: req.body.players,
        id_session: req.body.id_session,
        flag_active: req.body.flag_active
    }).then(team => {
        res.status(200).json(team)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    });
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

function updatePositionTeam(req, res) {
    console.log(res.body)
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

function updatePositionTeamFromSocket(name_team, id_session, flag_active, position_active) {
    console.log('//entra actualizar')
    Team.update({
        flag_active: flag_active,
        position_active: position_active
    },
    {
        where: {
            name_team: name_team,
            id_session: id_session
        }
    }).then(team => {
        return team
    }).catch(err => {
        console.log(err)
        return 0;
    });
}

module.exports = {createTeam, getTeam, getTeamByName, updatePositionTeam, updatePositionTeamFromSocket}