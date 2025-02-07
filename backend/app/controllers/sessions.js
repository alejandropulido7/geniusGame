const Session = require('../models/session');
const {generateUUID, createBoard} = require('../utils/shared');
const {createAccessToken} = require('../utils/jwt');
const { CHALLENGES_IN_BOARD, TRIVIA_VS } = require('../utils/constant');

async function createSesion(req, res) {

    try {
        const {min_to_answer, lenght_board, challenges_in_board} = req.body.configGame;
        const idHost = generateUUID(12);
        const idRoom = generateUUID(6, false);
        let challengesInBoard = challenges_in_board;
        if(challengesInBoard) challengesInBoard = JSON.parse(challengesInBoard);
        
        const boardPositions = createBoard(lenght_board, lenght_board, challengesInBoard);

        const sessionCreated = await Session.create({
            id: idRoom,
            idHost,
            min_to_answer,
            lenght_board,
            amount_challenges: lenght_board,
            turnOf: '',
            gameStarted: false,
            json_boardPositions: JSON.stringify(boardPositions),
            id_user: req.user.id
        });

        if(!sessionCreated) return res.status(400).json({error: 'Error creando la sesion'});

        const idRoomCreated = sessionCreated.id;
        const token = await createAccessToken({
            idRoom: idRoomCreated,
            idHost: sessionCreated.idHost,
            idUser: sessionCreated.id_user
        });
        res.status(200).json({idRoom: idRoomCreated, idHost: sessionCreated.idHost, token}); 
        
    } catch (err) {
        return res.status(400).json({error: 'Error: '+err});
    }
       
}

async function addTriviaVsToChallenges(idGame) {
    
    const session = await Session.findOne({
        where: {
            id: idGame
        }
    });

    let newBoardPositions = [];
    if(session){
        let challenges = JSON.parse(JSON.stringify(CHALLENGES_IN_BOARD));
        challenges.push({ id: TRIVIA_VS, name: 'Enfrentamiento de preguntas', icon: TRIVIA_VS });
        newBoardPositions = createBoard(session.lenght_board, session.amount_challenges, challenges);
        const sessionUpdated = await Session.update({
            json_boardPositions: JSON.stringify(newBoardPositions)
        }, 
        {
            where: {
                id: idGame
            }
        });
        if (sessionUpdated == 1){
            return newBoardPositions;
        }
    }
    return [];
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
    updateChallengePassed,
    addTriviaVsToChallenges};