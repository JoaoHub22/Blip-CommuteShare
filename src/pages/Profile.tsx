/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, updateDoc, getDocs, getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { AuthContext } from '../context/auth-context';
import ImagemPerfil from '../assets/profile-circle-icon-2048x2048-cqe5466q.png';

import './Profile.scss';

interface Profiles {
    id: string;
    description: string;
    email: string;
    username: string;
}

function Profile() {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state;
    const firestore = getFirestore();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<Profiles[]>([]);
    const [viagens, setViagens] = useState<DetalhesViagem[]>([]);
    const [boleias, setBoleias] = useState<DetalhesBoleia[]>([]);
    const ProfileList = collection(firestore, 'Profiles');
    const ListaViagens = collection(firestore, 'Viagens');
    const ListaPedidosBoleia = collection(firestore, 'PedidosBoleia');
    const [description, setDescription] = useState();
    const [username, setUsername] = useState();
    const [Editmode, setEditmode] = useState(false);

    const ChangetoEdit = async perfil => {
        setUsername(perfil.username);
        setDescription(perfil.description);
        setEditmode(true);
    };

    const SaveProfile = async () => {
        try {
            const grupoteste = query(ProfileList, where('email', '==', email));
            const querySnapshot = await getDocs(grupoteste);

            let docID = null;

            querySnapshot.forEach(doc => {
                docID = doc.id;
            });

            if (docID) {
                const docRef = doc(ProfileList, docID);

                await updateDoc(docRef, {
                    description: description,
                    username: username
                });
            }
            setEditmode(false);
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

            const grupo = onSnapshot(ListaViagens, where('user', '==', email), querySnapshot => {
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

            const grupo = onSnapshot(ListaPedidosBoleia, where('user', '==', email), querySnapshot => {
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
            const grupoteste = query(ProfileList);
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
            <div className="container" id="lista">
                {!isLoading && (
                    <>
                        <img src={ImagemPerfil} alt="" width="100" height="100" />
                        <div className="container">
                            <ul className="list-group">
                                {profile
                                    .filter(perfil => {
                                        //@ts-ignore
                                        return perfil.email === email;
                                    })
                                    .map(perfil => {
                                        return (
                                            <>
                                                <li className="list-group-item" key={perfil.email}>
                                                    <h2>{perfil.username}</h2>
                                                    <h3>Descrição:</h3>
                                                    <div>{perfil.description}</div>
                                                    {perfil.email === currentUser.email && (
                                                        <Link to="/PerfilEditar" state={perfil}>
                                                            <button className="button">Configurações</button>
                                                        </Link>
                                                    )}
                                                </li>
                                            </>
                                        );
                                    })}
                            </ul>
                        </div>
                    </>
                )}
                {isLoading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
            </div>
            <div className="container" id="PerfilListaViagens">
                {!isLoading && (
                    <>
                        <h3>Viagens</h3>
                        <ul className="list-group">
                            {viagens
                                .filter(viagem => {
                                    //@ts-ignore
                                    return viagem.user === email;
                                })
                                .map(viagem => {
                                    return (
                                        <li className="list-group-item" key={viagem.id}>
                                            {profile
                                                .filter(perfil => {
                                                    return perfil.email === viagem.user;
                                                })

                                                .map(perfil => {
                                                    return <div key={perfil.email}>Utilizador:{perfil.username}</div>;
                                                })}
                                            <div>Data: {new Date(Number(`${viagem.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>
                                                Percurso: {viagem.startingpoint}-{viagem.destination}
                                            </div>
                                            <div>
                                                Lugares:{viagem.BoleiasPedidos.length + 1}/{viagem.seatingcapacity}
                                            </div>
                                            {viagem.BoleiasPedidos.length + 1 < viagem.seatingcapacity && viagem.user != currentUser.email && (
                                                <Link to="/PedirBoleia" state={viagem}>
                                                    <button className="button">Pedir boleia</button>
                                                </Link>
                                            )}
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
            <div className="container" id="PerfilListaBoleias">
                {!isLoading && (
                    <>
                        <h3>Boleias</h3>
                        <ul className="list-group">
                            {boleias
                                .filter(boleia => {
                                    //@ts-ignore
                                    return boleia.user === email;
                                })
                                .map(boleia => {
                                    return (
                                        <li className="list-group-item" key={boleia.id}>
                                            <div>Utilizador:{boleia.user}</div>
                                            <div>Data: {new Date(Number(`${boleia.date.seconds}000`)).toLocaleString('PT-PT')}</div>
                                            <div>Local para apanhar:{boleia.pickuplocation}</div>
                                            <div>Destino:{boleia.destination}</div>
                                            {boleia.ViagemAceite === '' && boleia.user != currentUser.email && (
                                                <Link to="/OferecerBoleia" state={boleia}>
                                                    <button className="button">Oferecer boleia</button>
                                                </Link>
                                            )}
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

export default Profile;
