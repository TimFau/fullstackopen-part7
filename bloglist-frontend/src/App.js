import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import ToggleWrapper from "./components/ToggleWrapper";
import Notification from "./components/Notification";
import NotificationContext from "./context/NotificationContext";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./styles/main.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogAddSuccess, setBlogAddSuccess] = useState(false);
  const [, notificationDispatch] = useContext(NotificationContext);

  const createBlogRef = useRef();

  const queryClient = useQueryClient();

  useEffect(() => {
    let lsUser = localStorage.getItem("user");
    if (lsUser && !user) {
      const user = JSON.parse(lsUser);
      setUser(user);
    }
  }, [user]);

  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: () => blogService.getAll(),
  });

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      localStorage.setItem("user", JSON.stringify(user));
      notificationDispatch({ type: "success", content: "Logged in" });
    } catch (exception) {
      notificationDispatch({
        type: "error",
        content: ["Username or Password is incorrect"],
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    notificationDispatch({ type: "success", content: "Logged out" });
    localStorage.removeItem("user");
  };

  const handleCreateBlog = (title, author, url) => {
    createBlogMutation.mutate({
      data: {
        title,
        author,
        url,
      },
      token: user.token,
    });
  };

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      notificationDispatch({
        type: "success",
        content: `Blog "${newBlog.title}" by ${newBlog.author} added`,
      });
      createBlogRef.current();
      // Provider username to blogState, since it's not included in this response
      newBlog.user = {
        id: newBlog.user,
        username: user.username,
      };
      queryClient.invalidateQueries(["blogs"]);
      setBlogAddSuccess(true);
    },
    onError: (error) => {
      if (error.response.data.error) {
        notificationDispatch({
          type: "error",
          content: error.response.data.error,
        });
      }
      if (error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).map(
          (error) => error.message,
        );
        notificationDispatch({ type: "error", content: errorMessages });
      }
    },
  });

  const handleDeleteBlog = async (params) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${params.name} by ${params.author}?`,
    );
    const blogId = params.id;
    const token = user.token;
    if (confirmDelete) {
      deleteBlogMutation.mutate({
        blogId,
        token,
      });
    }
  };

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries("blogs");
      notificationDispatch({ type: "success", content: "Blog Deleted." });
    },
    onError: (data) => {
      console.error("onError", data);
      const error = data.response.data.error;
      notificationDispatch({ type: "error", content: error });
    },
  });

  const handleIncrementLikes = (blog) => {
    incrementLikesMutation.mutate({ blog });
  };

  const incrementLikesMutation = useMutation({
    mutationFn: blogService.incrementLikes,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["blogs"]);
      console.log("onSuccess", data);
    },
    onError: (data) => {
      console.log("onError", data);
    },
  });

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <Notification />
        <form onSubmit={handleLogin} className="container">
          <div className="input-wrap">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            ></input>
          </div>
          <div className="input-wrap">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            ></input>
          </div>
          <button type="submit" id="loginButton">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Notification />
      <div className="container user-info">
        <p>{user.name} logged in</p>{" "}
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ToggleWrapper buttonLabel="Create a new blog" ref={createBlogRef}>
        <CreateBlog
          handleCreateBlog={handleCreateBlog}
          blogAddSuccess={blogAddSuccess}
          setBlogAddSuccess={setBlogAddSuccess}
        />
      </ToggleWrapper>

      <h2>Blogs</h2>
      <div className="blog-list-wrapper">
        {blogsResult.isSuccess &&
          blogsResult.data.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              usersUsername={user.username}
              handleDeleteBlog={handleDeleteBlog}
              handleIncrementLikes={handleIncrementLikes}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
