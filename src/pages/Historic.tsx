//@ts-nocheck

import { useContext, useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';

import './Historic.scss';

interface DetalhesViagem {
    id: string;
    BoleiasPedidos: Array;
    startingpoint: string;
    destination: string;
    date: string;
    frequency: string;
    user: string;
    seatingcapacity: number;
}

interface DetalhesBoleia {
    id: string;
    pickuplocation: string;
    destination: string;
    date: string;
    user: string;
    ViagemAceite: string;
}

function HistoricoViagens() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [viagens, setViagens] = useState<DetalhesViagem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tipo, setTipo] = useState('Viagens');
    const [boleias, setBoleias] = useState<DetalhesBoleia[]>([]);
    const firestore = getFirestore();
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');
    // const [filter, setFilter] = useState('');
    const [Mostrarpedidos, setMostrarpedidos] = useState(false);
    const [pedidos, setPedidos] = useState<DetalhesBoleia[]>([]);
    const [viagemAceitadaid, setViagemAceitadaid] = useState();

    const ChangeType = async typechosen => {
        setTipo(typechosen);
        setViagemAceitadaid();
        setMostrarpedidos(false);
    };

    const ViagemAceite = async boleiaid => {
        let i = 0;
        let foundtrip = false;

        viagens.forEach(viagem => {
            while (i < viagem.BoleiasPedidos.length && foundtrip === false) {
                if (boleiaid === viagem.BoleiasPedidos[i]) {
                    setViagemAceitadaid(viagem.id);
                    foundtrip = true;
                }
                i++;
            }
            i = 0;
        });
    };

    const PedidosBoleia = async viagem => {
        const boleiasid: string[] = viagem.BoleiasPedidos;
        const listapedidos: DetalhesBoleia[] = [];

        let i = 0;

        boleias.forEach(boleia => {
            while (i < boleiasid.length) {
                if (boleia.id === boleiasid[i]) {
                    listapedidos.push(boleiasid[i]);
                }
                i = i + 1;
            }
            i = 0;
        });

        setMostrarpedidos(true);

        setPedidos(listapedidos);
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

        const handleGetProfile = async () => {
            setIsLoading(true);
            const grupo = onSnapshot(ProfileList, querySnapshot => {
                const items = [];

                querySnapshot.forEach(doc => {
                    items.push(doc.data());
                });
                //@ts-ignore
                setProfiles(items);
                setIsLoading(false);
            });

            return () => {
                grupo();
            };
        };

        handleGetProfile();
    }, [currentUser, navigate]);

    return (
        <div className="container">
            <h3>Histórico</h3>
            <select
                id="SelectList"
                className="form-select form-select-sm"
                aria-label="Small select example"
                onChange={e => ChangeType(e.currentTarget.value)}
            >
                <option value="Viagens">Viagens</option>
                <option value="PedidosBoleia">Pedidos de boleia</option>
            </select>
            {tipo == 'Viagens' && (
                <div className="container" id="ListGroup">
                    {!isLoading && (
                        <ul className="list-group">
                            {viagens
                                .filter(viagem => {
                                    return viagem.user === currentUser.email && Number(`${viagem.date.seconds}000`) < Number(new Date());
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            <div id="ItemUser">Utilizador:{viagem.user}</div>

                                            <div id="ItemDate">Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div id="ItemStartingPoint">
                                                Percurso:{viagem.startingpoint}-{viagem.destination}
                                            </div>

                                            <div id="ItemSeatingCapacity">
                                                Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                            </div>
                                            {viagem.BoleiasPedidos.length != 0 && (
                                                <button className="button" onClick={() => PedidosBoleia(viagem)}>
                                                    Mostrar pedidos aceites
                                                </button>
                                            )}
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
                <div className="container" id="ListGroup">
                    {!isLoading && (
                        <ul className="list-group">
                            {boleias
                                .filter(boleia => {
                                    return boleia.user === currentUser.email && Number(`${boleia.date.seconds}000`) < Number(new Date());
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.id}>
                                            <div>Utilizador:{boleia.user}</div>
                                            <div id="ItemDate">Data: {new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div id="ItemPickupLocation">Local para apanhar:{boleia.pickuplocation}</div>
                                            <div id="ItemDestination">Destino:{boleia.destination}</div>
                                            {boleia.ViagemAceite != '' && (
                                                <button className="button" onClick={() => ViagemAceite(boleia.id)}>
                                                    Mostrar viagem aceite
                                                </button>
                                            )}
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
            {Mostrarpedidos && (
                <div className="container" id="listaPedidos">
                    <h3>Pedidos de boleia</h3>
                    {!isLoading && (
                        <ul className="list-group">
                            {boleias
                                .filter(boleia => {
                                    let i = 0;

                                    while (i < pedidos.length) {
                                        if (boleia.id === pedidos[i]) {
                                            return boleia.id === pedidos[i];
                                        }

                                        i++;
                                    }
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.id}>
                                            <div id="ItemUser">Utilizador:{boleia.user}</div>
                                            <div id="ItemDate">Data:{new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
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
            {viagemAceitadaid != null && (
                <div className="container" id="listaPedidos">
                    <h3>Viagem aceite</h3>
                    {!isLoading && (
                        <ul className="list-group">
                            {viagens
                                .filter(viagem => {
                                    return viagem.id === viagemAceitadaid;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            <div>Utilizador:{viagem.user}</div>
                                            <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Ponto de partida:{viagem.startingpoint}</div>
                                            <div>Destino:{viagem.destination}</div>
                                            <div id="ItemSeatingCapacity">
                                                Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                            </div>
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

export default HistoricoViagens;
