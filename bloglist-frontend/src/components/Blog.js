import { useContext } from 'react'
import UserContext from '../context/UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import NotificationContext from '../context/NotificationContext'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const [userState] = useContext(UserContext)
  const [, notificationDispatch] = useContext(NotificationContext)

  if (!blog) {
    return 'Missing blog'
  }

  if ('user' in blog === false) {
    return 'User property missing'
  }

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
    <div className={`container blog-item ${isUsersBlog ? 'users-blog' : ''}`}>
      <div className="top-wrapper">
        <div className="blog-info">
          <h1 className="bold">{blog.title}</h1>
          <h2>{blog.author}</h2>
        </div>
      </div>
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
      <div className="blog-item-comments">
        <h3>Comments</h3>
        {/* <div className="add-comment">
          <textarea id="comment" />
          <button type="submit">Add Comment</button>
        </div> */}
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog
