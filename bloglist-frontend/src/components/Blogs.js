import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Blog from '../components/Blog'
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
          blogsResult.data.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
            />
          ))}
      </div>
    </>
  )
}

export default Blogs
