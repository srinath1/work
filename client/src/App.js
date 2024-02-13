import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ProtectedPage from './components/ProtectedPage'
import Profile from './pages/Profile'
import { useSelector } from 'react-redux'
import Spinner from './components/Spinner'
import ProjectInfo from './pages/ProjectInfo'

function App() {
  const {loading}=useSelector(state=>state.loaders)
  return (
    <div>
      {loading && <Spinner/>}
      <BrowserRouter>
    <Routes>
      
      <Route path='/' element={<ProtectedPage><Home/></ProtectedPage>}/>
      <Route path='/project/:id' element={<ProtectedPage><ProjectInfo/></ProtectedPage>}/>

      <Route path='/login' element={<Login/>}/>

      <Route path='/register' element={<Register/>}/>
      <Route path='/profile' element={<ProtectedPage><Profile/></ProtectedPage>}/>


      
      </Routes></BrowserRouter>
    </div>
  
  )
}

export default App;
