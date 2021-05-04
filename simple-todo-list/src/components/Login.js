import { useState, useContext } from "react";
import { Form } from "semantic-ui-react";
import Axios from "axios";
import NotificationContext from "../store/NotificationContext";
import "./Register.css";

function Login(props) {
  const notificationCtx = useContext(NotificationContext);
  const logData = {
    email: "",
    password: ""
  };
  const [logState, setLogState] = useState(logData);

  function inputChangeHandler(e) {
    let { name, value } = e.target;
    setLogState({ ...logState, [name]: value });
  }

  const [formErr, setFormErr] = useState({});

  function validate() {
    let valData = {};
    valData.email = logState.email ? "" : "Email is Required";
    valData.password = logState.password ? "" : "Password is Required";
    setFormErr({
      ...valData
    });

    return Object.values(valData).every(x => x === "");
  }

  async function loginHandler(e) {
    e.preventDefault();
    let newLogData = logState;
    if (validate()) {
      let msgtitle, msg, msgstatus;
      try {
        const response = await Axios.post("http://localhost:5000/login", newLogData);
        if (response.status === 201) {
          msgtitle = "Error";
          msg = response.data;
          msgstatus = "error";
        }
        if (response.status === 200) {
          props.setLogin(true);
          localStorage.setItem("userToken", response.data.token);
          localStorage.setItem("username", response.data.username);
          msgtitle = "Success";
          msg = response.data.msg;
          msgstatus = "success";
        }
        notificationCtx.showNotification({
          title: msgtitle,
          message: msg,
          status: msgstatus
        });
        setLogState(logData);
      } catch (err) {
        notificationCtx.showNotification({
          title: "Error",
          message: "Something Went Wrong",
          status: "error"
        });
        setLogState(logData);
      }
    } else {
      let { email, password } = formErr;
      let msgtitle, msg, msgstatus;
      if (email !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = email;
        msgstatus = "error";
      }
      if (password !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = password;
        msgstatus = "error";
      }
      notificationCtx.showNotification({
        title: msgtitle,
        message: msg,
        status: msgstatus
      });
      setLogState(logData);
    }
  }

  return (
    <div className="registrBox">
      <h2>Login to view your todo list ...</h2>
      <Form onSubmit={loginHandler}>
        <Form.Input fluid label="Email" placeholder="Email" name="email" value={logState.email} onChange={inputChangeHandler} />
        <Form.Input fluid label="Password" type="password" name="password" placeholder="password" value={logState.password} onChange={inputChangeHandler} />
        <Form.Group inline>
          <Form.Button style={{ background: "#1566e0" }}>Login</Form.Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Login;
