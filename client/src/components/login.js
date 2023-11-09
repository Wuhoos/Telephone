import React, {useState} from 'react';
import SignUpForm from './signUpForm';
import LoginForm from './loginForm';


function Login({onLogin}) {
    
    const [showLogin, setShowLogin] = useState(true)

    return (
        <div className='text-center ' >
            
            {showLogin ? (
                <div>
                <LoginForm onLogin={onLogin}/>
                    <div className='mt-6'>
                        <label className='underline font-bold p2 mr-6 ui black label'> Need a account?</label>
                        <button onClick={() => setShowLogin(false)} className='ml-4 my-6 font-bold ui black button'>
                            Sign Up
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <SignUpForm onLogin={onLogin}/>
                    <div className='mt-6'>
                        <label className='underline font-bold p2 mr-6 ui black label'> Have an account?</label>
                        <button onClick={() => setShowLogin(true)} className=' ml-4 my-4 font-bold ui black button'>
                            Log In
                        </button>
                    </div>
                </div>
            )}
            <img src='https://miro.medium.com/v2/resize:fit:1400/1*UwwRH_FLxcQfz-74HmqgMw.png' className='ui fluid image my-2'/>
        </div>
    )
}

export default Login