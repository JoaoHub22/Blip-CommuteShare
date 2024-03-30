/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';

import '../App.css';

interface NavBarProps {
    brandName: string;
    imageSrcPath: string;
    navItems: string[];
}

function NavBar({ brandName, imageSrcPath, navItems }: NavBarProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow">
            <div className="container-fluid">
                <a className="navbar-brand" href="">
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
                        {navItems.map((items, index) => (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                            <li key={items} className="nav-item" onClick={() => setSelectedIndex(index)}>
                                <a className={selectedIndex == index ? 'nav-link active fw-bold' : 'nav-link'} href="#">
                                    {items}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <li className="nav-item">
                        <a className="nav-link" href="/Login">
                            Login
                        </a>
                    </li>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
