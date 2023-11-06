import React, {useState, useEffect} from 'react'
import { Route, Routes, Link} from 'react-router-dom'
import StoryGenerator from './storyGenerator'
import Login from './login'
import NavBar from './navBar'
import StoryList from './storyList'

function App(){
    
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        fetch('/checkSession').then((res) => {
            if (res.ok) {
                // console.log(res)
                
                res.json().then((data) =>{setUser(data)})
            }else{
                res.json().then((data) =>{console.log(data)})
            }
        })
    },[])

    return (
        <>
            <div className=' bg-gray-300/70'>
                <div className='text-right mr-5 justify-end'>
                    {!user ? <h1 className=' bg-gray-300/70 text-center font-bold font-serif text-5xl mt-8 underline'>Telephone</h1> 
                        : (
                            <h1 className=' bg-gray-300/70 text-center font-bold font-serif text-5xl mt-8 underline'>Tell Me A Story</h1>
                        )}
                    {user && (
                        <div className='text-right mr-5 justify-end'>
                            <NavBar user={user} setUser={setUser} />
                            {user ? (<Link to='/' className='mr-4'>Home</Link>): null}
                            <Link to='/stories'>Stories</Link>
                        </div>
                    )}
                </div>
            </div>
            <Routes>
                <Route path='/' element={user ? <StoryGenerator user={user}/> : <Login onLogin={setUser}/>} />
                <Route path='/stories' element={user ? <StoryList user={user}/> : <Login onLogin={setUser}/>} />
            </Routes>
        </>
       
    )
}

export default App;