import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ConfigGame from './components/board/ConfigGame.jsx';
import AppBoard from './components/board/AppBoard.jsx';
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom'
import BoardPlayer from './components/player/BoardPlayer.jsx';
import AppTeam from './components/player/AppTeam.jsx';
import BoardGame from './components/board/BoardGame.jsx';
import Roulette from './components/challenges/common/Roulette.jsx';
import Trivia from './components/challenges/trivia/Trivia.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <App />,
    children: [
      {
        path: "/",
        element: <AppBoard />,
      },
      {
        path: "room",
        element: <ConfigGame />
      },
      {
        path: "room/:idRoom",
        element: <BoardGame />
      },
      {
        path: "player",
        element: <AppTeam />
      },
      {
        path: "player/:idRoom",
        element: <BoardPlayer />,
      },
      // {
      //   path: "trivia",
      //   element: <Trivia />,
      // }            
    ],
  },
]); 

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <BrowserRouter>
//       <Routes>
//         <Route path='/' Component={AppBoard}/>
//         <Route path='/room' Component={ConfigGame}/>
//         <Route path='/room/:idRoom' element={<BoardGame/>}/>
//         <Route path='/player' Component={AppTeam}/>
//         <Route path='/player/:idRoom' Component={BoardPlayer}/>
//       </Routes>    
//     </BrowserRouter>,
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)