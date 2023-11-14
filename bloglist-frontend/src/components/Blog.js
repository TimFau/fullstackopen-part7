import { useState, useContext } from 'react'
import UserContext from '../context/UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import NotificationContext from '../context/NotificationContext'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  const [userState] = useContext(UserContext)
  const [, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const displayMoreInfo = showMoreInfo ? true : false
  const isUsersBlog = blog.user.username === userState.user.username

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

  return (
    <div className={`blog-item container ${isUsersBlog ? 'users-blog' : ''}`}>
      <div className="top-wrapper">
        <div className="blog-info">
          <span className="bold"><Link to={`/blogs/${blog.id}`}  >{blog.title}</Link></span>
          <span>{blog.author}</span>
        </div>
        <button
          onClick={() => setShowMoreInfo(!showMoreInfo)}
          className="toggle-view-more-button"
        >
          {showMoreInfo ? 'Hide' : 'View'}
        </button>
      </div>
      {displayMoreInfo && (
        <div className="more-info">
          <a href={blog.url}>{blog.url}</a>
          <span>
            Likes: <span className="likes-count">{blog.likes}</span>{' '}
            <button
              className="button-inline increment-likes-button"
              title="Increment Likes"
              onClick={() => handleIncrementLikes(blog)}
            >
              like
            </button>
          </span>
          <span>{blog.user.username}</span>
          {isUsersBlog && (
            <button
              onClick={() => handleDeleteBlog(blog)}
              className="delete-button"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
