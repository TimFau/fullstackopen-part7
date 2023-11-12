import { useEffect, useContext } from 'react'
import Login from './components/Login'
import Blogs from './components/Blogs'
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
    <div>
      <Notification />
      <div className="container user-info">
        <p>{userState.user.name} logged in</p>{' '}
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <Blogs />
    </div>
  )
}

export default App
