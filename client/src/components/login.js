import React, {useState} from 'react';
import SignUpForm from './signUpForm';
import LoginForm from './loginForm';


function Login({onLogin}) {
    
    const [showLogin, setShowLogin] = useState(true)

    return (
        <div className='text-center'>
            {/* <h1>Telephone</h1> */}
            {showLogin ? (
                <>
                <LoginForm onLogin={onLogin}/>
                <p className='underline'>Need a account?
                    <button onClick={() => setShowLogin(false)} className='ml-4 font-bold'>
                        Sign Up
                    </button>
                </p>
                </>
            ) : (
                <>
                    <SignUpForm onLogin={onLogin}/>
                    <p className='underline'>
                        Have an account?
                        <button onClick={() => setShowLogin(true)} className='ml-4 font-bold'>
                            Log In
                        </button>
                    </p>
                </>
            )}
        </div>
    )
}

export default Login