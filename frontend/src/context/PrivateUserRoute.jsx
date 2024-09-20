import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import {validateUserToken} from '../services/authServices'
import { getCookie, deleteCookie } from '../utils/cookies';

const token = getCookie('token');

const PrivateUserRoute = ({children}) => {
    const [redirectionHome, setRedirectionHome] = useState(null);

    useEffect(() => {        
        if(token){
            validateUserToken(token)
            .then(session => {
                if(session){
                    setRedirectionHome(false);
                } else {
                    setRedirectionHome(true);
                    deleteCookie('token');
                }
            }).catch(err => {
                setRedirectionHome(true);
                deleteCookie('token');
            })
        }
    },[token])

    return (
        <>
            {!redirectionHome ? children : <Navigate to="/" />}
        </>
    )
}

export default PrivateUserRoute
