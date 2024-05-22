/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';

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

    const [Editmode, setEditmode] = useState(false);

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
                                            <>
                                                <h2>{perfil.username}</h2>
                                                <h3>Descrição:</h3>
                                                <div>{perfil.description}</div>
                                                <button>Confirmar</button>
                                                <button>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <h2>Utilizador:{perfil.username}</h2>
                                                <h3>Descrição:</h3>
                                                <div>{perfil.description}</div>
                                                <button>Editar</button>
                                            </>
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
