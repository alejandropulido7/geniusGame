import './App.css'
import { Outlet } from 'react-router-dom';
import GlobalState from './context/challenges/GlobalState';
import Menu from './components/Menu';
import BoardChallenges from './components/challenges/BoardChallenges';

function App() {

  return (
    <div>
        <GlobalState>
          <Menu/>
          <Outlet/>
        </GlobalState>
    </div>
  )
}

export default App;
