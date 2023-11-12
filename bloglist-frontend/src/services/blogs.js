import axios from "axios";
const baseUrl = "/api/blogs";

const sortBlogsByLikes = (blogs) => {
  try {
    // Note: toSorted will return an error in electron and some other browsers
    const sortedBlogs = blogs.toSorted((a, b) => {
      return b.likes - a.likes;
    });
    return sortedBlogs;
  } catch (error) {
    console.error("sortedBlogs error: ", error);
    return blogs;
  }
};

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return sortBlogsByLikes(request.data);
};

const create = async (params) => {
  const config = {
    headers: { Authorization: `bearer ${params.token}` },
  };
  const response = await axios.post(baseUrl, params.data, config);
  return response.data;
};

const deleteBlog = async (params) => {
  const config = {
    headers: { Authorization: `bearer ${params.token}` },
  };
  const response = await axios.delete(`${baseUrl}/${params.blogId}`, config);
  return response.data;
};

const incrementLikes = async (params) => {
  const body = {
    user: params.blog.user.id,
    likes: params.blog.likes + 1,
    author: params.blog.author,
    title: params.blog.title,
    url: params.blog.url,
  };

  const response = await axios.post(`${baseUrl}/${params.blog.id}`, body);
  return response.data;
};

export default { getAll, create, deleteBlog, incrementLikes };
