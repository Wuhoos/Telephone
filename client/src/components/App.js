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
        <div>
            <div className=' bg-gray-300/70'>
                <div className='text-right justify-end'>
                    {!user ? <h1 className=' bg-gray-300/70 text-center font-bold font-serif text-5xl underline ui huge header'>
                        Telephone
                        <img src='https://img.freepik.com/premium-photo/shellphone-ai-generated_1007879-33.jpg' className='ui circular image ml-4'/>
                        </h1> : null}
                    {user && (
                        <div className=' mr-5 justify-end ' class='ui inverted segment'>
                            <div className='mt-3 p-3' >
                                {user ? (<Link to='/' className='mr-4 bg-black text-white p-1' class='ui blue  button'>Home</Link>): null}
                                <Link className='bg-black text-white p-1' to='/stories' class='ui blue inverted button '>Gallery</Link>
                                <button onClick={logout} className='' class='ui blue button'>Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Routes>
                <Route path='/' element={user ? <StoryGenerator user={user}/> : <Login onLogin={setUser}/>} />
                <Route path='/stories' element={user ? <StoryList user={user}/> : <Login onLogin={setUser}/>} />
            </Routes>
        </div>
       
    )
}

export default App;