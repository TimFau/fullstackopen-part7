import { createContext, useReducer } from 'react'

const UserContext = createContext(null)

const userReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return {
        user: action.user,
      }
    case 'reset':
    default: {
      return {
        user: null,
      }
    }
  }
}

const initialState = {
  user: null,
}

export const UserContextProvider = (props) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
