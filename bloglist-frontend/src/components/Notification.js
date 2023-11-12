import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'

const Notification = () => {
  const [state] = useContext(NotificationContext)

  return (
    <>
      {state.messages.map((msg, index) => (
        <p className={state.type} key={index}>
          {msg}
        </p>
      ))}
    </>
  )
}

export default Notification
