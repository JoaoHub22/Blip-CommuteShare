/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
//@ts-nocheck
import { v4 as uuid } from 'uuid';
import React, { useContext, useEffect, useState } from 'react';
import {
    collection,
    query,
    where,
    deleteDoc,
    getDocs,
    updateDoc,
    arrayUnion,
    getFirestore,
    onSnapshot,
    arrayRemove,
    doc,
    addDoc
} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { toast } from '../components/toastmanager';
import { AuthContext } from '../context/auth-context';

import './TripsPage.scss';

interface DetalhesViagem {
    id: string;
    BoleiasPedidos: Array;
    PedidosRecebidos: Array;
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
    ViagemAceite: string;
    ViagemOferecidas: Array;
}

interface Profiles {
    id: string;
    description: string;
    email: string;
    username: string;
}

function Trips() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [viagens, setViagens] = useState<DetalhesViagem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tipo, setTipo] = useState('Viagens');
    const [boleias, setBoleias] = useState<DetalhesBoleia[]>([]);
    const firestore = getFirestore();
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');
    const ProfileList = collection(firestore, 'Profiles');
    const NotificationsList = collection(firestore, 'Notifications');
    const [Destinationfilter, setDestinationFilter] = useState('');
    const [StartingPointfilter, setStartingPointFilter] = useState('');
    const [PickupLocationfilter, setPickupLocationFilter] = useState('');
    const [Mostrarpedidos, setMostrarpedidos] = useState(false);
    const [pedidosAceites, setPedidosAceites] = useState<DetalhesBoleia[]>([]);
    const [pedidosPorResponder, setPedidosPorResponder] = useState<DetalhesBoleia[]>([]);
    const [MostrarOfertas, setMostrarOfertas] = useState(false);
    const [ViagensOferecidas, setViagensOferecidas] = useState<DetalhesViagem[]>([]);
    const [viagemAceitadaid, setViagemAceitadaid] = useState();
    const [Profiles, setProfiles] = useState<Profiles[]>([]);

    const ChangeType = async typechosen => {
        setTipo(typechosen);
        setViagemAceitadaid();
        setMostrarpedidos(false);
        setMostrarOfertas(false);
    };

    const AceitarPedido = async boleia => {
        let i = 0;
        let foundtrip = false;
        let viagemdopedido = null;

        viagens.forEach(viagem => {
            while (i < viagem.PedidosRecebidos.length && foundtrip === false) {
                if (boleia.id === viagem.PedidosRecebidos[i]) {
                    viagemdopedido = viagem;

                    foundtrip = true;
                }
                i++;
            }
            i = 0;
        });

        try {
            const grupoteste = query(ListaPedidosBoleia, where('id', '==', boleia.id));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });
            if (docID) {
                const docRef = doc(ListaPedidosBoleia, docID);

                await updateDoc(docRef, {
                    ViagemAceite: viagemdopedido.id,
                    ViagensOferecidas: arrayRemove(viagemdopedido.id)
                });
            }
            toast.show({
                title: 'Mundança guardada',
                content: 'Viagem guardada no pedido de boleia',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Mudança no pedido não guardada',
                duration: 10000
            });
        }
        try {
            const grupoteste = query(ListaViagens, where('id', '==', viagemdopedido.id));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    BoleiasPedidos: arrayUnion(boleia.id),
                    PedidosRecebidos: arrayRemove(boleia.id)
                });
            }
            toast.show({
                title: 'Mudança guardada',
                content: 'Pedido de boleia incluído na viagem',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Mudança no pedido não guardada',
                duration: 10000
            });
        }
        try {
            await addDoc(NotificationsList, {
                email: boleia.user,
                Mensagem: 'O utilizador  ${viagemdopedido.user} aceitou o seu pedido de boleia',
                id: uuid(),
                Read: false
            });
            // }
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.log(ex);
        }
    };

    const RejeitarPedido = async boleia => {
        let i = 0;
        let foundtrip = false;
        let viagemid = '';

        viagens.forEach(viagem => {
            while (i < viagem.PedidosRecebidos.length && foundtrip === false) {
                if (boleia.id === viagem.PedidosRecebidos[i]) {
                    viagemid = viagem.id;

                    foundtrip = true;
                }
                i++;
            }
            i = 0;
        });

        try {
            const grupoteste = query(ListaViagens, where('id', '==', viagemid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    PedidosRecebidos: arrayRemove(boleia.id)
                });
            }
            toast.show({
                title: 'Pedido rejeitado',
                content: 'Pedido de boleia removido da viagem',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Mudança no pedido não guardada',
                duration: 10000
            });
        }
        await addDoc(NotificationsList, {
            email: boleia.user,
            Mensagem: 'O utilizador ${viagemdopedido.user} rejeitou o seu pedido de boleia',
            id: uuid(),
            Read: false
        });
    };

    const PedidosBoleia = async viagem => {
        const boleiasid: string[] = viagem.BoleiasPedidos;
        const pedidosboleiasid: string[] = viagem.PedidosRecebidos;
        const listaaceites: DetalhesBoleia[] = [];
        const listapedidos: DetalhesBoleia[] = [];

        console.log(viagem);
        let i = 0;

        boleias.forEach(boleia => {
            while (i < boleiasid.length) {
                if (boleia.id === boleiasid[i]) {
                    listaaceites.push(boleiasid[i]);
                }
                i = i + 1;
            }
            i = 0;
            while (i < pedidosboleiasid.length) {
                if (boleia.id === pedidosboleiasid[i]) {
                    listapedidos.push(pedidosboleiasid[i]);
                    console.log(pedidosboleiasid.length);
                }
                i = i + 1;
            }
            i = 0;
        });

        setMostrarpedidos(true);
        console.log(Mostrarpedidos);

        setPedidosAceites(listaaceites);
        setPedidosPorResponder(listapedidos);
        console.log(listaaceites);
        console.log(listapedidos);
    };

    const RemoverPassageiro = async boleiaid => {
        let i = 0;
        let foundtrip = false;
        let viagemid = '';

        viagens.forEach(viagem => {
            while (i < viagem.BoleiasPedidos.length && foundtrip === false) {
                if (boleiaid === viagem.BoleiasPedidos[i]) {
                    viagemid = viagem.id;

                    foundtrip = true;
                }
                i++;
            }
            i = 0;
        });

        try {
            const grupoteste = query(ListaPedidosBoleia, where('id', '==', boleiaid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });
            if (docID) {
                const docRef = doc(ListaPedidosBoleia, docID);

                await updateDoc(docRef, {
                    ViagemAceite: ''
                });
            }
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha na remoção da viagem do pedido de boleia',
                duration: 10000
            });
        }
        try {
            const grupoteste = query(ListaViagens, where('id', '==', viagemid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    BoleiasPedidos: arrayRemove(boleiaid)
                });
            }
            toast.show({
                title: 'Passageiro removido',
                content: 'Passageiro foi removido da tua viagem',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha na remoção do passageiro da viagem',
                duration: 10000
            });
        }
        await addDoc(NotificationsList, {
            email: boleia.user,
            Message: 'O utilizador  ${viagemdopedido.user} removeu-o da sua viagem',
            id: uuid(),
            Read: false
        });
    };

    const AceitarOferta = async viagemid => {
        let i = 0;
        let foundrequest = false;
        let boleiaid = '';

        boleias.forEach(boleia => {
            while (i < boleia.ViagensOferecidas.length && foundrequest === false) {
                if (viagemid === boleia.ViagensOferecidas[i]) {
                    boleiaid = boleia.id;

                    foundrequest = true;
                }
                i++;
            }
            i = 0;
        });

        try {
            const grupoteste = query(ListaPedidosBoleia, where('id', '==', boleiaid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });
            if (docID) {
                const docRef = doc(ListaPedidosBoleia, docID);

                await updateDoc(docRef, {
                    ViagemAceite: viagemid,
                    ViagensOferecidas: arrayRemove(viagemid)
                });
            }
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha a guardar o pedido na viagem',
                duration: 10000
            });
        }
        try {
            const grupoteste = query(ListaViagens, where('id', '==', viagemid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    PedidosBoleia: arrayUnion(boleiaid)
                });
            }
            toast.show({
                title: 'Oferta aceite',
                content: 'Faz parte da viagem na oferta',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha a guardar a oferta no pedido',
                duration: 10000
            });
        }
        await addDoc(NotificationsList, {
            email: viagem.user,
            Message: 'O utilizador ${viagemdopedido.user} aceitou a sua oferta de boleia',
            id: uuid(),
            Read: false
        });
    };

    const RejeitarOferta = async viagemid => {
        let i = 0;
        let foundrequest = false;
        let boleiaid = '';

        boleias.forEach(boleia => {
            while (i < boleia.ViagensOferecidas.length && foundrequest === false) {
                if (boleiaid === boleia.ViagensOferecidas[i]) {
                    boleiaid = boleia.id;

                    foundrequest = true;
                }
                i++;
            }
            i = 0;
        });

        try {
            const grupoteste = query(ListaPedidosBoleia, where('id', '==', boleiaid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });
            if (docID) {
                const docRef = doc(ListaPedidosBoleia, docID);

                await updateDoc(docRef, {
                    ViagensOferecidas: arrayRemove(viagemid)
                });
            }
            toast.show({
                title: 'Oferta rejeitada',
                content: 'Não entrou na viagem',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha a guardar a rejeição da oferta',
                duration: 10000
            });
        }
        await addDoc(NotificationsList, {
            email: viagem.user,
            Message: 'O utilizador ${viagemdopedido.user} rejeitou a sua oferta de boleia',
            id: uuid(),
            Read: false
        });
    };

    const OfertasBoleia = async boleia => {
        const viagemaceite: string = boleia.ViagemAceite;
        const ofertasViagensid: string[] = boleia.ViagensOferecidas;
        const listaofertas: DetalhesViagem[] = [];
        let i = 0;

        viagens.forEach(viagem => {
            while (i < ofertasViagensid.length) {
                if (viagem.id === ofertasViagensid[i]) {
                    listaofertas.push(ofertasViagensid[i]);
                }
                i++;
            }
            if (viagem.id === viagemaceite) {
                setViagemAceitadaid(viagem.id);
            }
            i = 0;
        });
        // ViagemAceite(boleia.id);
        setViagensOferecidas(listaofertas);
        setMostrarOfertas(true);
    };

    const SairDaViagem = async viagem => {
        let i = 0;
        let foundrequest = false;
        let boleiaid = '';

        boleias.forEach(boleia => {
            while (foundrequest === false) {
                if (viagem.id === boleia.ViagensOferecidas[i]) {
                    boleiaid = boleia.id;

                    foundrequest = true;
                }
                i++;
            }
            i = 0;
        });

        try {
            const grupoteste = query(ListaPedidosBoleia, where('id', '==', boleiaid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });
            if (docID) {
                const docRef = doc(ListaPedidosBoleia, docID);

                await updateDoc(docRef, {
                    ViagemAceite: ''
                });
            }
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha a remover a viagem do pedido',
                duration: 10000
            });
        }
        try {
            const grupoteste = query(ListaViagens, where('id', '==', viagemid));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ListaViagens, docID);

                await updateDoc(docRef, {
                    BoleiasPedidos: arrayRemove(boleiaid)
                });
            }
            await addDoc(NotificationsList, {
                email: boleia.user,
                Message: 'O utilizador  ${viagemdopedido.user} removeu-o da sua viagem',
                id: uuid(),
                Read: false
            });
            toast.show({
                title: 'Saiu da viagem',
                content: 'Não faz parte da viagem',
                duration: 10000
            });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha a sair da viagem',
                duration: 10000
            });
        }
    };

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
                toast.show({
                    title: 'Viagem removida',
                    content: 'Viagem já não faz parte da tua lista',
                    duration: 10000
                });
            } catch (ex) {
                toast.show({
                    title: 'Erro',
                    content: 'Falha a remover a viagem',
                    duration: 10000
                });
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
                toast.show({
                    title: 'Boleia apagada',
                    content: 'Boleia foi apagada',
                    duration: 10000
                });
            } catch (ex) {
                toast.show({
                    title: 'Erro',
                    content: 'Falha ao remover pedido de boleia',
                    duration: 10000
                });
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

        if (!currentUser) {
            navigate('/Login');
        } else {
            handleGetViagens();
            handleGetPedidosBoleia();
            handleGetProfile();
        }
    }, [currentUser, navigate]);

    return (
        <div className="container">
            <h3>Viagens</h3>
            <Popup trigger={<button className="button">Filtro</button>} position="right center">
                <div>Ponto de Partida</div>
                <input
                    type="search"
                    className="form-control"
                    onChange={e => setStartingPointFilter(e.currentTarget.value)}
                    placeholder="Search..."
                    aria-label="Search"
                ></input>
                <div>Destino</div>
                <input
                    type="search"
                    className="form-control"
                    onChange={e => setDestinationFilter(e.currentTarget.value)}
                    placeholder="Search..."
                    aria-label="Search"
                ></input>
                <div>Local de boleia</div>
                <input
                    type="search"
                    className="form-control"
                    onChange={e => setPickupLocationFilter(e.currentTarget.value)}
                    placeholder="Search..."
                    aria-label="Search"
                ></input>
            </Popup>

            <select
                id="SelectList"
                className="form-select form-select-sm"
                aria-label="Small select example"
                onChange={e => ChangeType(e.currentTarget.value)}
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
                                    if (StartingPointfilter != '') {
                                        return viagem.startingpoint.includes(StartingPointfilter);
                                    } else return viagem;
                                })
                                .filter(viagem => {
                                    if (Destinationfilter != '') {
                                        return viagem.destination.includes(Destinationfilter);
                                    } else return viagem;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            {Profiles.filter(perfil => {
                                                return perfil.email === viagem.user;
                                            }).map(perfil => {
                                                return (
                                                    <div id="ItemUser" key={perfil.email}>
                                                        Utilizador:{perfil.username}
                                                    </div>
                                                );
                                            })}
                                            <div id="ItemDate">Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div id="ItemStartingPoint">
                                                Percurso: {viagem.startingpoint}-{viagem.destination}
                                            </div>
                                            <div id="ItemSeatingCapacity">
                                                Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                            </div>
                                            {viagem.BoleiasPedidos.length + 1 < viagem.seatingcapacity && viagem.user != currentUser.email && (
                                                <Link to="/PedirBoleia" state={viagem}>
                                                    <button className="button">Pedir boleia</button>
                                                </Link>
                                            )}
                                            <Link to="/Perfil" state={viagem.user}>
                                                <button className="button">Ver Perfil</button>
                                            </Link>
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
                            {boleias
                                .filter(boleia => {
                                    if (Destinationfilter != '') {
                                        return boleia.destination.includes(Destinationfilter);
                                    } else return boleia;
                                })
                                .filter(boleia => {
                                    if (PickupLocationfilter != '') {
                                        return boleia.pickuplocation.includes(PickupLocationfilter);
                                    } else return boleia;
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.id}>
                                            {Profiles.filter(perfil => {
                                                return perfil.email === boleia.user;
                                            }).map(perfil => {
                                                return (
                                                    <div id="ItemUser" key={perfil.email}>
                                                        Utilizador:{perfil.username}
                                                    </div>
                                                );
                                            })}
                                            <div id="ItemDate">Data: {new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div id="ItemPickupLocation">Local para apanhar:{boleia.pickuplocation}</div>
                                            <div>Destino:{boleia.destination}</div>
                                            {boleia.ViagemAceite === '' && boleia.user != currentUser.email && (
                                                <Link to="/OferecerBoleia" state={boleia}>
                                                    <button className="button">Oferecer boleia</button>
                                                </Link>
                                            )}
                                            <Link to="/Perfil" state={boleia.user}>
                                                <button className="button">Ver Perfil</button>
                                            </Link>
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
                                .filter(viagem => {
                                    if (Destinationfilter != '') {
                                        return viagem.destination.includes(Destinationfilter);
                                    } else return viagem;
                                })
                                .filter(viagem => {
                                    if (StartingPointfilter != '') {
                                        return viagem.startingpoint.includes(StartingPointfilter);
                                    } else return viagem;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            {Profiles.filter(perfil => {
                                                return perfil.email === viagem.user;
                                            }).map(perfil => {
                                                return (
                                                    <div id="ItemUser" key={perfil.email}>
                                                        Utilizador:{perfil.username}
                                                    </div>
                                                );
                                            })}
                                            <div id="ItemDate">Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Ponto de partida:{viagem.startingpoint}</div>
                                            <div>Destino:{viagem.destination}</div>
                                            <div>
                                                Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                            </div>
                                            <Link to="/Editar/Viagem" state={viagem}>
                                                <button className="button">Editar</button>
                                            </Link>
                                            <button className="button" onClick={() => Delete(viagem.id)}>
                                                Apagar
                                            </button>
                                            <button className="button" onClick={() => PedidosBoleia(viagem)}>
                                                Mostrar pedidos de boleia
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
            {tipo == 'PedidosBoleia próprios' && (
                <div className="container" id="lista">
                    {!isLoading && (
                        <ul className="list-group">
                            {boleias
                                .filter(boleia => {
                                    //@ts-ignore
                                    return boleia.user === currentUser.email;
                                })
                                .filter(boleia => {
                                    if (Destinationfilter != '') {
                                        return boleia.destination.includes(Destinationfilter);
                                    } else return boleia;
                                })
                                .filter(boleia => {
                                    if (PickupLocationfilter != '') {
                                        return boleia.pickuplocation.includes(PickupLocationfilter);
                                    } else return boleia;
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.id}>
                                            {Profiles.filter(perfil => {
                                                return perfil.email === boleia.user;
                                            }).map(perfil => {
                                                return (
                                                    <div id="ItemUser" key={perfil.email}>
                                                        Utilizador:{perfil.username}
                                                    </div>
                                                );
                                            })}
                                            <div id="ItemDate">Data:{new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Local para apanhar:{boleia.pickuplocation}</div>
                                            <div>Destino:{boleia.destination}</div>
                                            <Link to="/Editar/Boleia" state={boleia}>
                                                <button className="button" type="button">
                                                    Editar
                                                </button>
                                            </Link>
                                            <button className="button" onClick={() => Delete(boleia.id)}>
                                                Apagar
                                            </button>

                                            <button className="button" onClick={() => OfertasBoleia(boleia)}>
                                                Mostrar ofertas de boleia
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
            {Mostrarpedidos && (
                <>
                    <h3 id="titulo1">Pedidos de boleia aceites</h3>
                    <div className="container" id="listaPedidos">
                        {!isLoading && (
                            <ul className="list-group">
                                {boleias
                                    .filter(boleia => {
                                        let i = 0;

                                        while (i < pedidosAceites.length) {
                                            if (boleia.id === pedidosAceites[i]) {
                                                return boleia.id === pedidosAceites[i];
                                            }

                                            i++;
                                        }
                                    })
                                    .map(boleia => {
                                        return (
                                            <li className="list-group-item" key={boleia.id}>
                                                {Profiles.filter(perfil => {
                                                    return perfil.email === boleia.user;
                                                }).map(perfil => {
                                                    return (
                                                        <div id="ItemUser" key={perfil.email}>
                                                            Utilizador:{perfil.username}
                                                        </div>
                                                    );
                                                })}
                                                <div id="ItemDate">Data:{new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                                <div>Local para apanhar:{boleia.pickuplocation}</div>
                                                <div>Destino:{boleia.destination}</div>
                                                <button className="button" onClick={() => RemoverPassageiro(boleia.id)}>
                                                    Remover passageiro
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
                    <h3 id="titulo2">Pedidos de boleia por verificar</h3>
                    <div className="container" id="listaPedidos2">
                        {!isLoading && (
                            <ul className="list-group">
                                {boleias
                                    .filter(boleia => {
                                        let i = 0;

                                        while (i < pedidosPorResponder.length) {
                                            if (boleia.id === pedidosPorResponder[i]) {
                                                return boleia.id === pedidosPorResponder[i];
                                            }

                                            i++;
                                        }
                                    })
                                    .map(boleia => {
                                        return (
                                            <li className="list-group-item" key={boleia.id}>
                                                {Profiles.filter(perfil => {
                                                    return perfil.email === boleia.user;
                                                }).map(perfil => {
                                                    return (
                                                        <div id="ItemUser" key={perfil.email}>
                                                            Utilizador:{perfil.username}
                                                        </div>
                                                    );
                                                })}
                                                <div>Data:{new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                                <div>Local para apanhar:{boleia.pickuplocation}</div>
                                                <div>Destino:{boleia.destination}</div>
                                                <button className="button" onClick={() => AceitarPedido(boleia)}>
                                                    Aceitar pedido
                                                </button>
                                                <button className="button" onClick={() => RejeitarPedido(boleia)}>
                                                    Rejeitar pedido
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
                </>
            )}
            {MostrarOfertas && (
                <>
                    <h3 id="titulo1">Viagem aceite</h3>
                    <div className="container" id="listaPedidos">
                        {!isLoading && (
                            <ul className="list-group">
                                {viagens
                                    .filter(viagem => {
                                        return viagem.id === viagemAceitadaid;
                                    })
                                    .map(viagem => {
                                        return (
                                            <li className="list-group-item" key={viagem.id}>
                                                {Profiles.filter(perfil => {
                                                    return perfil.email === viagem.user;
                                                }).map(perfil => {
                                                    return (
                                                        <div id="ItemUser" key={perfil.email}>
                                                            Utilizador:{perfil.username}
                                                        </div>
                                                    );
                                                })}
                                                <div id="ItemDate">Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                                <div id="ItemStartingPoint">
                                                    Percurso:{viagem.startingpoint}-{viagem.destination}
                                                </div>

                                                <div id="ItemSeatingCapacity">
                                                    Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                                </div>
                                                <button className="button" onClick={() => SairDaViagem(viagem.id)}>
                                                    Sair de viagem
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
                    <h3 id="titulo2">Ofertas oferecidas</h3>
                    <div className="container" id="listaPedidos2">
                        {!isLoading && (
                            <ul className="list-group">
                                {viagens
                                    .filter(viagem => {
                                        let i = 0;

                                        while (i < ViagensOferecidas.length) {
                                            if (viagem.id === ViagensOferecidas[i]) {
                                                return viagem.id === ViagensOferecidas[i];
                                            }
                                            i++;
                                        }
                                    })
                                    .map(viagem => {
                                        return (
                                            <li className="list-group-item" key={viagem.id}>
                                                {Profiles.filter(perfil => {
                                                    return perfil.email === viagem.user;
                                                }).map(perfil => {
                                                    return (
                                                        <div id="ItemUser" key={perfil.email}>
                                                            Utilizador:{perfil.username}
                                                        </div>
                                                    );
                                                })}
                                                <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                                <div>
                                                    Percurso:{viagem.startingpoint}-{viagem.destination}
                                                </div>
                                                <div>
                                                    Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                                </div>
                                                <button className="button" onClick={() => AceitarOferta(viagem.id)}>
                                                    Aceitar oferta
                                                </button>
                                                <button className="button" onClick={() => RejeitarOferta(viagem.id)}>
                                                    Rejeitar oferta
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
                </>
            )}
            <container id="Map"></container>
        </div>
    );
}

export default Trips;
