import React, {useState} from 'react'
import {useParams} from 'react-router-dom';

const Menu = () => {

    const {idRoom} = useParams();

    return (
        <>
           {idRoom && <div>
            <h3>Menu</h3>
           </div>}
        </>
    )
}

export default Menu
