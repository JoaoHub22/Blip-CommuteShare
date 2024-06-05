/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, deleteDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';
import ImagemPerfil from '../assets/profile-circle-icon-2048x2048-cqe5466q.png';

import './Home.scss';

interface Profiles {
    id: string;
    description: string;
    email: string;
    username: string;
}

function Home() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const firestore = getFirestore();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<Profiles[]>([]);
    const ProfileList = collection(firestore, 'Profiles');
    const [username, setUsername] = useState();
    const [viagens, setViagens] = useState<DetalhesViagem[]>([]);
    const [tipo, setTipo] = useState('Viagens');
    const [boleias, setBoleias] = useState<DetalhesBoleia[]>([]);
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');

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
            const items = [];
            const grupoteste = query(ProfileList, where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(grupoteste);

            querySnapshot.forEach(doc => {
                items.push(doc.data());
            });
            setProfile(items);
            setIsLoading(false);

            return () => {
                grupo();
            };
        };

        handleGetProfile();
    }, [currentUser, navigate]);

    return (
        <>
            <h3>Bem vindos</h3>
            <img src={ImagemPerfil} alt="" width="50" height="50" />
            {profile.map(perfil => {
                return <h3 key={perfil.id}>{perfil.username}</h3>;
            })}
            <div className="container" id="listaViagens">
                {!isLoading && (
                    <>
                        <h3>Viagens</h3>
                        <ul className="list-group">
                            {viagens.map(viagem => {
                                return (
                                    <li className="list-group-item" key={viagem.id}>
                                        <div>Utilizador:{viagem.user}</div>
                                        <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                        <div>Ponto de partida:{viagem.startingpoint}</div>
                                        <div>Destino:{viagem.destination}</div>
                                        <div>
                                            Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
                {isLoading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
            <div className="container" id="listaPedidosBoleia">
                {!isLoading && (
                    <>
                        <h3>Pedidos de boleia</h3>
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
                    </>
                )}
                {isLoading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
            <div className="container" id="listaViagensProprias">
                {!isLoading && (
                    <>
                        <h3>As tuas viagens</h3>
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
                                            <div>
                                                Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                            </div>
                                            {/* <button onClick={() => teste(viagem.id)}>Mostrar pedidos aceites</button> */}
                                        </li>
                                    );
                                })}
                        </ul>
                    </>
                )}
                {isLoading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
            <div className="container" id="listaPedidosProprios">
                {!isLoading && (
                    <>
                        <h3>Os teus pedidos de boleia</h3>
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
                                        </li>
                                    );
                                })}
                        </ul>
                    </>
                )}
                {isLoading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
        </>
    );
}
export default Home;
