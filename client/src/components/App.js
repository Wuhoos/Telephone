import React, {useState, useEffect} from 'react'
import { Route, Routes, Link, useNavigate} from 'react-router-dom'
import StoryGenerator from './storyGenerator'
import Login from './login'
import StoryList from './storyList'

function App(){
    
    const [user, setUser] = useState(null)
    let navigate = useNavigate()

    function logout(){
        fetch('/logout', {method: 'DELETE'})
        .then((res)=>{
            if(res.ok) {
                setUser(null)
                navigate('/')
            } else {
                console.error(`Logout request failed:, ${res.status}`)
            }
        })
    }
    
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
                    {!user ? <h1 className=' bg-gray-300/70 text-center font-bold font-serif text-5xl mt-8 underline'>Telephone</h1> : null}
                    {user && (
                        <div className=' mr-5 justify-end'>
                            <div className='mt-3 p-3'>
                                {user ? (<Link to='/' className='mr-4 bg-black text-white p-1'>Home</Link>): null}
                                <Link className='bg-black text-white p-1' to='/stories'>Stories</Link>
                                <button onClick={logout} className='border-2 text-white bg-black border-black ml-4'>Logout</button>
                            </div>
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