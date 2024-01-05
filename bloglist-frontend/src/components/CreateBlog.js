import { useEffect, useState, useContext } from 'react'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import NotificationContext from '../context/NotificationContext'
import UserContext from '../context/UserContext'
import { Form, Button, Card } from 'react-bootstrap'

const CreateBlog = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [blogAddSuccess, setBlogAddSuccess] = useState(false)
  const [userState] = useContext(UserContext)
  const [, notificationDispatch] = useContext(NotificationContext)

  const queryClient = useQueryClient()

  const addBlog = (event) => {
    event.preventDefault()
    setBlogAddSuccess(false)

    handleCreateBlog(title, author, url)
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
      // createBlogRef.current()
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

  useEffect(() => {
    if (blogAddSuccess) {
      resetForm()
    }
  }, [blogAddSuccess])

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <Card.Title>Create New blog</Card.Title>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label htmlFor="title">Title</Form.Label>
          <Form.Control
            id="createBlogTitle"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="author">Author</Form.Label>
          <Form.Control
            id="createBlogAuthor"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="url">URL</Form.Label>
          <Form.Control
            id="createBlogUrl"
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" id="submitCreateBlogButton">
          Create
        </Button>
      </Form>
    </div>
  )
}

export default CreateBlog
