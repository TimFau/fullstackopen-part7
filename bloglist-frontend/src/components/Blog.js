import { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import NotificationContext from '../context/NotificationContext'
import { Container, Button } from 'react-bootstrap'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const [userState] = useContext(UserContext)
  const [, notificationDispatch] = useContext(NotificationContext)
  const [newComment, setNewComment] = useState('')

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

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      notificationDispatch({ type: 'success', content: 'Comment Added.' })
    }
  })

  const handleAddComment = async (event) => {
    event.preventDefault()

    addCommentMutation.mutate({ blog, newComment: newComment.toString() })
  }

  return (
    <Container className={`blog-item ${isUsersBlog ? 'users-blog' : ''}`}>
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
          <Button
            className="button-inline increment-likes-button"
            title="Increment Likes"
            onClick={() => handleIncrementLikes(blog)}
          >
            like
          </Button>
        </span>
        <span>{blog.user.username}</span>
        {isUsersBlog && (
          <Button
            onClick={() => handleDeleteBlog(blog)}
            className="delete-button"
          >
            Delete
          </Button>
        )}
      </div>
      <div className="blog-item-comments">
        <h3>Comments</h3>
        <form className="add-comment" onSubmit={handleAddComment}>
          <textarea id="comment" value={newComment} onChange={({ target }) => setNewComment(target.value)} />
          <button type="submit">Add Comment</button>
        </form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default Blog
