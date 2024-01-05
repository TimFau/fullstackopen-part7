import Notification from '../components/Notification'
import loginService from '../services/login'
import { useState, useContext } from 'react'
import UserContext from '../context/UserContext'
import NotificationContext from '../context/NotificationContext'
import { Button, Container, Form } from 'react-bootstrap'

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
    <Container>
      <h2>Log in</h2>
      <Notification />
      <Form onSubmit={handleLogin} className="container">
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            id="password"
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" id="loginButton">
          Login
        </Button>
      </Form>
    </Container>
  )
}

export default Login
