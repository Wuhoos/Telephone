import React, { useState } from "react"


function LoginForm({onLogin}) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false) 

    function handleLogin(e) {
        e.preventDefault()

        setIsLoading(true)

        fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        }) .then ((res) => {
            setIsLoading(false)
            if (res.ok) {
                res.json().then((user)=> onLogin(user))
            } else {
                res.json().then((error) => setErrors(error.errors))
            }
        })
    }

    return (
        <form onSubmit={handleLogin} className="space-y-10 underline mt-20 font-bold">
            <div>
                <div className="mb-2">
                    Username:
                    <input type='text' id='username' autoComplete='off' value={username} onChange={(e)=>setUsername(e.target.value)} className="border-2 ml-4"/>
                </div>
                <div>
                    Password:
                    <input type='text' id='password' autoComplete='off' value={password} onChange={(e)=>setPassword(e.target.value)} className="border-2 ml-4"/>
                </div>
            </div>
            <button type='submit' className="">
                {isLoading ? 'Loading...' : 'Login'}
            </button>
            {errors.map((err, index) => (
                <p key={index} style={{color: 'red'}} >{err}</p>
            ))}
        </form>
    )
}

export default LoginForm