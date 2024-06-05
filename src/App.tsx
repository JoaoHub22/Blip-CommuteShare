/* eslint-disable @typescript-eslint/no-unused-vars */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';

import imagePath from './assets/CommuteShare.png';
import NavBar from './components/navbar';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Viagens from './pages/TripsPage.tsx';
import Histórico from './pages/Historic.tsx';
import Adicionar from './pages/AddPage.tsx';
import Editar from './pages/EditPage.tsx';
import Perfil from './pages/Profile.tsx';
import PedirBoleia from './pages/RequestRidePage.tsx';
import OferecerBoleia from './pages/OfferRidePage.tsx';

function App() {
    const items = ['Página Principal', 'Boleias', 'Histórico'];

    return (
        <>
            <div>
                <NavBar brandName="CommuteShare" imageSrcPath={imagePath} navItems={items} />
            </div>
            <Routes>
                <Route path="Home" element={<Home />} />
                <Route path="Viagens" element={<Viagens />} />
                <Route path="Adicionar" element={<Adicionar />} />
                <Route path="/Editar/:tipo" element={<Editar />} />
                <Route path="Login" element={<Login />} />
                <Route path="Register" element={<Register />} />
                <Route path="Histórico" element={<Histórico />} />
                <Route path="Perfil" element={<Perfil />} />
                <Route path="PedirBoleia" element={<PedirBoleia />} />
                <Route path="OferecerBoleia" element={<OferecerBoleia />} />
            </Routes>
        </>
    );
}
export default App;
