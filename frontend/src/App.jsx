import './App.css'
import { Outlet } from 'react-router-dom';
import GlobalState from './context/challenges/GlobalState';
import Menu from './components/Menu';

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
