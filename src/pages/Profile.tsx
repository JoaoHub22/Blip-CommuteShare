/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, updateDoc, getDocs, getFirestore } from 'firebase/firestore';

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
    const firestore = getFirestore();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<Profiles[]>([]);
    const ProfileList = collection(firestore, 'Profiles');
    const [description, setDescription] = useState();
    const [username, setUsername] = useState();
    const [Editmode, setEditmode] = useState(false);

    const SaveProfile = async () => {
        try {
            const grupoteste = query(ProfileList, where('email', '==', currentUser.email));
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
    }, []);

    return (
        <div className="container" id="lista">
            {!isLoading && (
                <>
                    <img src={ImagemPerfil} alt="" width="100" height="100" />
                    <div className="container">
                        <ul className="list-group">
                            {profile.map(perfil => {
                                return (
                                    <>
                                        {Editmode ? (
                                            <li className="list-group-item" key={perfil.id}>
                                                <h3>Nome de utilizador:</h3>
                                                <input className="input-group" onChange={e => setUsername(e.currentTarget.value)}>
                                                    {username}
                                                </input>
                                                <h3>Descrição:</h3>
                                                <input className="input-group" onChange={e => setDescription(e.currentTarget.value)}>
                                                    {description}
                                                </input>
                                                <button onClick={() => SaveProfile()}>Confirmar</button>
                                                <button onClick={() => setEditmode(false)}>Cancelar</button>
                                            </li>
                                        ) : (
                                            <li className="list-group-item" key={perfil.id}>
                                                <h2>{perfil.username}</h2>
                                                <h3>Descrição:</h3>
                                                <div>{perfil.description}</div>
                                                <button onClick={() => setEditmode(true)}>Editar</button>
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
