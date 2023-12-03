import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import CreateBlog from '../components/CreateBlog'
import ToggleWrapper from '../components/ToggleWrapper'
import blogService from '../services/blogs'

const Blogs = () => {
  const createBlogRef = useRef()

  const blogsResult = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  return (
    <>
      <ToggleWrapper buttonLabel="Create a new blog" ref={createBlogRef}>
        <CreateBlog />
      </ToggleWrapper>

      <h2>Blogs</h2>
      <div className="blog-list-wrapper">
        {blogsResult.isSuccess &&
          blogsResult.data.map((blog) => {
            return (
              <Link
                key={blog.id}
                className="blog-item container"
                to={`/blogs/${blog.id}`}
              >
                {blog.title} by {blog.author}
              </Link>
            )
          })}
      </div>
    </>
  )
}

export default Blogs
