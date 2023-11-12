import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({
  blog,
  usersUsername,
  handleDeleteBlog,
  handleIncrementLikes,
}) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const displayMoreInfo = showMoreInfo ? true : false;
  const isUsersBlog = blog.user.username === usersUsername;

  return (
    <div className={`blog-item container ${isUsersBlog ? 'users-blog' : ''}`}>
      <div className="top-wrapper">
        <div className="blog-info">
          <span className="bold">{blog.title}</span>
          <span>{blog.author}</span>
        </div>
        <button
          onClick={() => setShowMoreInfo(!showMoreInfo)}
          className="toggle-view-more-button"
        >
          {showMoreInfo ? 'Hide' : 'View'}
        </button>
      </div>
      {displayMoreInfo && (
        <div className="more-info">
          <a href={blog.url}>{blog.url}</a>
          <span>
            Likes: <span className="likes-count">{blog.likes}</span>{' '}
            <button
              className="button-inline increment-likes-button"
              title="Increment Likes"
              onClick={() => handleIncrementLikes(blog)}
            >
              like
            </button>
          </span>
          <span>{blog.user.username}</span>
          {isUsersBlog && (
            <button
              onClick={() => handleDeleteBlog(blog)}
              className="delete-button"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  usersUsername: PropTypes.string.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
  handleIncrementLikes: PropTypes.func.isRequired,
};

export default Blog;
