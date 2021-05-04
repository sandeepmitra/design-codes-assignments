import { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import Axios from "axios";
import { Form } from "semantic-ui-react";
import NotificationContext from "../store/NotificationContext";
import "./Register.css";

function Register() {
  const notificationCtx = useContext(NotificationContext);
  const regData = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    rePassword: ""
  };

  const [regState, setRegState] = useState(regData);

  function inputChangeHandler(e) {
    const { name, value } = e.target;
    setRegState({ ...regState, [name]: value });
  }

  const [formErr, setFormErr] = useState({});

  function validate() {
    let valData = {};
    valData.fname = regState.fname ? "" : "First Name is Required";
    valData.lname = regState.lname ? "" : "Last Name is Required";
    valData.email = regState.email ? "" : "Email is Required";
    valData.password = regState.password ? "" : "Password is Required";
    valData.rePassword = regState.rePassword ? "" : "Repeat password is Required";
    valData.passMatch = regState.password === regState.rePassword ? "" : "Passwords did not matched";
    setFormErr({
      ...valData
    });

    return Object.values(valData).every(x => x === "");
  }

  async function registerhandler(e) {
    e.preventDefault();
    let newUserData = regState;
    if (validate()) {
      let msgtitle, msg, msgstatus;
      try {
        const response = await Axios.post("http://localhost:5000/register", newUserData);
        if (response.status === 201) {
          msgtitle = "Error";
          msg = response.data[0];
          msgstatus = "error";
        }
        if (response.status === 200) {
          msgtitle = "Success";
          msg = response.data;
          msgstatus = "success";
        }
        notificationCtx.showNotification({
          title: msgtitle,
          message: msg,
          status: msgstatus
        });
        setRegState(regData);
      } catch (err) {
        console.log(err);
        notificationCtx.showNotification({
          title: "Error",
          message: "Something Went Wrong",
          status: "error"
        });
        setRegState(regData);
      }
    } else {
      let { fname, lname, email, password, rePassword, passMatch } = formErr;
      let msgtitle, msg, msgstatus;
      if (fname !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = fname;
        msgstatus = "error";
      }
      if (lname !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = lname;
        msgstatus = "error";
      }
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
      if (rePassword !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = rePassword;
        msgstatus = "error";
      }
      if (passMatch !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = passMatch;
        msgstatus = "error";
      }
      notificationCtx.showNotification({
        title: msgtitle,
        message: msg,
        status: msgstatus
      });
      setRegState(regData);
    }
  }

  const history = useHistory();

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/");
  }

  return (
    <div className="registrBox">
      <h2>Register a new account</h2>
      <Form onSubmit={registerhandler}>
        <Form.Group widths="equal">
          <Form.Input fluid label="First name" placeholder="First name" name="fname" value={regState.fname} onChange={inputChangeHandler} />
          <Form.Input fluid label="Last name" name="lname" placeholder="Last name" value={regState.lname} onChange={inputChangeHandler} />
        </Form.Group>

        <Form.Input fluid label="Email" name="email" placeholder="Email" value={regState.email} onChange={inputChangeHandler} />

        <Form.Group widths="equal">
          <Form.Input fluid label="Password" name="password" type="password" placeholder="password" value={regState.password} onChange={inputChangeHandler} />
          <Form.Input fluid label="Repeat Password" name="rePassword" type="password" placeholder="Repeat Password" value={regState.rePassword} onChange={inputChangeHandler} />
        </Form.Group>
        <Form.Group inline>
          <Form.Button style={{ background: "#1566e0" }}>Register</Form.Button>
          <Form.Button style={{ background: "#ffc107" }} onClick={cancelHandler}>
            Cancel
          </Form.Button>
          <div>
            Already have an account? <Link to="/">Login</Link>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Register;
