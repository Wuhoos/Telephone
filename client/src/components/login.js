import React, {useState} from 'react';
import SignUpForm from './signUpForm';
import LoginForm from './loginForm';


function Login({onLogin}) {
    
    const [showLogin, setShowLogin] = useState(true)

    return (
        <div>
            {/* <h1>Telephone</h1> */}
            {showLogin ? (
                <>
                <LoginForm onLogin={onLogin}/>
                <p>Need a account?
                    <button onClick={() => setShowLogin(false)}>
                        Sign Up
                    </button>
                </p>
                </>
            ) : (
                <>
                    <SignUpForm onLogin={onLogin}/>
                    <p>
                        Have an account?
                        <button onClick={() => setShowLogin(true)}>
                            Log In
                        </button>
                    </p>
                </>
            )}
        </div>
    )
}

export default Login