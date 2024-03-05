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
import Hunged from './components/challenges/Hunged.jsx';
import Pictionary from './components/challenges/Pictionary.jsx';
import ChainWord from './components/challenges/ChainWords.jsx';
import ActingAndWhistle from './components/challenges/ActingAndWhistle.jsx';
import BoardChallenges from './components/challenges/BoardChallenges.jsx';
import ChallengeState from './context/challenges/ChallengeState.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={AppBoard}/>
        <Route path='/room' Component={ConfigGame}/>
        <Route path='/room/:idRoom' element={<ChallengeState><BoardGame/></ChallengeState>}/>
        {/* <Route path='/room/:idRoom/challenge' Component={BoardChallenges}>
          <Route path='hunged' Component={Hunged}/>
          <Route path='pictionary' Component={Pictionary}/>
          <Route path='chainWord' Component={ChainWord}/>
          <Route path='acting/:renderInScreen' Component={ActingAndWhistle}/>
        </Route> */}
        <Route path='/player' Component={AppTeam}/>
        <Route path='/player/:idRoom' Component={BoardPlayer}/>
        {/* <Route path='/player/:idRoom/challenge' Component={BoardChallenges} element={<ChallengeState></ChallengeState>}>
          <Route path='hunged' Component={Hunged}/>
          <Route path='pictionary' Component={Pictionary}/>
          <Route path='chainWord' Component={ChainWord}/>
          <Route path='acting' Component={ActingAndWhistle}/>
        </Route> */}
      </Routes>    
    </BrowserRouter>,
)
