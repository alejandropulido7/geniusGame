import axios from 'axios';


async function createTeam(id_session, name_team, players, avatar, flag_active) {
    console.log(id_session)
    console.log(name_team);
    console.log(flag_active)
    try {
        const response = await axios.post(`http://localhost:5000/api/teams`, {
            id_session,
            name_team,
            players,
            avatar,
            flag_active
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return error;
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

async function getTeamByName(name_team, id_session) {
    try {
        const response = await axios.get(`http://localhost:5000/api/teams/byName?name_team=${name_team}&id_session=${id_session}`); // Reemplaza con la URL de tu backend
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
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

export {getTeam, createTeam, getTeamByName, updatePositionTeam}