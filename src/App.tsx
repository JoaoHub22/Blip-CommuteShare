import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { AuthContext } from './context/auth-context';
// import RequireAuth from './components/require-auth.tsx';
import imagePath from './assets/your_image_icon.png';
import NavBar from './components/navbar';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Viagens from './pages/Viagens.tsx';
import Histórico from './pages/Histórico.tsx';
import Adicionar from './pages/Adicionar.tsx';

function App() {
    const items = ['Página Principal', 'Boleias', 'Histórico'];
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // eslint-disable-next-line no-console
    console.log('User:', !!currentUser);

    // Check if the current user exists on the initial render.
    useEffect(() => {
        if (currentUser) {
            navigate('/Home');
        }
    }, [currentUser, navigate]);

    return (
        <>
            <div>
                <NavBar brandName="CommuteShare" imageSrcPath={imagePath} navItems={items} />
            </div>
            <Routes>
                <Route path="Home" element={<Home />} />
                <Route path="Viagens" element={<Viagens />} />
                <Route path="Adicionar" element={<Adicionar />} />
                <Route path="Login" element={<Login />} />
                <Route path="Register" element={<Register />} />
                <Route path="Histórico" element={<Histórico />} />
            </Routes>
        </>
    );
}
export default App;
