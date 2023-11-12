import { createContext, useReducer, useEffect } from 'react'

const NotificationContext = createContext(null)

const notificationReducer = (state, action) => {
  const messages = action.content
  const isString = typeof messages === 'string'
  const handleSetMessages = () => {
    return isString ? [messages] : messages
  }
  switch (action.type) {
    case 'success':
      return {
        messages: handleSetMessages(),
        type: action.type,
      }
    case 'error': {
      return {
        messages: handleSetMessages(),
        type: action.type,
      }
    }
    case 'reset': {
      return {
        messages: [],
        type: action.type,
      }
    }
    default:
      return state
  }
}

const initialState = {
  messages: [],
  type: 'reset',
}

export const NotificationContextProvider = (props) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  useEffect(() => {
    let timeout
    if (state.type !== 'reset') {
      timeout = setTimeout(() => {
        dispatch({ type: 'reset' })
      }, 5000)
    }
    return () => {
      console.log('clearTimeout')
      clearTimeout(timeout)
    }
  }, [state])

  return (
    <NotificationContext.Provider value={[state, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
