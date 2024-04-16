/* eslint-disable @typescript-eslint/no-shadow */
// import DatePicker from 'react-datepicker';
// import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import './Adicionar.scss';

function Adicionar() {
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');
    // const [date, setDate] = useState(new Date());

    if (dropDownButton != null && buttons != null) {
        for (const button of buttons) {
            button.addEventListener('click', event => {
                if (event.target != null) {
                    //@ts-ignore
                    dropDownButton.textContent = event.target.value;
                }
            });
        }
    }

    return (
        <>
            <div className="dropdown">
                <button id="dropdownHere" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" value="Boleias">
                            Boleias
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Viagens">
                            Viagens
                        </button>
                    </li>
                </ul>
            </div>
            <h3>Data</h3>
            {/* <div>
                <DatePicker id="Date" showTimeSelect selected={date} onChange={date => setDate(date)} />
            </div> */}
            <h3>Nº de lugares</h3>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Única vez
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Todas as semanas
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Todos os dias
                </label>
            </div>
            <select className="form-select" aria-label="Default select example">
                <option selected>Open this select menu</option>
                <option value="Segunda">Segunda</option>
                <option value="Terça">Terça</option>
                <option value="Quarta">Quarta</option>
                <option value="Quinta">Quinta</option>
                <option value="Sábado">Sexta</option>
            </select>

            <button id="ButConf">Confimar</button>
            <a href="/Viagens">
                <button id="ButCanc">Cancelar</button>
            </a>
        </>
    );
}

export default Adicionar;
