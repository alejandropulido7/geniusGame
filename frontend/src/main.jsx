import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ConfigGame from './components/board/ConfigGame.jsx';
import AppBoard from './components/board/AppBoard.jsx';
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom'
import BoardPlayer from './components/player/BoardPlayer.jsx';
import AppTeam from './components/player/ConfigTeam.jsx';
import BoardGame from './components/board/BoardGame.jsx';
import Roulette from './components/challenges/common/Roulette.jsx';
import Trivia from './components/challenges/trivia/Trivia.jsx';
import MainScreen from './components/main/MainScreen.jsx';
import ConfigTeam from './components/player/ConfigTeam.jsx';
import AppPlayer from './components/player/AppPlayer.jsx';
import AuthState from './context/AuthState.jsx';
import PrivateUserRoute from './context/PrivateUserRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
    errorElement: <MainScreen />,    
  },
  {
    path: "/board",
    element: <App />,
    errorElement: <App />,
    children: [
      {
        path: "/board",
        element: <PrivateUserRoute><ConfigGame/></PrivateUserRoute> 
      },
      // {
      //   path: "board/:idRoom",
      //   element: <BoardGame />
      // },       
    ],
  },
  // {
  //   path: "/player",
  //   element: <AppPlayer />,
  //   errorElement: <AppPlayer />,
  //   children: [
  //     {
  //       path: "player",
  //       element: <ConfigTeam />
  //     },
  //     {
  //       path: "player/:idRoom",
  //       element: <BoardPlayer />,
  //     },           
  //   ],
  // }
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