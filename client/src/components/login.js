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
                        <label className='underline p2'> Need a account?</label>
                        <button onClick={() => setShowLogin(false)} className='ml-4 my-4 font-bold'>
                            Sign Up
                        </button>
                    </div>
                    <img src='https://miro.medium.com/v2/resize:fit:1400/1*UwwRH_FLxcQfz-74HmqgMw.png' class='ui fluid image'/>
                </div>
            ) : (
                <div>
                    <SignUpForm onLogin={onLogin}/>
                    <div>
                        <label className='underline'> Have an account?</label>
                        <button onClick={() => setShowLogin(true)} className=' ml-4 my-4 font-bold '>
                            Log In
                        </button>
                    </div>
                    <img src='https://miro.medium.com/v2/resize:fit:1400/1*UwwRH_FLxcQfz-74HmqgMw.png' class='ui fluid image'/>
                </div>
            )}
        </div>
    )
}

export default Login