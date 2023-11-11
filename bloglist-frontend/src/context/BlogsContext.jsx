import { createContext, useReducer } from "react";

const BlogsContext = createContext(null);

const blogsReducer = (state, action) => {
    console.log("blogsReducer", action);
    switch (action.type) {
        case ("setBlogs"):
            return {
                blogs: action.blogs
            };
        case ("addBlog"):
            return {
                blogs: [...state.blogs, action.newBlog]
            };
        case ("deleteBlog"):
            return {
                blogs: state.blogs.filter((blog) => blog.id !== action.id)
            };
        default:
            return state;
    }
};

const initialState = {
    blogs: []
};

export const BlogsContextProvider = (props) => {
  const [state, dispatch] = useReducer(blogsReducer, initialState);

  return (
    <BlogsContext.Provider value={[state, dispatch]}>
      {props.children}
    </BlogsContext.Provider>
  );
};

export default BlogsContext;
