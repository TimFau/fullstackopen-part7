import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import ToggleWrapper from './components/ToggleWrapper'
import blogService from './services/blogs'
import loginService from './services/login'
import './styles/main.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessages, setErrorMessages] = useState([])
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogAddSuccess, setBlogAddSuccess] = useState(false)

  const createBlogRef = useRef()

  useEffect(() => {
    let lsUser = localStorage.getItem('user')
    if (user) {
      getBlogs()
    }
    if(lsUser && !user) {
      const user = JSON.parse(lsUser)
      setUser(user)
    }
  }, [user])

  const sortBlogsByLikes = (blogs) => {
    try {
      // Note: toSorted will return an error in electron and some other browsers
      const sortedBlogs = blogs.toSorted((a, b) => {
        return b.likes - a.likes
      }
      )
      return sortedBlogs
    } catch (error) {
      console.error('sortedBlogs error: ', error)
      return blogs
    }
  }

  const getBlogs = () => {
    blogService.getAll().then(blogs =>
      setBlogs( sortBlogsByLikes(blogs) )
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      // console.log(user)
      setUsername('')
      setPassword('')
      localStorage.setItem('user', JSON.stringify(user))
      handleSetSuccessMessage('Logged in')
    } catch (exception) {
      handleSetErrorMessages(['Username or Password is incorrect'])

    }
  }

  const handleLogout = () => {
    setUser(null)
    handleSetSuccessMessage('Logged out')
    localStorage.removeItem('user')
  }

  const handleCreateBlog = async (title, author, url) => {
    try {
      const newBlog = await blogService.create(
        { title, author, url },
        user.token
      )

      const response = newBlog.response
      if (response && response.data.errors) {
        const errors = response.data.errors
        const errorMessages = Object.values(errors).map(error => error.message)
        handleSetErrorMessages(errorMessages)
      } else {
        handleSetSuccessMessage(`Blog "${newBlog.title}" by ${newBlog.author} added`)
        getBlogs()
        createBlogRef.current()
        setBlogAddSuccess(true)
      }
    } catch (exception) {
      handleSetErrorMessages(['Error creating blog.'])
    }
  }

  const handleDeleteBlog = async (params) => {
    try {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${params.name} by ${params.author}?`)
      if (confirmDelete) {
        const deletedBlog = await blogService.deleteBlog(params.id, user.token)
        if (deletedBlog.code === 'ERR_BAD_REQUEST') {
          const error = deletedBlog.response.data.error
          handleSetErrorMessages(error)
          return false
        }
        handleSetSuccessMessage('Blog Deleted.')
        getBlogs()
      }
    } catch (excetion) {
      console.log('Error deleting blog.', excetion)
    }
  }

  const handleIncrementLikes = async (blog) => {
    const updatedBlog = await blogService.incrementLikes(blog)
    return updatedBlog
  }

  const handleResetMessages = () => {
    setErrorMessages([])
    setSuccessMessage(null)
  }

  const handleSetErrorMessages = (messages) => {
    handleResetMessages()
    setErrorMessages(typeof messages === 'string' ? [messages] : messages)
    setTimeout(() => {
      handleResetMessages()
    }, 5000)
  }

  const handleSetSuccessMessage = (message) => {
    handleResetMessages()
    setSuccessMessage(message)
    setTimeout(() => {
      handleResetMessages()
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        {errorMessages.map((errorMessage, index) => (
          <p className="error" key={index}>{errorMessage}</p>
        ))}
        {successMessage &&
          <p className="success">{successMessage}</p>
        }
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
          <button type="submit" id="loginButton">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      {errorMessages.map((errorMessage, index) => (
        <p className="error" key={index}>{errorMessage}</p>
      ))}
      {successMessage &&
          <p className="success">{successMessage}</p>
      }
      <div className="container user-info">
        <p>{user.name} logged in</p> <button type="button" onClick={handleLogout}>Logout</button>
      </div>
      <ToggleWrapper
        buttonLabel="Create a new blog"
        ref={createBlogRef}
      >
        <CreateBlog
          handleCreateBlog={handleCreateBlog}
          blogAddSuccess={blogAddSuccess}
          setBlogAddSuccess={setBlogAddSuccess}
        />
      </ToggleWrapper>

      <h2>Blogs</h2>
      <div className="blog-list-wrapper">
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            usersUsername={user.username}
            handleDeleteBlog={handleDeleteBlog}
            handleIncrementLikes={handleIncrementLikes}
          />
        )}
      </div>
    </div>
  )
}

export default App