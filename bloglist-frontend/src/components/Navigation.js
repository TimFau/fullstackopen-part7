import { Link } from 'react-router-dom'

const Navigation = ( { username, handleLogout } ) => {
    return (
        <div className="container top-nav">
            <ul className="links">
                <li><Link to="/">Blogs</Link></li>
                <li><Link to="/users">Users</Link></li>
            </ul>
            <div className="user-info">
                <span>{username} logged in</span>
                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navigation