import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { signInUser } from '../firebase.ts';
import '.././App.css';

const defaultFormFields = {
    email: '',
    password: ''
};

function Login() {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const navigate = useNavigate();

    const resetFormFields = () => {
        return setFormFields(defaultFormFields);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            // Send the email and password to firebase
            const userCredential = await signInUser(email, password);

            if (userCredential) {
                resetFormFields();
                navigate('/profile');
            }
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
            <div>
                <h3>Página Login</h3>
            </div>
            <div className="App">
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                className="InputEmail"
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div>
                            <input
                                className="InputPassword"
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div>
                            <input className="Button" id="recaptcha" type="submit" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
