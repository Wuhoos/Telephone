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
        user ? (
            <button onClick={logout}>Logout</button>
        ) : null
    )
}


export default NavBar