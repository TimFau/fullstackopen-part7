import { Link } from 'react-router-dom'
import usersService from '../services/users'
import { useQuery } from '@tanstack/react-query'

const Users = () => {
  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  })
  console.log('users', usersResult)
  return (
    <>
      <h1>Users</h1>
      <ul className="users-list">
        <li className="head user-info">
          <span>User</span> <span>Blogs created</span>
        </li>
        {usersResult.isSuccess &&
          usersResult.data.map((user) => {
            return (
              <li key={user.id}>
                <Link className="user-info" to={`/user/${user.id}`}>
                  <span>{user.username}</span> <span>{user.blogs.length}</span>
                </Link>
              </li>
            )
          })}
      </ul>
    </>
  )
}

export default Users
