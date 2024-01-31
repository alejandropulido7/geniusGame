import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ConfigGame from './components/board/ConfigGame.jsx';
import AppBoard from './components/board/AppBoard.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BoardPlayer from './components/player/BoardPlayer.jsx';
import AppTeam from './components/player/AppTeam.jsx';
import BoardGame from './components/board/BoardGame.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={AppBoard}/>
        <Route path='/room' Component={ConfigGame}/>
        <Route path='/room/:idRoom' Component={BoardGame}/>
        <Route path='/player' Component={AppTeam}/>
        <Route path='/player/:idRoom' Component={BoardPlayer}/>
      </Routes>
    
    </BrowserRouter>

  </React.StrictMode>,
)
