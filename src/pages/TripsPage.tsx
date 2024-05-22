/* eslint-disable no-console */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, deleteDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';

import './TripsPage.scss';

interface DetalhesViagem {
    id: string;
    startingpoint: string;
    destination: string;
    date: string;
    frequency: string;
    //@ts-ignore
    user: string;
    seatingcapacity: number;
}

interface DetalhesBoleia {
    id: string;
    pickuplocation: string;
    destination: string;
    date: string;
    //@ts-ignore
    user: string;
}
function Trips() {
    const { currentUser } = useContext(AuthContext);
    const [viagens, setViagens] = useState<DetalhesViagem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tipo, setTipo] = useState('Viagens');
    const [boleias, setBoleias] = useState<DetalhesBoleia[]>([]);
    const firestore = getFirestore();
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');

    const [filter, setFilter] = useState('');

    const Delete = async id => {
        if (tipo === 'Viagens próprias') {
            try {
                const grupoteste = query(ListaViagens, where('id', '==', id));
                const querySnapshot = await getDocs(grupoteste);

                let docID = null;

                querySnapshot.forEach(doc => {
                    docID = doc.id;
                });

                if (docID) {
                    const docRef = doc(ListaViagens, docID);

                    await deleteDoc(docRef);
                }
            } catch (ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
            }
        }
        if (tipo === 'PedidosBoleia próprios') {
            try {
                const grupoteste = query(ListaPedidosBoleia, where('id', '==', id));
                const querySnapshot = await getDocs(grupoteste);

                let docID = null;

                querySnapshot.forEach(doc => {
                    docID = doc.id;
                });

                if (docID) {
                    const docRef = doc(ListaPedidosBoleia, docID);

                    await deleteDoc(docRef);
                }
            } catch (ex) {
                // eslint-disable-next-line no-console
                console.log(ex);
            }
        }
    };

    useEffect(() => {
        const handleGetViagens = async () => {
            setIsLoading(true);

            const grupo = onSnapshot(ListaViagens, querySnapshot => {
                //@ts-ignore
                const items = [];

                console.log(querySnapshot);
                // eslint-disable-next-line @typescript-eslint/no-shadow
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
    }, []);

    return (
        <>
            <h3>Viagens</h3>
            <input
                type="search"
                className="form-control"
                onChange={e => setFilter(e.currentTarget.value)}
                placeholder="Search..."
                aria-label="Search"
            ></input>
            <select
                id="SelectList"
                className="form-select form-select-sm"
                aria-label="Small select example"
                onChange={e => setTipo(e.currentTarget.value)}
            >
                <option value="Viagens">Viagens</option>
                <option value="PedidosBoleia">Pedidos de boleia</option>
                <option value="Viagens próprias">Viagens próprias</option>
                <option value="PedidosBoleia próprios">Pedidos de boleia próprios</option>
            </select>
            <Link to="/Adicionar">Adicionar pedido de boleia/viagem</Link>
            {tipo == 'Viagens' && (
                <div className="container" id="lista">
                    {!isLoading && (
                        <ul className="list-group">
                            {viagens
                                .filter(viagem => {
                                    if (filter != '') {
                                        return viagem.destination === filter;
                                    } else return viagem;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            <div>Utilizador:{viagem.user}</div>
                                            <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Ponto de partida:{viagem.startingpoint}</div>
                                            <div>Destino:{viagem.destination}</div>
                                            <div>Lugares:{viagem.seatingcapacity}</div>
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
            {tipo == 'PedidosBoleia' && (
                <div className="container" id="lista">
                    {!isLoading && (
                        <ul className="list-group">
                            {boleias.map(boleia => {
                                return (
                                    <li className="list-group-item" key={boleia.id}>
                                        <div>Utilizador:{boleia.user}</div>
                                        <div>Data: {new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                        <div>Local para apanhar:{boleia.pickuplocation}</div>
                                        <div>Destino:{boleia.destination}</div>
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
            {tipo == 'Viagens próprias' && (
                <div className="container" id="lista">
                    {!isLoading && (
                        <ul className="list-group">
                            {viagens
                                .filter(viagem => {
                                    //@ts-ignore
                                    return viagem.user === currentUser.email;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            <div>Utilizador:{viagem.user}</div>
                                            <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Ponto de partida:{viagem.startingpoint}</div>
                                            <div>Destino:{viagem.destination}</div>
                                            <div>Lugares:{viagem.seatingcapacity}</div>
                                            <Link to="/Editar/Viagem" state={viagem}>
                                                <button>Editar</button>
                                            </Link>

                                            <button onClick={() => Delete(viagem.id)}>Apagar</button>
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
            {tipo == 'PedidosBoleia próprios' && (
                <div className="container" id="lista">
                    {!isLoading && (
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
                                            <Link to="/Editar/Boleia" state={boleia}>
                                                <button>Editar</button>
                                            </Link>
                                            <button onClick={() => Delete(boleia.id)}>Apagar</button>
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
        </>
    );
}

export default Trips;
