/* eslint-disable @typescript-eslint/no-shadow */
//@ts-nocheck
import DatePicker from 'react-datepicker';
import { v4 as uuid } from 'uuid';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addDoc, arrayUnion, collection, query, getFirestore, where, updateDoc, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';

import './RequestRidePage.scss';

interface DetalhesBoleia {
    id: string;
    pickuplocation: string;
    destination: string;
    date: string;
    //@ts-ignore
    user: string;
}

function RequestRide() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const id = uuid();
    const location = useLocation();
    const TripId = location.state.id;
    const [destination, setDestination] = useState('');
    const [pickuplocation, setPickuplocation] = useState('');
    const [frequency, setFrequency] = useState('');
    const [boleias, setBoleias] = useState<DetalhesBoleia[]>([]);
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');
    const [date, setDate] = useState(new Date(Number(`${location.state.date.seconds}000`)));
    const startDate = new Date(Number(`${location.state.date.seconds}000`));
    const [IsLoading, setIsLoading] = useState(false);
    const firestore = getFirestore();
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');
    const ListaViagens = collection(firestore, 'Viagens');
    const [boleianova, setBoleianova] = useState('PedidoNovo');

    const SendRequest = async boleiaID => {
        try {
            const grupoteste = query(ListaViagens, where('id', '==', TripId));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    PedidosRecebidos: arrayUnion(boleiaID)
                });
            }
            toast.show({
                title: 'Pedido enviado',
                content: 'Pedido enviado com sucesso',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha ao enviar pedido de boleia',
                duration: 10000
            });
        }
    };

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
        SendRequest(id);
        toast.show({
            title: 'Pedido de boleia criado',
            content: 'Pedido de boleia guardado com sucesso',
            duration: 10000
        });
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/Login');
        }

        const handleGetPedidosBoleia = async () => {
            setIsLoading(true);

            const grupo = onSnapshot(ListaPedidosBoleia, querySnapshot => {
                //@ts-ignore
                const items = [];

                querySnapshot.forEach(doc => {
                    items.push(doc.data());
                });
                //@ts-ignore
                setBoleias(items);
                setIsLoading(false);
            });

            return () => {
                grupo();
            };
        };

        handleGetPedidosBoleia();
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
            <select className="form-select" aria-label="Default select example" onChange={e => setBoleianova(e.currentTarget.value)}>
                <option value="PedidoNovo">Pedido Novo</option>
                <option value="PedidoExistente">Pedido Existente</option>
            </select>
            {boleianova === 'PedidoNovo' && (
                <div className="container">
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

                    <h3>Local para apanhar</h3>
                    <input className="input-group" onChange={e => setPickuplocation(e.currentTarget.value)}></input>

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
            )}
            {boleianova === 'PedidoExistente' && (
                <div className="container" id="lista">
                    {!IsLoading && (
                        <ul className="list-group">
                            {boleias
                                .filter(boleia => {
                                    //@ts-ignore
                                    return boleia.user === currentUser.email;
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.id}>
                                            <div>Utilizador:{boleia.user}</div>
                                            <div>Data:{new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Local para apanhar:{boleia.pickuplocation}</div>
                                            <div>Destino:{boleia.destination}</div>
                                            <button className="button" onClick={() => SendRequest(boleia.id)}>
                                                Enviar
                                            </button>
                                        </li>
                                    );
                                })}
                        </ul>
                    )}
                    {IsLoading && (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RequestRide;
