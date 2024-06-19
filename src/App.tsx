/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, getFirestore } from 'firebase/firestore';

import { messaging } from './firebase.ts';
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
import Message from './components/message.tsx';
import { AuthContext } from './context/auth-context.tsx';

function App() {
    const items = ['Página Principal', 'Boleias', 'Histórico'];
    const { currentUser } = useContext(AuthContext);
    const firestore = getFirestore();
    const Topics = collection(firestore, 'MessageTopics');

    async function requestPermission() {
        //requesting permission using Notification API
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: 'BHiA2ELNXhDDBRFQpAPb9A37kdtlFsP9YL1sCSGirTmY3Xi0YxfWiOxqV36upgvroFLXjR6bNZy26cbqEzdFcKk'
            });

            //We can send token to server
            console.log('Token generated : ', token);
        } else if (permission === 'denied') {
            //notifications are blocked
            alert('You denied for the notification');
        }
    }

    useEffect(() => {
        requestPermission();
    }, []);

    onMessage(messaging, payload => {
        console.log('Chegou a Message');
        toast(<Message notification={payload.notification} />);
    });

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
            <br />
            <ToastContainer />
        </>
    );
}
export default App;
