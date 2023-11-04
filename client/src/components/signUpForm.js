import React, {useState} from 'react';

function SignUpForm({onLogin}){
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setError] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    function handleSignUp(e) {
        e.preventDefault()
        setError([])
        setIsLoading(true)
        fetch('/signup',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }).then((res) => {
            setIsLoading(false);
            if(res.ok) {
                res.json().then((data) => onLogin(data))
            } else {
                res.json().then((error) => setError(error.errors))
            }
        })
    }

    return (
        <form onSubmit={handleSignUp} className="space-y-10 underline mt-10 font-bold">
            <div>
                New Username:
                <input type='text' id='username' autoComplete='off' value={username} onChange={(e)=>setUsername(e.target.value)} className="border-2 ml-4"/>
            </div>
            <div>
                New Password:
                <input type='password' id='password' autoComplete='off' value={password} onChange={(e)=>setPassword(e.target.value)} className="border-2 ml-4"/>
            </div>
            <button type='submit'>{isLoading ? 'Loading...' : 'Sign Up'}</button>
            {errors.map((err) => (
                <p key={err} style={{color: 'red'}} >{err}</p>
            ))}
        </form>
    )
}

export default SignUpForm;