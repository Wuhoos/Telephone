import React, {useState, useEffect} from 'react'
import { Route, Routes, Link} from 'react-router-dom'
import StoryGenerator from './storyGenerator'
import Login from './login'
import NavBar from './navBar'

function App(){
    
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        fetch('/checkSession').then((res) => {
            if (res.ok) {
                console.log(res)
                
                res.json().then((data) =>{setUser(data)})
            }else{
                res.json().then((data) =>{console.log(data)})
            }
        })
    },[])

    return (
        <>
            <div>
                <h1>Telephone</h1>
                <NavBar user={user} setUser={setUser} />
                {user ? (
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                ): (<p>WELCOME</p>)
                }
            </div>
            <Routes>
                <Route path='/' element={user ? <StoryGenerator user={user}/> : <Login onLogin={setUser}/>} />
            </Routes>
        </>
       
    )
}

export default App;