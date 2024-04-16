import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';

import '../App.css';

interface NavBarProps {
    brandName: string;
    imageSrcPath: string;
    navItems: string[];
}

function NavBar({ brandName, imageSrcPath }: NavBarProps) {
    const { currentUser, signOut } = useContext(AuthContext);
    let isLoggedIn = false;

    if (currentUser != null) {
        isLoggedIn = true;
    }

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
            <div className="container-fluid">
                <Link className="navbar-brand" to="Home">
                    <img src={imageSrcPath} alt="" width="60" height="60" className="d-inline-block align-center" />
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
                        {isLoggedIn ? <></> : <>Login</>}
                    </Link>
                    <Link className="nav-link" to="Register">
                        {isLoggedIn ? <></> : <>Register</>}
                    </Link>
                    {/* Não deve ser um botão */}
                    <button onClick={signOut}>{isLoggedIn ? <>Sign Out</> : <></>} </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
