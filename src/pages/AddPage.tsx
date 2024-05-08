/* eslint-disable @typescript-eslint/no-shadow */
import DatePicker from 'react-datepicker';
import { SetStateAction, useContext, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

import { AuthContext } from '../context/auth-context';

import './AddPage.scss';

function AddTripRequest() {
    const [destination, setDestination] = useState('');
    const [hour, setHour] = useState('');
    const [seatingcapacity, setSeatingcapacity] = useState('');
    //const [frequency, setFrequency] = useState('');
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');
    const [date, setDate] = useState(new Date());
    const [tipo, setTipo] = useState('');
    const firestore = getFirestore();
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');
    const { currentUser } = useContext(AuthContext);

    const AddTrip = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (tipo == 'Viagem') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newTrip = await addDoc(ListaViagens, {
                destino: destination,
                date: date,
                hora: hour,
                //@ts-ignore
                utilizador: currentUser.email,
                seatingcapacity: seatingcapacity
            });
        }
        if (tipo == 'Boleia') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newCarRideRequest = await addDoc(ListaPedidosBoleia, {
                destino: destination,
                date: date,
                hora: hour,
                //@ts-ignore
                utilizador: currentUser.email
            });
        }
    };

    const handleChange = (date: SetStateAction<Date>) => {
        setDate(date);
    };

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
            <select className="form-select" aria-label="Default select example" onChange={e => setTipo(e.currentTarget.value)}>
                <option selected>Open this select menu</option>
                <option value="Viagem">Viagem</option>
                <option value="Boleia">Boleia</option>
            </select>
            <h3>Data</h3>
            <div>
                {/*@ts-ignore */}
                <DatePicker id="Date" showTimeSelect selected={date} onChange={handleChange} />
            </div>
            <h3>Nº de lugares</h3>
            <input className="input-group" onChange={e => setSeatingcapacity(e.currentTarget.value)}></input>
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
            <h3>Destino</h3>
            <input className="input-group" onChange={e => setDestination(e.currentTarget.value)}></input>
            <h3>Hora</h3>
            <input className="input-group" onChange={e => setHour(e.currentTarget.value)}></input>

            <select className="form-select" aria-label="Default select example">
                <option selected>Open this select menu</option>
                <option value="Segunda">Segunda</option>
                <option value="Terça">Terça</option>
                <option value="Quarta">Quarta</option>
                <option value="Quinta">Quinta</option>
                <option value="Sábado">Sexta</option>
            </select>

            <button id="ButConf" onClick={() => AddTrip()}>
                Confimar
            </button>
            <a href="/Viagens">
                <button id="ButCanc">Cancelar</button>
            </a>
        </>
    );
}

export default AddTripRequest;
