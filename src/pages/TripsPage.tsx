import { useContext, useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';

import { AuthContext } from '../context/auth-context';

import './TripsPage.scss';

interface DetalhesViagem {
    destino: string;
    utilizador: string;
    hora: string;
    seatingcapacity: string;
}

interface DetalhesBoleia {
    destino: string;
    utilizador: string;
    hora: string;
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

    useEffect(() => {
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
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search"></input>
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
            <a href="/Adicionar">Adicionar pedido de boleia/viagem</a>
            {tipo == 'Viagens' && (
                <div className="container" id="lista">
                    {!isLoading && (
                        <ul className="list-group">
                            {viagens.map(viagem => {
                                return (
                                    <li className="list-group-item" key={viagem.destino}>
                                        <div>Utilizador:{viagem.utilizador}</div>
                                        <div>Hora:{viagem.hora}</div>
                                        <div>Destino:{viagem.destino}</div>
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
                                    <li className="list-group-item" key={boleia.destino}>
                                        <div>Utilizador:{boleia.utilizador}</div>
                                        <div>Hora:{boleia.hora}</div>
                                        <div>Destino:{boleia.destino}</div>
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
                                    return viagem.utilizador === currentUser.email;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.destino}>
                                            <div>Utilizador:{viagem.utilizador}</div>
                                            <div>Hora:{viagem.hora}</div>
                                            <div>Destino:{viagem.destino}</div>
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
                                    return boleia.utilizador === currentUser.email;
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.destino}>
                                            <div>Utilizador:{boleia.utilizador}</div>
                                            <div>Hora:{boleia.hora}</div>
                                            <div>Destino:{boleia.destino}</div>
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
