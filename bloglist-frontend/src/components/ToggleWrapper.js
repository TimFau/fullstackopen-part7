import { useImperativeHandle, useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

const ToggleWrapper = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return toggleVisible
  })

  return (
    <Card className="toggle-wrapper">
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisible} id="openCreateBlogButton">
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisible} style={showWhenVisible}>Cancel</Button>
      </div>
    </Card>
  )
})

ToggleWrapper.displayName = 'ToggleWrapper'

ToggleWrapper.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  id: PropTypes.string,
}

export default ToggleWrapper
