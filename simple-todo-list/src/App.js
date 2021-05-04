import { useContext, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import Register from "./components/Register";
import Login from "./components/Login";
import Todo from "./components/Todo";
import Notifications from "./components/Notifications";
import NotificationContext from "./store/NotificationContext";

function App() {
  const notificationCtx = useContext(NotificationContext);
  const activeNotification = notificationCtx.notification;

  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("userToken")));

  function logoutHandler(e) {
    e.preventDefault();
    setLoggedIn(false);
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
  }

  return (
    <>
      <BrowserRouter>
        <header>
          <div className="brand">Simple Todo List</div>
          <nav className="topnav">
            {loggedIn ? `` : <Link to="/">Login</Link>}
            {loggedIn ? `` : <Link to="/register">Register</Link>}
            {loggedIn ? <span style={{ color: "rgb(21 102 224)", background: "#fff", borderRadius: " 10px", fontWeight: "600", padding: "0.3rem 0.5rem" }}>Hay {localStorage.getItem("username")} !</span> : ``}
            {loggedIn ? (
              <a href="#" onClick={logoutHandler}>
                Logout
              </a>
            ) : (
              ``
            )}
          </nav>
        </header>
        <div className="container">
          <Switch>
            <Route exact path="/">
              {loggedIn ? <Todo /> : <Login setLogin={setLoggedIn} />}
            </Route>
            <Route path="/register">
              <Register />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
      {activeNotification && <Notifications title={activeNotification.title} message={activeNotification.message} status={activeNotification.status} />}
    </>
  );
}

export default App;
