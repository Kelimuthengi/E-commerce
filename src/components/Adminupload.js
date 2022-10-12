import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import styled from "styled-components";

const Adminupload = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setLoggedInUserId(uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  });

  const [uploadImage, setUploadImage] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [product, setProduct] = useState({
    productname: "",
    productDesc: "",
    productPrice: 0,
  });

  const uploadFile = () => {
    // create imageRef
    const ecommsImageRef = ref(storage, `ecomms/${uploadImage.name}`);
    uploadBytes(ecommsImageRef, uploadImage).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setDownloadUrl(url);
      });
    });
  };

  // fucntion to get product decsription;
  const getProductDetails = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setProduct({ ...product, [name]: value });
  };

  const uploadProduct = () => {

    const docId = Math.floor(Math.random() * 10000) + uploadImage.name
    console.log(uploadImage);
    console.log(uploadImage.name);
    setDoc(doc(db, "products", docId), {
      productName: product.productname,
      productPrice: product.productPrice,
      productDesc: product.productDesc,
      downloadUrl: downloadUrl,
      productId:docId
    }).then(() => {
      alert('product successfully addded!')
    }).catch((error) => {
      console.log(error);
    })
  };

  return (
    <Adminuploaddiv>
      <FormInput>
        <label htmlFor="">Enter product name</label>
        <input
          type="text"
          value={product.productname}
          name="productname"
          placeholder="Enter name"
          id="productname"
          onChange={getProductDetails}
        />
      </FormInput>

      <FormInput>
        <label htmlFor="">Enter decsription</label>
        <textarea
          name="productDesc"
          value={product.productDesc}
          id="productDesc"
          cols="30"
          rows="5"
          onChange={getProductDetails}
        ></textarea>
      </FormInput>

      <FormInput>
        <label htmlFor="">Enter product price</label>
        <input
          type="number"
          value={product.productPrice}
          name="productPrice"
          id="productPrice"
          onChange={getProductDetails}
        />
      </FormInput>

      <FormInput>
        <label htmlFor="uploadfile">Click to upload file</label>
        <input
          onChange={(e) => setUploadImage(e.target.files[0])}
          type="file"
          name=""
          id="uploadfile"
          style={{ display: "none" }}
        />
        <button onClick={uploadFile}>uploadfiles</button>
      </FormInput>

      <div>
        <Button onClick={uploadProduct}>UPLOAD PRODUCT</Button>
      </div>
    </Adminuploaddiv>
  );
};

const Adminuploaddiv = styled.div `
  height: 100vh;
  width: 100%;
  background-color: aliceblue;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  `

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 18rem;
  box-shadow: 2px 4px white;
  padding: 1rem;
  margin-bottom: 0.5rem;

  input {
    padding: 7px;
    border: none;
    outline: none;
  }
  label {
    font-family: sans-serif;
  }
  textarea {
    border: none;
    outline: none;
    padding: 7px;
  }
  button{
    padding: 5px;
    background-color: aliceblue;
    border: 1px solid white;
    font-family: sans-serif;
    font-weight: 700;
  }
`;

const Button = styled.button`
  padding: 5px;
  background-color: aliceblue;
  border: 1px solid white;
  font-family: sans-serif;
  font-weight: 700;
`;
export default Adminupload;
