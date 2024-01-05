import { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import NotificationContext from '../context/NotificationContext'
import { Container, Card, Button, ButtonGroup, Form, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

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
    <Container>
      <Card>
        <Card.Header as="h1">{blog.title}</Card.Header>
        <Card.Body>
          <Card.Subtitle as="h2">{blog.author}</Card.Subtitle>
          <Card.Text><a href={blog.url}>{blog.url}</a></Card.Text>
          <Card.Text>
            Likes: <span className="likes-count">{blog.likes}</span>{' '}
            <Button
              className="button-inline increment-likes-button"
              title="Increment Likes"
              onClick={() => handleIncrementLikes(blog)}
            >
              Like
            </Button>
          </Card.Text>
          <Card.Text>Added by: {blog.user.username}</Card.Text>
        </Card.Body>
        <Card.Body className="blog-item-comments">
          <h3>Comments</h3>
          <Form onSubmit={handleAddComment}>
            <Form.Control as="textarea" id="comment" value={newComment} onChange={({ target }) => setNewComment(target.value)} />
            <Button type="submit">Add Comment</Button>
          </Form>
          <ListGroup className="list-group-flush">
            {blog.comments.map((comment) => (
              <ListGroup.Item key={comment}>{comment}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button as={Link} to="/">Back</Button>
          {isUsersBlog && (
            <Button
              onClick={() => handleDeleteBlog(blog)}
              className="delete-button"
              variant="secondary"
            >
              Delete
            </Button>
          )}
        </Card.Footer>
      </Card>
    </Container>
  )
}

export default Blog
