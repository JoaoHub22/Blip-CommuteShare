/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, updateDoc, getDocs, getFirestore, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { QuerySnapshot } from 'firebase-admin/firestore';

import { AuthContext } from '../context/auth-context';
import ImagemPerfil from '../assets/profile-circle-icon-2048x2048-cqe5466q.png';

import './ProfileEdit.scss';

interface Profiles {
    id: string;
    description: string;
    email: string;
    username: string;
}

function ProfileEdit() {
    const { currentUser, signOut } = useContext(AuthContext);
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const location = useLocation();
    const firestore = getFirestore();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<Profiles[]>([]);
    const ProfileList = collection(firestore, 'Profiles');
    const [description, setDescription] = useState(location.state.description);
    const [username, setUsername] = useState(location.state.username);
    const [password, setPassword] = useState();
    const [Newpassword, setNewPassword] = useState();
    const [Editmode, setEditmode] = useState(false);
    const [ConfirmDeletion, setConfirmDeletion] = useState(false);

    const SaveProfile = async () => {
        try {
            const grupoteste = query(ProfileList, where('email', '==', location.state.email));
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
        } catch (ex) {
            // eslint-disable-next-line no-console
            console.log(ex);
        }
    };

    const AccountDeletion = async () => {
        try {
            const Viagens = query(collection(firestore, 'Viagens'), where('user', '==', location.state.email));
            const ViagensSnapshot = await getDocs(Viagens);

            ViagensSnapshot.forEach(document => {
                const docID = document.id;
                const docRef = doc(collection(firestore, 'Viagens'), docID);

                deleteDoc(docRef);
            });

            const PedidosBoleia = query(collection(firestore, 'PedidosBoleia'), where('user', '==', location.state.email));
            const PedidosBoleiaSnapshot = await getDocs(PedidosBoleia);

            PedidosBoleiaSnapshot.forEach(document => {
                const docID = document.id;
                const docRef = doc(collection(firestore, 'PedidosBoleia'), docID);

                deleteDoc(docRef);
            });

            const Profiles = query(collection(firestore, 'Profiles'), where('email', '==', location.state.email));
            const ProfilesSnapshot = await getDocs(Profiles);

            ProfilesSnapshot.forEach(document => {
                const docID = document.id;
                const docRef = doc(collection(firestore, 'Profiles'), docID);

                deleteDoc(docRef);
            });

            signOut();

            deleteUser(user)
                .then(() => {
                    toast.show({
                        title: 'Conta apagada',
                        content: 'Conta já não existe',
                        duration: 10000
                    });
                })
                .catch(error => {
                    // An error ocurred
                    // ...
                });
        } catch (ex) {
            toast.show({
                title: 'Erro',
                content: 'Falha a apagar conta',
                duration: 10000
            });
        }
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/Login');
        }

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
                        <div className="container" id="UserData">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <h3>Nome de utilizador:</h3>
                                    <input className="input-group" value={username} onChange={e => setUsername(e.currentTarget.value)}></input>
                                    <h3>Descrição:</h3>
                                    <input className="input-group" value={description} onChange={e => setDescription(e.currentTarget.value)}></input>
                                    <Link to="/Perfil" state={location.state.email}>
                                        <button className="button" onClick={() => SaveProfile()}>
                                            Confirmar
                                        </button>
                                    </Link>
                                    <Link to="/Perfil" state={location.state.email}>
                                        <button className="button">Cancelar</button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
                {isLoading && (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {ConfirmDeletion ? (
                    <Link to="/Login">
                        <button className="button" onClick={() => AccountDeletion()}>
                            Confirmar?
                        </button>
                    </Link>
                ) : (
                    <button className="button" onClick={() => setConfirmDeletion(true)}>
                        Apagar Conta
                    </button>
                )}
            </div>
        </>
    );
}

export default ProfileEdit;
