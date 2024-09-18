import axios from 'axios';


async function createTeam(payload) {

    const {id_session, id_team, name_team, players, prop_piece, flag_active} = payload;
    try {
        const response = await axios.post(`http://localhost:5000/api/teams`, {
            id_session,
            id_team,
            name_team,
            players,
            prop_piece,
            flag_active
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response.data);
        return error.response.data;
    }
}



async function getTeam(idTeam) {
    try {
        const response = await axios.get(`http://localhost:5000/api/teams?idTeam=${idTeam}`); // Reemplaza con la URL de tu backend
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function getTeamById(id_team, id_session) {
    try {
        const response = await axios.get(`http://localhost:5000/api/teams/byId?id_team=${id_team}&id_session=${id_session}`); // Reemplaza con la URL de tu backend
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        console.log(error);
    }
}

async function getTeamByName(name_team, id_session) {
    try {
        const response = await axios.get(`http://localhost:5000/api/teams/byName?name_team=${name_team}&id_session=${id_session}`); // Reemplaza con la URL de tu backend
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        console.log(error);
    }
}

async function updatePositionTeam(name_team, id_session, flag_active, position_active) {
    try {
        const response = await axios.put(`http://localhost:5000/api/teams`, {
            id_session,
            name_team,
            flag_active,
            position_active
        }); // Reemplaza con la URL de tu backend
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

export {getTeam, createTeam, getTeamByName, updatePositionTeam, getTeamById}