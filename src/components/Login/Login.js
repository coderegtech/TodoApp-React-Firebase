import React from "react";
import "./Login.css";
import { FcGoogle } from "react-icons/fc";

function Login({ signInWithGoogle }) {
  return (
    <div className="todo-login">
      <h1>Todo App</h1>

      <button className="signin-btn" onClick={signInWithGoogle}>
        <p>Sign In With Google</p> <FcGoogle />
      </button>
    </div>
  );
}

export default Login;
