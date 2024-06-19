/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, updateDoc, getDocs, getFirestore, doc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

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
    const ProfileList = collection(firestore, 'Profiles');
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
                                            {Editmode ? (
                                                <li className="list-group-item" key={perfil.id}>
                                                    <h3>Nome de utilizador:</h3>
                                                    <input
                                                        className="input-group"
                                                        value={username}
                                                        onChange={e => setUsername(e.currentTarget.value)}
                                                    ></input>
                                                    <h3>Descrição:</h3>
                                                    <input
                                                        className="input-group"
                                                        value={description}
                                                        onChange={e => setDescription(e.currentTarget.value)}
                                                    ></input>
                                                    <button onClick={() => SaveProfile()}>Confirmar</button>
                                                    <button onClick={() => setEditmode(false)}>Cancelar</button>
                                                </li>
                                            ) : (
                                                <li className="list-group-item" key={perfil.id}>
                                                    <h2>{perfil.username}</h2>
                                                    <h3>Descrição:</h3>
                                                    <div>{perfil.description}</div>
                                                    <button onClick={() => ChangetoEdit(perfil)}>Editar</button>
                                                </li>
                                            )}
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
    );
}

export default Profile;
