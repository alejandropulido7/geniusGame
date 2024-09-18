import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import {validateUserToken} from '../services/authServices'

const token = localStorage.getItem('authToken');

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
                    localStorage.removeItem('authToken');
                }
            }).catch(err => {
                setRedirectionHome(true);
                localStorage.removeItem('authToken');
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
