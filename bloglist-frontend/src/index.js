import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotificationContextProvider } from "./context/NotificationContext";
import { BlogsContextProvider } from "./context/BlogsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BlogsContextProvider>
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
  </BlogsContextProvider>,
);
