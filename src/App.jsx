import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginWrapper from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
    return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/login" element={<LoginWrapper/>} />
            <Route exact path="/" element={<ProtectedRoute/>}/>
        </Routes>
    </BrowserRouter>

    )
}

export default App