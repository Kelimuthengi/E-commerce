import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import image from "../Images/cart.png";

const Signup = () => {
  const navigate = useNavigate();
  const [person, setPerson] = useState({
    username: "",
    phoneNum: "",
    email: "",
    password: "",
  });
  const [isError, setError] = useState("");
  const getUserDetails = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPerson({ ...person, [name]: value });
  };
  const [signUp, setSignup ] = useState(true)
  const [signingin, setSigningin] = useState(false)

  const signUpUser = (e) => {
    setSignup(false)
    setSigningin(true)
    e.preventDefault();
    createUserWithEmailAndPassword(auth, person.email, person.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        // Add a new document in collection "cities"
        setDoc(doc(db, "users", user.uid), {
          name: person.username,
          email: person.email,
          phoneNum: person.phoneNum,
          userType: "user",
          userId: user.uid,
        })
          .then(() => {
            alert("successfull!");
            navigate("/login");
          })
          .catch((error) => {
            const errorMessage = error.message;
            setError(errorMessage);
          });
        setPerson({ username: "", phoneNum: "", email: "", password: "" });
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
          setSignup(true);
          setSigningin(false);
        // ..
      });
  };
  return (
    <Signupsection>
      <SignupImage></SignupImage>

      <Signupform>
        <h1>User Sign up</h1>
        {isError && <h5>{isError}</h5>}
        <form onSubmit={signUpUser}>
          <div>
            <input
              type="text"
              value={person.username}
              name="username"
              id="username"
              placeholder="Enter name"
              onChange={getUserDetails}
            />
          </div>

          <div>
            <input
              type="text"
              value={person.phoneNum}
              name="phoneNum"
              id="phoneNum"
              placeholder="+2547xxxxxx"
              onChange={getUserDetails}
            />
          </div>

          <div>
            <input
              type="email"
              value={person.email}
              name="email"
              id="email"
              placeholder="Enter email"
              onChange={getUserDetails}
            />
          </div>

          <div>
            <input
              type="password"
              value={person.password}
              name="password"
              id="password"
              placeholder="Enter password"
              onChange={getUserDetails}
            />
          </div>

          {signUp && <Button type="submit">SIGN UP</Button>}
          {signingin && (
            <Button class="btn btn-primary" type="button" disabled>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Signing up...
            </Button>
          )}
        </form>
      </Signupform>
    </Signupsection>
  );
};

const Signupsection = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;

  @media (max-width: 600px) {
    height: 100vh;
    width: 100%;
    display: block;
  }
`;

const SignupImage = styled.div`
  height: 100vh;
  width: 50%;
  background-image: url(${image});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 600px) {
    width: 100%;
    height: 50vh;
  }
`;

const Signupform = styled.div`
  height: 100vh;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: aliceblue;
  input {
    padding: 7px;
    margin-bottom: 10px;
    width: 150%;
    border: none;
    outline: none;
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 50vh;
    input {
      padding: 7px;
      margin-bottom: 10px;
      width: 100%;
      border: none;
      outline: none;
    }
  }
`;

const Button = styled.button`
  background-color: aliceblue;
  padding: 7px;
  width: 50%;
  border: 2px solid white;
  outline: none;
`;

export default Signup;
