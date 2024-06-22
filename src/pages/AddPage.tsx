/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
//@ts-nocheck
import DatePicker from 'react-datepicker';
import { v4 as uuid } from 'uuid';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from '../components/toastmanager';
import { AuthContext } from '../context/auth-context';

import './AddPage.scss';

function AddTripRequest() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const id = uuid();
    const [destination, setDestination] = useState('');
    const [pickuplocation, setPickuplocation] = useState('');
    const [seatingcapacity, setSeatingcapacity] = useState('');
    const [frequency, setFrequency] = useState('');
    // const [weeklyfrequency, setWeeklyFrequency] = useState('Única vez');
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');
    const [date, setDate] = useState(new Date());
    const startDate = new Date();
    const [tipo, setTipo] = useState('Viagem');
    const [startingpoint, setStartingpoint] = useState('');
    const firestore = getFirestore();
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');

    useEffect(() => {
        if (!currentUser) {
            navigate('/Login');
        }
    }, [currentUser, navigate]);

    const AddTrip = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        if (tipo == 'Viagem') {
            if (startingpoint != '' && seatingcapacity != '' && destination != '') {
                addDoc(ListaViagens, {
                    PedidosRecebidos: [],
                    BoleiasPedidos: [],
                    id: id,
                    startingpoint: startingpoint,
                    destination: destination,
                    date: date,
                    frequency: frequency,
                    //@ts-ignore
                    user: currentUser.email,
                    seatingcapacity: seatingcapacity
                });
                toast.show({
                    title: 'Viagem adicionada',
                    content: 'Viagem guardada com sucesso',
                    duration: 10000
                });
            } else {
                toast.show({
                    title: 'Erro',
                    content: 'Há elementos por preencher',
                    duration: 10000
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        if (tipo == 'Boleia') {
            if (pickuplocation != '' && destination != '') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                addDoc(ListaPedidosBoleia, {
                    ViagensOferecidas: [],
                    ViagemAceite: '',
                    id: id,
                    pickuplocation: pickuplocation,
                    destination: destination,
                    date: date,
                    frequency: frequency,
                    //@ts-ignore
                    user: currentUser.email
                });
                toast.show({
                    title: 'Pedido de boleia adicionado',
                    content: 'Pedido de boleia guardado com sucesso',
                    duration: 10000
                });
            } else {
                toast.show({
                    title: 'Erro',
                    content: 'Há elementos por preencher',
                    duration: 10000
                });
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
            <select className="form-select" aria-label="Default select example" onChange={e => setTipo(e.currentTarget.value)}>
                <option value="Viagem">Viagem</option>
                <option value="Boleia">Boleia</option>
            </select>
            <h3>Data</h3>
            <div>
                {/*@ts-ignore */}
                <DatePicker
                    showTimeSelect
                    id="Date"
                    startDate={startDate}
                    minDate={startDate}
                    selected={date}
                    onChange={handleChange}
                    dateFormat={'d MMMM yyyy, h:mmaa'}
                />
            </div>
            {tipo === 'Viagem' && (
                <>
                    <h3>Nº de lugares</h3>
                    <input className="input-group" onChange={e => setSeatingcapacity(e.currentTarget.value)}></input>
                </>
            )}
            <h3>Frequência</h3>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="Única vez"
                    onChange={e => setFrequency(e.currentTarget.value)}
                    checked
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
                    <input className="input-group" onChange={e => setStartingpoint(e.currentTarget.value)}></input>
                </>
            )}

            {tipo === 'Boleia' && (
                <>
                    <h3>Local para apanhar</h3>
                    <input className="input-group" onChange={e => setPickuplocation(e.currentTarget.value)}></input>
                </>
            )}

            <h3>Destino</h3>
            <input className="input-group" onChange={e => setDestination(e.currentTarget.value)}></input>

            <Link to="/Viagens">
                <button className="button" id="ButConf" onClick={() => AddTrip()}>
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

export default AddTripRequest;
