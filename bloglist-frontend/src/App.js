import { useEffect, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import NotificationContext from './context/NotificationContext'
import UserContext from './context/UserContext'
import './styles/main.css'

const App = () => {
  const [, notificationDispatch] = useContext(NotificationContext)
  const [userState, userDispatch] = useContext(UserContext)

  useEffect(() => {
    let lsUser = localStorage.getItem('user')
    if (lsUser && !userState.user) {
      const user = JSON.parse(lsUser)
      userDispatch({ type: 'set', user })
    }
  }, [userState.user])

  const handleLogout = () => {
    userDispatch({ type: 'reset' })
    notificationDispatch({ type: 'success', content: 'Logged out' })
    localStorage.removeItem('user')
  }

  if (userState.user === null) {
    return <Login />
  }

  return (
    <Router>
      <Notification />
      <div className="container user-info">
        <p>{userState.user.name} logged in</p>{' '}
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Router>
  )
}

export default App
