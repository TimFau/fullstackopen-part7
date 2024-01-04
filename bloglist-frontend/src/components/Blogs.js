import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import CreateBlog from '../components/CreateBlog'
import ToggleWrapper from '../components/ToggleWrapper'
import blogService from '../services/blogs'
import { Container, Stack, Card, Button } from 'react-bootstrap'

const Blogs = () => {
  const createBlogRef = useRef()

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  return (
    <Container>
      <ToggleWrapper buttonLabel="Create a new blog" ref={createBlogRef}>
        <CreateBlog />
      </ToggleWrapper>

      <h2>Blogs</h2>
      <Stack className="blog-list-wrapper" gap={3}>
        {blogsResult.isSuccess &&
          blogsResult.data.map((blog) => {
            return (
              <Card
                as={Link}
                key={blog.id}
                className="blog-item container p-2"
                to={`/blogs/${blog.id}`}
              >
                <Card.Body>
                 <Card.Title>{blog.title}</Card.Title>
                 <Card.Text>by {blog.author}</Card.Text>
                </Card.Body>
              </Card>
            )
          })}
      </Stack>
    </Container>
  )
}

export default Blogs
