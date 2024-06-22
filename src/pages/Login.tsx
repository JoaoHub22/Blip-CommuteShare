import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, ChangeEvent, FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { signInUser } from '../firebase.ts';
import { toast } from '../components/toastmanager';
import { AuthContext } from '../context/auth-context.tsx';

import './Login.scss';

const defaultFormFields = {
    email: '',
    password: ''
};

function Login() {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const { signOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const resetFormFields = () => {
        return setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Send the email and password to firebase
            const userCredential = await signInUser(email, password);

            if (userCredential?.user.emailVerified) {
                resetFormFields();
                navigate('/Home');
            } else {
                signOut();
                toast.show({
                    title: 'Login rejeitado',
                    content: 'Ainda não fez a verificação por email',
                    duration: 10000
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.show({
                title: 'Login falhou',
                content: 'Dados mal introduzidos',
                duration: 10000
            });
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <div className="d-flex align-items-center py-4 bg-body-tertiary">
            <main className="form-signin w-100 m-auto">
                <form onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

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

                    <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            Remember me
                        </label>
                    </div>
                    <button className="btn btn-primary w-100 py-2" type="submit">
                        Sign in
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Login;
