import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const CreateBlog = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    props.setBlogAddSuccess(false)

    props.handleCreateBlog(title, author, url)
  }

  useEffect(() => {
    if (props.blogAddSuccess) {
      resetForm()
    }
  }, [props.blogAddSuccess])

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h3>Create New blog</h3>
      <form onSubmit={addBlog}>
        <div className="input-wrap">
          <label htmlFor="title">Title</label>
          <input
            id="createBlogTitle"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          ></input>
        </div>
        <div className="input-wrap">
          <label htmlFor="author">Author</label>
          <input
            id="createBlogAuthor"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          ></input>
        </div>
        <div className="input-wrap">
          <label htmlFor="url">URL</label>
          <input
            id="createBlogUrl"
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
          ></input>
        </div>
        <button type="submit" id="submitCreateBlogButton">Create</button>
      </form>
    </div>
  )
}

CreateBlog.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired,
  blogAddSuccess: PropTypes.bool.isRequired,
  setBlogAddSuccess: PropTypes.func.isRequired
}

export default CreateBlog