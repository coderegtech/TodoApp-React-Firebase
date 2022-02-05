import React, { useState, useEffect } from "react";
import "./Todo.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsTrash, BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { db, auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import {
  addDoc,
  updateDoc,
  onSnapshot,
  doc,
  deleteDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
function Todo({ user }) {
  const [todos, setTodos] = useState([]);
  const [mark, setMark] = useState(false);
  const [input, setInput] = useState("");
  const [daylight, setDaylight] = useState(false);
  const [active, setActive] = useState(false);
  const colRef = collection(db, "todos");

  const { uid, displayName, photoURL } = user;

  const que = query(colRef, orderBy("createdAt", "asc"));

  useEffect(() => {
    const displayTodos = async () => {
      onSnapshot(que, (snapshot) => {
        const todoItems = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // Show todo list by current user only
        const currentUserTodolist = todoItems.filter(
          (todo) => todo.uid === user.uid
        );
        setTodos(currentUserTodolist);

        // console.log(
        //   snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        // );
      });
    };
    displayTodos();
  }, []);

  // Add todo to firestore
  const submitTodo = async (e) => {
    e.preventDefault();
    await addDoc(colRef, {
      todo: input,
      uid,
      createdAt: serverTimestamp(),
      completed: false,
    })
      .then(() => {
        console.log("Todo added!");
        setInput("");
        setMark(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Delete todo from firestore
  const delTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id))
      .then(() => {
        console.log("Todo deleted!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Mark todo as completed
  const markTodo = async (id) => {
    const markedTodo = doc(db, "todos", id);
    await updateDoc(markedTodo, { completed: !mark }).then(() => {
      setMark(!mark);
      console.log("Todo marked as completed!");
    });
  };
  // Sign out from firebase
  const signOutUser = async () => {
    await signOut(auth).then(() => {
      console.log("Signed out!");
    });
  };
  return (
    <div className={`todo ${daylight ? "night" : ""}`}>
      <div className="top-container">
        <header>
          <span className="daylight" onClick={() => setDaylight(!daylight)}>
            {daylight ? <BsFillSunFill /> : <BsFillMoonFill />}
          </span>
          <h2 className="title">Todo App</h2>
          <div className="user" onClick={() => setActive(!active)}>
            <img className="user-profile" src={photoURL} alt={displayName} />
          </div>
          <div className={`user-menu ${active ? "active" : ""}`}>
            <img className="user-profile" src={photoURL} alt={displayName} />
            <p className="user-name">{displayName}</p>

            <button className="logout-btn" onClick={signOutUser}>
              Log Out
            </button>
          </div>
        </header>
        <form onSubmit={(e) => submitTodo(e)} className="todo-form">
          <input
            onChange={(event) => setInput(event.target.value)}
            className="todo-input"
            type="text"
            placeholder="Add Todo..."
            value={input}
          />
          <button
            disabled={!input}
            type="submit"
            className="submit-btn"
            onClick={(e) => submitTodo(e)}
          >
            <AiOutlinePlusCircle />
          </button>
        </form>{" "}
      </div>
      <ul className="todos">
        {todos.map(({ todo, id, completed }) => {
          return (
            <li key={id} className="todo-list">
              <p
                onClick={() => markTodo(id)}
                className={`todo-items ${completed === true ? "line" : ""}`}
              >
                {todo}
              </p>
              <button onClick={() => delTodo(id)} className=" del-btn">
                <BsTrash />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Todo;
