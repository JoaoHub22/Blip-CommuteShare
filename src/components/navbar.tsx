//@ts-nocheck

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where, doc, updateDoc } from 'firebase/firestore';
import Popup from 'reactjs-popup';

import { AuthContext } from '../context/auth-context';
import ImagemPerfil from '../assets/profile-circle-icon-2048x2048-cqe5466q.png';

import '../App.css';

interface Profiles {
    id: string;
    description: string;
    email: string;
    username: string;
}

interface Notifications {
    Message: string;
    Read: boolean;
    email: string;
    id: string;
}

interface NavBarProps {
    brandName: string;
    imageSrcPath: string;
    navItems: string[];
}

function NavBar({ brandName, imageSrcPath }: NavBarProps) {
    const { currentUser, signOut } = useContext(AuthContext);
    const firestore = getFirestore();
    const [notifications, setNotifications] = useState<Notifications[]>([]);
    const [profile, setProfile] = useState<Profiles[]>([]);
    const [Notificationsvisible, setNotificationsvisible] = useState(false);
    let isLoggedIn = false;

    if (currentUser != null) {
        isLoggedIn = true;
    }

    const NotificationRead = async notification => {
        try {
            const grupoteste = query(collection(firestore, 'Notifications'), where('id', '==', notification.id));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(document => {
                docID = document.id;
            });
            if (docID) {
                const docRef = doc(collection(firestore, 'Notifications'), docID);

                await updateDoc(docRef, {
                    Read: true
                });
            }
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.log(ex);
        }
    };

    useEffect(() => {
        const handleGetNotifications = async () => {
            const NotificationsList = collection(firestore, 'Notifications');
            const items = [];
            const grupoteste = query(NotificationsList, where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(grupoteste);

            querySnapshot.forEach(document => {
                items.push(document.data());
            });
            setNotifications(items);

            return () => {
                grupo();
            };
        };
        const handleGetProfile = async () => {
            const ProfileList = collection(firestore, 'Profiles');
            const items = [];
            const grupoteste = query(ProfileList, where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(grupoteste);

            querySnapshot.forEach(document => {
                items.push(document.data());
            });
            setProfile(items);

            return () => {
                grupo();
            };
        };

        if (currentUser?.email) {
            handleGetProfile();
            handleGetNotifications();
        }
    }, [currentUser?.email, firestore]);

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
            <div className="container-fluid">
                <Link className="navbar-brand" to="Home">
                    <img src={imageSrcPath} alt="" width="100" height="60" className="d-inline-block align-center" />
                    <span className="fw-bolder sf-4">{brandName}</span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse align-items-start
                flex-column
                flex-md-row"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-md-1">
                        <Link className="nav-link" to="Home">
                            Página Principal
                        </Link>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <Link className="nav-link" to="Viagens">
                            Viagens
                        </Link>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <Link className="nav-link" to="Histórico">
                            Histórico
                        </Link>
                    </ul>
                    <Link className="nav-link" to="Login">
                        {isLoggedIn ? (
                            <></>
                        ) : (
                            <button type="button" className="btn btn-outline-primary me-2">
                                Login
                            </button>
                        )}
                    </Link>
                    <Link className="nav-link" to="Register">
                        {isLoggedIn ? (
                            <></>
                        ) : (
                            <button type="button" className="btn btn-primary">
                                Register
                            </button>
                        )}
                    </Link>
                    {isLoggedIn && (
                        <Popup
                            trigger={
                                Notificationsvisible ? (
                                    <svg
                                        onClick={setNotificationsvisible(false)}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        fill="currentColor"
                                        className="bi bi-bell-fill"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        fill="currentColor"
                                        className="bi bi-bell"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                                    </svg>
                                )
                            }
                        >
                            <ul className="list-group" id="ListNotifications">
                                {notifications.map(notification => {
                                    return (
                                        <li className="list-group-item" key={notification.id}>
                                            <div>Mensagem:</div>
                                            <div>{notification.Message}</div>
                                            {!notification.Read && <button onClick={() => NotificationRead(notification)}>Marcar como lido</button>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </Popup>
                    )}
                    {isLoggedIn && (
                        <Link className="nav-link" to="Perfil" state={currentUser.email}>
                            {isLoggedIn ? <img src={ImagemPerfil} alt="" width="40" height="40" /> : <></>}

                            {isLoggedIn ? (
                                <>
                                    {profile.map(perfil => {
                                        return <>{perfil.username}</>;
                                    })}
                                </>
                            ) : (
                                <></>
                            )}
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <button type="button" className="btn btn-outline-primary me-2" onClick={signOut}>
                            Sign Out
                        </button>
                    ) : (
                        <></>
                    )}{' '}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
