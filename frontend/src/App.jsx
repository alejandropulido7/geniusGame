import './App.css'
import { Outlet } from 'react-router-dom';
import GlobalState from './context/GlobalState';
import AuthState from './context/AuthState';

function App() {

  return (
    <div>
        <AuthState>
          <GlobalState>
              <Outlet/>
          </GlobalState>
        </AuthState>
    </div>
  )
}

export default App;
