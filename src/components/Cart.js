import React, { useState, useEffect, memo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import styled from "styled-components";

const Cart = memo(() => {
  const [userId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({ quantity: 0 });
  const [totalArray, settotalArray] = useState([0]);
  const [productsTotal, setProductsTotal] = useState(0);

  useEffect(() => {
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

    // Create a query against the collection.
    const q = query(collection(db, "cart"), where("userId", "==", userId));
    getDocs(q).then((products) => {
      // setProducts(
      //   products.docs.length > 0 &&
      //     products.docs.map((product) => ({
      //       downloadUrl:
      //         product._document.data.value.mapValue.fields.downloadUrl
      //           .stringValue,
      //       productName:
      //         product._document.data.value.mapValue.fields.productName
      //           .stringValue,
      //       productPrice:
      //         product._document.data.value.mapValue.fields.productPrice
      //           .stringValue,
      //       quantity: 0,
      //       productId:
      //         product._document.data.value.mapValue.fields.productId
      //           .stringValue,
      //     }))
      // );
      products.forEach((product) => {
        // console.log(product.data());
        const myproduct = product.data();
        const newProduct = { productTotal: 0, quantity: 0, ...myproduct };
        setProducts((products) => {
          return [...products, newProduct];
        });
      });
    });
  }, [userId]);

  const updatequantity = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setProducts(
      products.map((product) => ({
        ...product,
        ...(name === product.productId
          ? {
              quantity: value,
              productTotal: value * product.productPrice,
            }
          : {}),
      }))
    );
  };

  useEffect(() => {
    setProductsTotal(
      products.reduce((acc, product) => {
        const productTotal = product.quantity * product.productPrice;
        return (acc += productTotal);
      }, 0)
    );;
    
  }, [products]);

  console.log(productsTotal);
  // useEffect(() => {
  //   const keli =
  //     totalArray.length > 0 &&
  //     totalArray.reduce((a, b) => {
  //       return a + b;
  //     });
  //   setProductsTotal(keli);
  // });

  // REMOVE ITEM FROM CART;
  const removeItem = (value) => {

    setProducts(products.filter((product) => product.productId !== value))
  }
  return (
    <Tablediv>
      <div>
        <Table>
          <thead>
            <tr>
              <th>PRODUCT NAME</th>
              <th>SELLING PRICE</th>
              <th>QUANTITY</th>
              <th>TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.productId}>
                  <td>{product.productName}</td>
                  <td>{product.productPrice}</td>
                  <td>
                    <input
                      value={product.quantity}
                      type="number"
                      onChange={updatequantity}
                      name={product.productId}
                      id={product.productId}
                    />
                  </td>
                  <td>{product.productTotal}</td>
                  <Removetd onClick={() => removeItem(product.productId)}>
                    Remove
                  </Removetd>
                </tr>
              );
            })}
          </tbody>
          <Totaltbody>
            <tr>
              <td>FULL TOTAL</td>
              <td></td>
              <td></td>
              <td>{productsTotal}</td>
            </tr>
          </Totaltbody>
        </Table>
      </div>
    </Tablediv>
  );
});

const Tablediv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`

const Table = styled.table`
  width: 100%;
  height: auto;

  td {
    text-align: center;
    padding: 0.3rem;
  }
  tr {
    padding: 0.5rem;
  }
  tr:nth-child(even) {
    background-color: aliceblue;
  }
  th {
    background-color: aliceblue;
    color: green;
    padding: 0.3rem;
  }
  input {
    border: none;
    outline: none;
    padding: 0.2rem;
  }
`;

const Removetd = styled.td `
  color: red;
  cursor: pointer;
`
const Totaltbody = styled.tbody `
color: green;
`
export default Cart;
