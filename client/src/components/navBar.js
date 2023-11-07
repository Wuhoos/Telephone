import {useNavigate} from 'react-router-dom';

function NavBar({user, setUser}) {
    let navigate = useNavigate()

    function logout() {
        fetch('/logout', {method: 'DELETE'})
        .then((res)=>{ if (res.ok) {
                setUser(null)
                navigate('/')
            } else {
                console.error(`Logout request failed:, ${res.status}`)
            }
        })
    }

    return (
        <div>
                {user ? (
                    <button onClick={logout} className='border-2 text-white bg-black border-black p-1'>Logout</button>
                ) : null}
        </div>
    )
}


export default NavBar