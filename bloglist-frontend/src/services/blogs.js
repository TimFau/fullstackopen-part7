import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (params, token) => {
  console.log('create blog', params, token)
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  try {
    const response = await axios.post(baseUrl, params, config)
    return response.data
  } catch (exception) {
    console.log('exception', exception)
    return exception
  }
}

const deleteBlog = async (blogId, token) => {
  console.log('delete blog', blogId)
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }
  try {
    const response = await axios.delete(`${baseUrl}/${blogId}`, config)
    return response.data
  } catch (exception) {
    console.log('exception', exception)
    return exception
  }
}

const incrementLikes = async (params) => {
  const body = {
    user: params.user.id,
    likes: params.likes + 1,
    author: params.author,
    title: params.title,
    url: params.url
  }

  try {
    const response = await axios.post(`${baseUrl}/${params.id}`, body)
    return response.data
  } catch (exception) {
    console.log('exception', exception)
  }
}

export default { getAll, create, deleteBlog, incrementLikes }