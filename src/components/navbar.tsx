import { useContext } from 'react';

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
                <a className="navbar-brand" href="/Home">
                    <img src={imageSrcPath} alt="" width="60" height="60" className="d-inline-block align-center" />
                    <span className="fw-bolder sf-4">{brandName}</span>
                </a>
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
                        <a className="nav-link" href="/Home">
                            Página Principal
                        </a>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className="nav-link" href="/Viagens">
                            Viagens
                        </a>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a className="nav-link" href="/Histórico">
                            Histórico
                        </a>
                    </ul>

                    <a className="nav-link" href="/Login">
                        {isLoggedIn ? <></> : <>Login</>}
                    </a>
                    <a className="nav-link" href="/Register">
                        {isLoggedIn ? <></> : <>Register</>}
                    </a>
                    {/* Não deve ser um botão */}
                    <button onClick={signOut}>{isLoggedIn ? <>Sign Out</> : <></>} </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
