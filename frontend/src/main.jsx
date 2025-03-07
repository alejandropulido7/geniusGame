import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ConfigGame from './components/board/ConfigGame.jsx';
import { createBrowserRouter, RouterProvider, BrowserRouter, Routes, Route } from 'react-router-dom'
import BoardPlayer from './components/player/BoardPlayer.jsx';
import BoardGame from './components/board/BoardGame.jsx';
import MainScreen from './components/main/MainScreen.jsx';
import ConfigTeam from './components/player/ConfigTeam.jsx';
import AppPlayer from './components/player/AppPlayer.jsx';
import PrivateUserRoute from './context/PrivateUserRoute.jsx';
import { SocketProvider } from './context/SocketProvider.jsx';
import { AudioProvider } from './context/AudioProvider.jsx';
import Winner from './components/challenges/common/Winner.jsx';
import WinnerPlayer from './components/challenges/common/WinnerPlayer.jsx';
import { Spotify } from './components/challenges/whistle/Spotify.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
    errorElement: <MainScreen />,    
  },
  {
    path: "/spotify",
    element: <Spotify/>   
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
      {
        path: "/board/:idRoom",
        element: <SocketProvider isBoard={true}><AudioProvider><BoardGame /></AudioProvider></SocketProvider>
      },       
    ],
  },
  {
    path: "/player",
    element: <AppPlayer />,
    errorElement: <AppPlayer />,
    children: [
      {
        path: "/player/:tokenAdmin",
        element: <ConfigTeam />
      },
      {
        path: "/player/room/:idRoom",
        element: <SocketProvider><BoardPlayer/></SocketProvider>,
      },           
    ],
  }
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