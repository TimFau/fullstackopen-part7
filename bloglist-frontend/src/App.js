import { useState, useEffect, useRef, useContext } from 'react'
import Login from './components/Login'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import ToggleWrapper from './components/ToggleWrapper'
import Notification from './components/Notification'
import NotificationContext from './context/NotificationContext'
import UserContext from './context/UserContext'
import blogService from './services/blogs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './styles/main.css'

const App = () => {
  const [blogAddSuccess, setBlogAddSuccess] = useState(false)
  const [, notificationDispatch] = useContext(NotificationContext)
  const [userState, userDispatch] = useContext(UserContext)

  const createBlogRef = useRef()

  const queryClient = useQueryClient()

  useEffect(() => {
    let lsUser = localStorage.getItem('user')
    if (lsUser && !userState.user) {
      const user = JSON.parse(lsUser)
      userDispatch({ type: 'set', user })
    }
  }, [userState.user])

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  const handleLogout = () => {
    userDispatch({ type: 'reset' })
    notificationDispatch({ type: 'success', content: 'Logged out' })
    localStorage.removeItem('user')
  }

  const handleCreateBlog = (title, author, url) => {
    createBlogMutation.mutate({
      data: {
        title,
        author,
        url,
      },
      token: userState.user.token,
    })
  }

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      notificationDispatch({
        type: 'success',
        content: `Blog "${newBlog.title}" by ${newBlog.author} added`,
      })
      createBlogRef.current()
      // Provider username to blogState, since it's not included in this response
      newBlog.user = {
        id: newBlog.user,
        username: userState.user.username,
      }
      queryClient.invalidateQueries(['blogs'])
      setBlogAddSuccess(true)
    },
    onError: (error) => {
      if (error.response.data.error) {
        notificationDispatch({
          type: 'error',
          content: error.response.data.error,
        })
      }
      if (error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).map(
          (error) => error.message,
        )
        notificationDispatch({ type: 'error', content: errorMessages })
      }
    },
  })

  const handleDeleteBlog = async (params) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${params.name} by ${params.author}?`,
    )
    const blogId = params.id
    const token = userState.user.token
    if (confirmDelete) {
      deleteBlogMutation.mutate({
        blogId,
        token,
      })
    }
  }

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      notificationDispatch({ type: 'success', content: 'Blog Deleted.' })
    },
    onError: (data) => {
      console.error('onError', data)
      const error = data.response.data.error
      notificationDispatch({ type: 'error', content: error })
    },
  })

  const handleIncrementLikes = (blog) => {
    incrementLikesMutation.mutate({ blog })
  }

  const incrementLikesMutation = useMutation({
    mutationFn: blogService.incrementLikes,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['blogs'])
      console.log('onSuccess', data)
    },
    onError: (data) => {
      console.log('onError', data)
    },
  })

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
      <ToggleWrapper buttonLabel="Create a new blog" ref={createBlogRef}>
        <CreateBlog
          handleCreateBlog={handleCreateBlog}
          blogAddSuccess={blogAddSuccess}
          setBlogAddSuccess={setBlogAddSuccess}
        />
      </ToggleWrapper>

      <h2>Blogs</h2>
      <div className="blog-list-wrapper">
        {blogsResult.isSuccess &&
          blogsResult.data.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              usersUsername={userState.user.username}
              handleDeleteBlog={handleDeleteBlog}
              handleIncrementLikes={handleIncrementLikes}
            />
          ))}
      </div>
    </div>
  )
}

export default App
