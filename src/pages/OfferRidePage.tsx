/* eslint-disable @typescript-eslint/no-shadow */
//@ts-nocheck
import DatePicker from 'react-datepicker';
import { v4 as uuid } from 'uuid';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, arrayUnion, collection, query, getFirestore, where, updateDoc, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';

import './OfferRidePage.scss';

interface DetalhesViagem {
    id: string;
    startingpoint: string;
    destination: string;
    date: string;
    frequency: string;
    //@ts-ignore
    user: string;
    occupiedseats: number;
    seatingcapacity: number;
}

function OfferRide() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const id = uuid();
    const location = useLocation();
    const RequestId = location.state.id;
    const [destination, setDestination] = useState('');
    const [frequency, setFrequency] = useState('');
    const [viagens, setViagens] = useState<DetalhesViagem[]>([]);
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');
    const [date, setDate] = useState(new Date());
    const startDate = new Date();
    const [isLoading, setIsLoading] = useState(false);
    const firestore = getFirestore();
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');
    const ListaViagens = collection(firestore, 'Viagens');
    const [viagemnova, setViagemnova] = useState('ViagemNova');

    const AddTrip = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        addDoc(ListaPedidosBoleia, {
            id: id,
            pickuplocation: pickuplocation,
            destination: destination,
            date: date,
            frequency: frequency,
            //@ts-ignore
            user: currentUser.email
        });
        toast.show({
            title: 'Viagem criada',
            content: 'Viagem guardado com sucesso',
            duration: 10000
        });
    };

    const SendOffer = async viagemID => {
        try {
            const grupoteste = query(ListaViagens, where('id', '==', viagemID));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    BoleiasPedidos: arrayUnion(RequestId)
                });
            }
            toast.show({
                title: 'Oferta enviada',
                content: 'Oferta guardada com sucesso',
                duration: 10000
            });
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.log(ex);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/Login');
        }

        const handleGetViagens = async () => {
            setIsLoading(true);

            const grupo = onSnapshot(ListaViagens, querySnapshot => {
                //@ts-ignore
                const items = [];

                querySnapshot.forEach(doc => {
                    items.push(doc.data());
                });
                //@ts-ignore
                setViagens(items);
                setIsLoading(false);
            });

            return () => {
                grupo();
            };
        };

        handleGetViagens();
    }, [currentUser, navigate]);
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
            <select className="form-select" aria-label="Default select example" onChange={e => setViagemnova(e.currentTarget.value)}>
                <option value="ViagemNova">Pedido Novo</option>
                <option value="ViagemExistente">Pedido Existente</option>
            </select>
            {viagemnova === 'ViagemNova' && (
                <>
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

                    <h3>Nº de lugares</h3>
                    <input className="input-group" onChange={e => setSeatingcapacity(e.currentTarget.value)}></input>

                    <h3>Frequência</h3>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
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

                    <h3>Ponto de Partida</h3>
                    <input className="input-group" onChange={e => setStartingpoint(e.currentTarget.value)}></input>

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
                </>
            )}

            {viagemnova === 'ViagemExistente' && (
                <div className="container" id="lista">
                    {!isLoading && (
                        <ul className="list-group">
                            {viagens
                                .filter(viagem => {
                                    return viagem.user === currentUser.email;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            <div>Utilizador:{viagem.user}</div>
                                            <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Ponto de partida:{viagem.startingpoint}</div>
                                            <div>Destino:{viagem.destination}</div>
                                            <div>
                                                Lugares:{viagem.occupiedseats}/{viagem.seatingcapacity}
                                            </div>
                                            <button className="button" onClick={() => SendOffer(viagem.id)}>
                                                Enviar
                                            </button>
                                        </li>
                                    );
                                })}
                        </ul>
                    )}
                    {isLoading && (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default OfferRide;
