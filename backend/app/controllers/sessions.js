const Session = require('../models/session');

function createSesion(req, res) {

    Session.create({
        id: req.body.codeSession,
        idHost: req.body.idHost,
        min_to_answer: req.body.configGame.min_to_answer,
        json_boardPositions: ''
    }).then(session => {
        res.status(200).json(session)
    }).catch(err => {
        return res.status(400).json(['An error occurred: '+err]);
    }); 
}

function updateBoardPositions(req, res) {

    console.log('boardPositions: '+req.body.boardPositions);
    console.log('session_id: '+req.body.session_id);
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

module.exports = {createSesion, getSesion, updateBoardPositions};