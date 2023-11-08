import React, {useState} from 'react';
import SignUpForm from './signUpForm';
import LoginForm from './loginForm';


function Login({onLogin}) {
    
    const [showLogin, setShowLogin] = useState(true)

    return (
        <div className='text-center'>
            
            {showLogin ? (
                <div>
                <LoginForm onLogin={onLogin}/>
                <div>
                    <p className='underline p2'> Need a account?</p>
                    <button onClick={() => setShowLogin(false)} className='font-bold ui black button'>
                        Sign Up
                    </button>
                </div>
                </div>
            ) : (
                <div>
                    <SignUpForm onLogin={onLogin}/>
                    <div>
                        <p className='underline'></p>
                            Have an account?
                            <button onClick={() => setShowLogin(true)} className='ui black button ml-4 font-bold '>
                                Log In
                            </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login