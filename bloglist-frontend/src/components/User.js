import { useParams } from 'react-router-dom'
import usersService from '../services/users'
import { useQuery } from '@tanstack/react-query'

const User = () => {
  const { id } = useParams()
  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  })
  let user = usersResult.isSuccess
    ? usersResult.data.filter((user) => user.id === id)
    : null
  if (usersResult.isLoading || usersResult.isError) {
    return null
  }
  user = user[0]
  return (
    <>
      <h1>{user.username}</h1>
      <h2>Blogs added</h2>
      <ul className="user-blogs-list">
        {user.blogs.map((blog) => {
          return (
            <li key={blog.id}>
              <span>{blog.title}</span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default User
