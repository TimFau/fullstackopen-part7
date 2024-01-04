import Notification from '../components/Notification'
import loginService from '../services/login'
import { useState, useContext } from 'react'
import UserContext from '../context/UserContext'
import NotificationContext from '../context/NotificationContext'
import { Button } from 'react-bootstrap'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [, userDispatch] = useContext(UserContext)
  const [, notificationDispatch] = useContext(NotificationContext)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      userDispatch({ type: 'set', user })
      setUsername('')
      setPassword('')
      localStorage.setItem('user', JSON.stringify(user))
      notificationDispatch({ type: 'success', content: 'Logged in' })
    } catch (exception) {
      notificationDispatch({
        type: 'error',
        content: ['Username or Password is incorrect'],
      })
    }
  }

  return (
    <div>
      <h2>Log in</h2>
      <Notification />
      <form onSubmit={handleLogin} className="container">
        <div className="input-wrap">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          ></input>
        </div>
        <div className="input-wrap">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          ></input>
        </div>
        <Button type="submit" id="loginButton">
          Login
        </Button>
      </form>
    </div>
  )
}

export default Login
