import BlogComponent from '../components/Blog'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'

const Blog = () => {
  const { id } = useParams()

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
    onSuccess: (response) => {
      console.log('blogsQuery response', response)
    },
    onError: (error) => {
      console.log('blogsQuery error', error)
    },
  })

  if (blogsQuery.isError) {
    return 'Error loading blog data.'
  }
  if (blogsQuery.isLoading || !blogsQuery.isSuccess) {
    return 'Loading...'
  }

  const foundBlog = blogsQuery.data.filter((blogItem) => blogItem.id === id)

  return <BlogComponent blog={foundBlog[0]} />
}

export default Blog
