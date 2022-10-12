import React, { useState, useReducer } from "react";
import Modal from "./Modal";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import {  getDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
 
  const navigate = useNavigate();
  const reducer = (state, action) => {
    if (action.type === "LOGIN_USER") {
      const email = action.payload.useremail;
      const password = action.payload.userpassword;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;

          // CHECK USERTYPE;

          const docRef = doc(db, "users", user.uid);
          getDoc(docRef).then((doc) => {
          
          const userType = doc.data().userType
          if(userType === 'admin'){
            navigate("/adminupload");
          }
          else{
            navigate("/allproducts")
          }
          })


          return {
            ...state,
            modalOpen: true,
            modalContent: "User successfully logged in",
          };
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        });
    }

    return state;
  };

  const prevState = {
    modalOpen: false,
    modalContent: "",
  };

  const [person, setPerson] = useState({ email: "", password: "" });
  const [isError, setError] = useState("");
  const [state, dispatch] = useReducer(reducer, prevState);

  const getInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setPerson({ ...person, [name]: value });
  };

  const logInUser = (e) => {
    e.preventDefault();

    if (person.email) {
      const newPerson = {
        useremail: person.email,
        userpassword: person.password,
      };

      dispatch({ type: "LOGIN_USER", payload: newPerson });
      setPerson({ email: "", password: "" });
    }
  };
  return (
    <div>
      {state.modalOpen && <Modal modalContent={state.modalContent} />}
      {isError && <h5>{isError}</h5>}
      <form action="#" onSubmit={logInUser}>
        <div>
          <input
            onChange={getInputs}
            value={person.email}
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
          />
        </div>

        <div>
          <input
            onChange={getInputs}
            value={person.password}
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
          />
        </div>

        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
