const Session = require('../models/session');

function createSesion(req, res) {

    Session.create({
        id: req.body.codeSession,
        idHost: req.body.idHost,
        min_to_answer: req.body.configGame.min_to_answer,
        turnOf: '',
        gameStarted: false,
        json_boardPositions: ''
    }).then(session => {
        res.status(200).json(session)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    }); 
}

function updateChallengingInfo(id_session, challenge_active, challenge_name, challenge_participants) {
    return Session.update({
        challenge_active,
        challenge_name,
        challenge_participants
    }, 
    {
        where: {
            id: id_session
        }
    });
}

function updateChallengePassed(id_session, challenge_passed) {
    return Session.update({
        challenge_passed
    },
    {
        where: {
            id: id_session
        }
    });
}

function updateBoardPositions(req, res) {
    Session.update(
        {
            json_boardPositions: req.body.boardPositions
        },
        {        
            where: {
                id: req.body.session_id
            }
        }).then(session => {
            res.status(200).json(session)
        }).catch(err => {
            return res.status(400).json(['An error occurred: '+err]);
        });
}

function getSesion(req, res) {

    console.log('idRoom: '+req.query.idRoom);
    Session.findOne({        
        where: {
            id: req.query.idRoom
        }
    }).then(session => {
        res.status(200).json(session)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    });

}

function updateTurnOfTeamFromSocket(id_session, gameStarted, name_team) {
    return Session.update({
        turnOf: name_team,
        gameStarted
    },
    {
        where: {
            id: id_session
        }
    });
}


module.exports = {createSesion, 
    getSesion, 
    updateBoardPositions, 
    updateTurnOfTeamFromSocket, 
    updateChallengingInfo,
    updateChallengePassed};