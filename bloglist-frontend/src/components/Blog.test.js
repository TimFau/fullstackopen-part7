import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateBlog from './CreateBlog'

// Test Data
const blog = {
  author: 'Test Author',
  id: '123456789',
  likes: 7,
  title: 'Test Blog Post',
  url: 'https://google.com',
  user: {
    id: '1234',
    name: 'Test User',
    username: 'raged'
  }
}

// Tests
test('renders only title and author by default', () => {

  const { container } = render(
    <Blog
      blog={blog}
      usersUsername='Test User'
      handleDeleteBlog={() => {}}
      handleIncrementLikes={() => {}}
    />
  )


  expect(container).toBeDefined()

  expect(container).toHaveTextContent(blog.author)
  expect(container).toHaveTextContent(blog.title)
  expect(container).not.toHaveTextContent(blog.url)
  expect(container).not.toHaveTextContent(blog.likes)
})

test('renders url and likes after clicking "view more"', async () => {

  const { container } = render(
    <Blog
      blog={blog}
      usersUsername='Test User'
      handleDeleteBlog={() => {}}
      handleIncrementLikes={() => {}}
    />
  )
  const user = userEvent.setup()
  const button = screen.getByRole('button')


  expect(container).toBeDefined()

  await user.click(button)

  expect(container).toHaveTextContent(blog.author)
  expect(container).toHaveTextContent(blog.title)
  expect(container).toHaveTextContent(blog.url)
  expect(container).toHaveTextContent(blog.likes)
})

test('if "like" button is clicked twice, "handleIncrementLikes" is run twice', async () => {

  const mockHandler = jest.fn()

  const { container } = render(
    <Blog
      blog={blog}
      usersUsername='Test User'
      handleDeleteBlog={() => {}}
      handleIncrementLikes={mockHandler}
    />
  )
  const user = userEvent.setup()
  const button = screen.getByRole('button')
  await user.click(button)

  expect(container).toBeDefined()

  const likeButton = screen.getByTitle('Increment Likes')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('New blog form calls event handler with correct details', async () => {
  const handleCreateBlog = jest.fn()

  const { container } = render(
    <CreateBlog
      handleCreateBlog={handleCreateBlog}
      blogAddSuccess={false}
      setBlogAddSuccess={() => {}}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByRole('button')
  const titleInput = screen.getByLabelText('Title')
  const authorInput = screen.getByLabelText('Author')
  const urlInput = screen.getByLabelText('URL')
  const titleValue = 'TestTitle'
  const authorValue = 'TestAuthor'
  const urlValue = 'https://google.com'

  // Enter the Inputs with Value
  await user.type(titleInput, titleValue)
  await user.type(authorInput, authorValue)
  await user.type(urlInput, urlValue)

  // Click the button to submit the form
  await user.click(button)

  // Confirm that form calls 'handleCreateBlog' with the correct details
  expect(container).toBeDefined()
  expect(handleCreateBlog.mock.calls[0]).toHaveLength(3)
  expect(handleCreateBlog.mock.calls[0][0]).toBe(titleValue)
  expect(handleCreateBlog.mock.calls[0][1]).toBe(authorValue)
  expect(handleCreateBlog.mock.calls[0][2]).toBe(urlValue)

})