import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getAuth, sendEmailVerification } from 'firebase/auth';

import { toast } from '../components/toastmanager.tsx';
import { CreateAccount } from '../firebase.ts';
import '.././App.css';

import './Register.scss';

const defaultFormFields = {
    email: '',
    password: ''
};

function Register() {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const firestore = getFirestore();
    const ListaPerfis = collection(firestore, 'Profiles');
    const [username, setUsername] = useState();
    const [description, setDescription] = useState();
    const { email, password } = formFields;
    const navigate = useNavigate();

    const resetFormFields = () => {
        return setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Send the email and password to firebase
            const userCredential = await CreateAccount(email, password);

            if (userCredential) {
                addDoc(ListaPerfis, { description: description, email: email, username: username });
                resetFormFields();
                navigate('/Home');
            }
            const auth = getAuth();

            //@ts-ignore
            sendEmailVerification(auth.currentUser).then(() => {
                toast.show({
                    title: 'Conta criada',
                    content: 'Foi enviada uma mensagem ao seu email para verificar a conta',
                    duration: 10000
                });
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.log('User Sign In Failed', error.message);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <>
            <div className="d-flex align-items-center py-4 bg-body-tertiary">
                <main className="form-signin w-100 m-auto">
                    <form onSubmit={handleSubmit}>
                        <h1 className="h3 mb-3 fw-normal">Please register Account</h1>

                        <div className="form-floating">
                            <input
                                type="username"
                                name="username"
                                value={username}
                                //@ts-ignore
                                onChange={e => setUsername(e.currentTarget.value)}
                                className="form-control"
                                placeholder="Username"
                            />
                            <label htmlFor="floatingUsername">Username</label>
                        </div>

                        <div className="form-floating">
                            <input
                                type="username"
                                name="username"
                                value={description}
                                //@ts-ignore
                                onChange={e => setDescription(e.currentTarget.value)}
                                className="form-control"
                                placeholder="Description"
                            />
                            <label htmlFor="floatingDescription">Description</label>
                        </div>

                        <div className="form-floating">
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        <button className="btn btn-primary w-100 py-2" type="submit">
                            Sign in
                        </button>
                    </form>
                </main>
            </div>
        </>
    );
}

export default Register;
