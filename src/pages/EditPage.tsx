/* eslint-disable @typescript-eslint/no-shadow */
//@ts-nocheck
import DatePicker from 'react-datepicker';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';

import './EditPage.scss';

function EditTripRequest() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { tipo } = useParams();
    const id = location.state.id;
    const [destination, setDestination] = useState(location.state.destination);
    const [pickuplocation, setPickuplocation] = useState(location.state.pickuplocation);
    const [seatingcapacity, setSeatingcapacity] = useState(location.state.seatingcapacity);
    const [frequency, setFrequency] = useState(location.state.frequency);
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');
    const [date, setDate] = useState();
    const startDate = new Date();
    const [startingpoint, setStartingpoint] = useState(location.state.startingpoint);
    const firestore = getFirestore();
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');

    useEffect(() => {
        if (!currentUser) {
            navigate('/Login');
        }
    }, [currentUser, navigate]);

    const EditTrip = async () => {
        if (tipo === 'Viagem') {
            try {
                const grupoteste = query(ListaViagens, where('id', '==', id));
                const querySnapshot = await getDocs(grupoteste);

                let docID = null;

                querySnapshot.forEach(doc => {
                    docID = doc.id;
                });

                if (docID) {
                    const docRef = doc(ListaViagens, docID);

                    await updateDoc(docRef, {
                        startingpoint: startingpoint,
                        destination: destination,
                        date: date,
                        frequency: frequency,
                        seatingcapacity: seatingcapacity
                    });
                }
            } catch (ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
            }
        }
        if (tipo === 'Boleia') {
            try {
                const grupoteste = query(ListaPedidosBoleia, where('id', '==', id));
                const querySnapshot = await getDocs(grupoteste);

                let docID = null;

                querySnapshot.forEach(doc => {
                    docID = doc.id;
                });

                if (docID) {
                    const docRef = doc(ListaPedidosBoleia, docID);

                    await updateDoc(docRef, {
                        pickuplocation: pickuplocation,
                        destination: destination,
                        date: date,
                        frequency: frequency
                    });
                }
            } catch (ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
            }
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
        <div className="container">
            <h3>Data</h3>
            <div>
                {/*@ts-ignore */}
                <DatePicker showTimeSelect id="Date" startDate={startDate} minDate={startDate} selected={date} onChange={handleChange} />
            </div>
            {tipo === 'Viagem' && (
                <>
                    <h3>Nº de lugares</h3>
                    <input className="input-group" value={seatingcapacity} onChange={e => setSeatingcapacity(e.currentTarget.value)}></input>
                </>
            )}
            <h3>Frequência</h3>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={frequency === 'Única vez'}
                    value="Única vez"
                    onChange={e => setFrequency(e.currentTarget.value)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Única vez
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked={frequency === 'Todas as semanas'}
                    value="Todas as semanas"
                    onChange={e => setFrequency(e.currentTarget.value)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Todas as semanas
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked={frequency === 'Todos os dias'}
                    value="Todos os dias"
                    onChange={e => setFrequency(e.currentTarget.value)}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Todos os dias
                </label>
            </div>
            {frequency === 'Todas as semanas' && (
                <select className="form-select" aria-label="Default select example">
                    <option value="mondays">Segunda</option>
                    <option value="tuesdays">Terça</option>
                    <option value="wednesdays">Quarta</option>
                    <option value="thursday">Quinta</option>
                    <option value="friday">Sexta</option>
                    <option value="saturday">Sábado</option>
                    <option value="sunday">Domingo</option>
                </select>
            )}
            {tipo === 'Viagem' && (
                <>
                    <h3>Ponto de Partida</h3>
                    <input className="input-group" value={startingpoint} onChange={e => setStartingpoint(e.currentTarget.value)}></input>
                </>
            )}

            {tipo === 'Boleia' && (
                <>
                    <h3>Local para apanhar</h3>
                    <input className="input-group" value={pickuplocation} onChange={e => setPickuplocation(e.currentTarget.value)}></input>
                </>
            )}

            <h3>Destino</h3>
            <input className="input-group" value={destination} onChange={e => setDestination(e.currentTarget.value)}></input>
            <Link to="/Viagens">
                <button className="button" id="ButConf" onClick={() => EditTrip()}>
                    Confimar
                </button>
            </Link>

            <Link to="/Viagens">
                <button className="button" id="ButCanc">
                    Cancelar
                </button>
            </Link>
        </div>
    );
}
export default EditTripRequest;
