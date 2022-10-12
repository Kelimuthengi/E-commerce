import React, { useState, useEffect, memo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import styled from "styled-components";
const Allproducts = memo(() => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // get logged in person
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUserId(uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    getDocs(collection(db, "products")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setProducts((prevProduct) => {
          return [...prevProduct, doc.data()];
        });
        // setProducts([...products, doc.data()]);
      });
    });
  }, []);

  const addToCart = (data) => {
    let cartId = Math.floor(Math.random() * 10000) + data.productName;
    setDoc(doc(db, "cart", cartId), {
      productName: data.productName,
      downloadUrl: data.downloadUrl,
      productPrice: data.productPrice,
      productId: data.productId,
      userId: userId,
    })
      .then(() => {
        alert("product successfully added!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Allproductsdiv>
      {products.map((product) => {
        return (
          <SingleProduct
            key={product.productId}
            {...product}
            addToCart={addToCart}
          />
        );
      })}
    </Allproductsdiv>
  );
});

const SingleProduct = ({
  productName,
  productDesc,
  downloadUrl,
  productPrice,
  addToCart,
  productId,
}) => {
  return (
    <Imagecard>
      <img src={downloadUrl} height="100px" alt="" />
      <h4>{productName}</h4>
      <h5>{productPrice}</h5>
      <p>{productDesc}</p>
      <button
        onClick={() =>
          addToCart({
            productName,
            // productDesc,
            downloadUrl,
            productPrice,
            productId,
          })
        }
      >
        ADD TO CART
      </button>
    </Imagecard>
  );
};

const Allproductsdiv = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: aliceblue;
  padding: 3rem;
  /* flex-grow: ; */
`;

const Imagecard = styled.div`
  /* border: 2px solid red; */
  padding: 1rem;
  width: 15rem;
  height: fit-content;
  margin: 0.5rem;
  background-color: white;
  font-family: sans-serif;
  box-shadow: 2px 2px aliceblue;
  flex-grow: 1;
  img {
    width: 100%;
    object-fit: contain;
  }
  h4 {
    text-transform: capitalize;
  }

  button {
    border: none;
    background-color: aliceblue;
    padding: 0.2rem;
    margin-top: 5px;
    text-transform: lowercase;
  }
`;

export default Allproducts;
