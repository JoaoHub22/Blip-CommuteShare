//@ts-nocheck

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

import { AuthContext } from '../context/auth-context';
import ImagemPerfil from '../assets/profile-circle-icon-2048x2048-cqe5466q.png';

import '../App.css';

interface Profiles {
    id: string;
    description: string;
    email: string;
    username: string;
}

interface NavBarProps {
    brandName: string;
    imageSrcPath: string;
    navItems: string[];
}

function NavBar({ brandName, imageSrcPath }: NavBarProps) {
    const { currentUser, signOut } = useContext(AuthContext);
    const firestore = getFirestore();
    const [profile, setProfile] = useState<Profiles[]>([]);

    let isLoggedIn = false;

    if (currentUser != null) {
        isLoggedIn = true;
    }

    useEffect(() => {
        const handleGetProfile = async () => {
            const ProfileList = collection(firestore, 'Profiles');
            const items = [];
            const grupoteste = query(ProfileList, where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(grupoteste);

            querySnapshot.forEach(doc => {
                items.push(doc.data());
            });
            setProfile(items);

            return () => {
                grupo();
            };
        };

        if (currentUser?.email) {
            handleGetProfile();
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
                    <Link className="nav-link" to="Perfil">
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
