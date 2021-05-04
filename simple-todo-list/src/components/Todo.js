import { useState, useContext, useEffect } from "react";
import { Form, Icon } from "semantic-ui-react";
import Axios from "axios";
import NotificationContext from "../store/NotificationContext";
import "./Todo.css";

function Todo(props) {
  const notificationCtx = useContext(NotificationContext);
  const initlistData = {
    todoTitle: "",
    todoDesc: "",
    token: ""
  };

  const [listDataState, setListDataState] = useState(initlistData);

  function inputChangeHandler(e) {
    const { name, value } = e.target;
    setListDataState({
      ...listDataState,
      [name]: value,
      token: localStorage.getItem("userToken")
    });
  }

  const [formErr, setFormErr] = useState({});

  function validate() {
    let valData = {};
    valData.todoTitle = listDataState.todoTitle ? "" : "Title is Required";
    valData.todoDesc = listDataState.todoDesc ? "" : "Description is Required";
    setFormErr({
      ...valData
    });

    return Object.values(valData).every(x => x === "");
  }

  async function listSubmithandler(e) {
    e.preventDefault();
    let listData = listDataState;
    if (validate()) {
      let msgtitle, msg, msgstatus;
      try {
        const response = await Axios.post("http://localhost:5000/add-todo", listData);
        console.log(response.data);
        if (response.status === 200) {
          msgtitle = "Success";
          msg = response.data;
          msgstatus = "success";
          setListDataState(initlistData);
          getTodoListById();
        }
        if (response.status === 201) {
          msgtitle = "Error";
          msg = response.data;
          msgstatus = "error";
          setListDataState(initlistData);
        }
        notificationCtx.showNotification({
          title: msgtitle,
          message: msg,
          status: msgstatus
        });
      } catch (err) {
        notificationCtx.showNotification({
          title: "Error",
          message: "Something Went Wrong",
          status: "error"
        });
        setListDataState(initlistData);
      }
    } else {
      let { todoTitle, todoDesc } = formErr;
      let msgtitle, msg, msgstatus;
      if (todoTitle !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = todoTitle;
        msgstatus = "error";
      }
      if (todoDesc !== "") {
        msgtitle = "Error - Invalid Input Data";
        msg = todoDesc;
        msgstatus = "error";
      }
      notificationCtx.showNotification({
        title: msgtitle,
        message: msg,
        status: msgstatus
      });
      setListDataState(initlistData);
    }
  }

  const [todolist, setTodolist] = useState();

  async function getTodoListById() {
    let token = localStorage.getItem("userToken");
    let userData = { token: token };
    try {
      let response = await Axios.post(`http://localhost:5000/get-todo/`, userData);
      setTodolist(response);
    } catch (err) {
      console.log("No Data Found ...", err);
    }
  }

  useEffect(async () => {
    getTodoListById();
  }, []);

  // if (todolist) {
  //   console.log(todolist);
  // }

  function handleTodoInputChange(e) {
    e.target.value = e.target.value;
  }

  function editHandeler(e) {
    e.preventDefault();
    e.currentTarget.style.display = "none";
    e.currentTarget.parentElement.querySelector(".update").style.display = "inline-block";
    let inputDivs = e.currentTarget.parentElement.parentElement.children;
    let inputDivsArr = Array.from(inputDivs);
    inputDivsArr.map(item => {
      if (item.children[1].localName == "input") {
        let prevVlaue = item.children[0].outerText;
        item.children[0].style.display = "none";
        item.children[1].value = prevVlaue;
        item.children[1].setAttribute("type", "text");
      }
    });
  }

  async function updateHandeler(e) {
    e.preventDefault();
    e.currentTarget.style.display = "none";
    e.currentTarget.parentElement.querySelector(".edit").style.display = "inline-block";
    let inputDivs = e.currentTarget.parentElement.parentElement.children;
    let inputDivsArr = Array.from(inputDivs);
    let todoInputVals = {};
    inputDivsArr.map(item => {
      if (item.children[1].localName == "input") {
        item.children[0].style.display = "inline-block";
        item.children[1].setAttribute("type", "hidden");
        let propname = item.children[1].attributes.getNamedItem("data-type").value;
        todoInputVals = { ...todoInputVals, [propname]: item.children[1].value };
      }
    });
    let postid = e.currentTarget.attributes.getNamedItem("data-id").value;
    let token = localStorage.getItem("userToken");
    todoInputVals = { ...todoInputVals, postId: postid, token: token };
    try {
      const response = await Axios.post("http://localhost:5000/update-todo", todoInputVals);
      if (response.data.nModified > 0) {
        getTodoListById();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteHandeler(e) {
    e.preventDefault();
    let postid = e.currentTarget.attributes.getNamedItem("data-id").value;
    let token = localStorage.getItem("userToken");
    let sendDelVals = { postId: postid, token };
    try {
      const response = await Axios.post("http://localhost:5000/delete-todo", sendDelVals);
      if (response.data.ok > 0) {
        getTodoListById();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="todo-container">
      <div className="todo-form">
        <Form onSubmit={listSubmithandler}>
          <Form.Group inline>
            <Form.Input size="huge" placeholder="Enter Title" width={4} name="todoTitle" value={listDataState.todoTitle} onChange={inputChangeHandler} />
            <Form.Input size="huge" placeholder="Enter Task Description" width={12} name="todoDesc" value={listDataState.todoDesc} onChange={inputChangeHandler} />
            <Form.Button size="huge" className="addLits">
              Add
            </Form.Button>
          </Form.Group>
        </Form>
      </div>
      <div className="todo-list">
        {todolist
          ? todolist.data.map(item => {
              return (
                <div className="single-items" key={item._id}>
                  <div className="todo-title">
                    <span>{item.title}</span>
                    <input data-type="todoTitle" type="hidden" onChange={handleTodoInputChange} />
                  </div>
                  <div className="todo-desc">
                    <span>{item.body}</span>
                    <input data-type="todoDesc" type="hidden" onChange={handleTodoInputChange} />
                  </div>
                  <div className="action-btns">
                    <span className="edit btn" onClick={editHandeler}>
                      <Icon name="edit" />
                    </span>
                    <span style={{ display: "none" }} className="update btn hide" data-id={item._id} onClick={updateHandeler}>
                      <Icon name="caret square right" />
                    </span>
                    <span className="delete btn" data-id={item._id} onClick={deleteHandeler}>
                      <Icon name="delete" />
                    </span>
                  </div>
                </div>
              );
            })
          : `No Data ...`}
      </div>
    </div>
  );
}

export default Todo;
