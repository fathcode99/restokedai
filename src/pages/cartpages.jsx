import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import Axios from "axios";
import {
    Container, Row, Col, Modal
} from 'react-bootstrap'

import NavBar from '../component/navbar'
import './pages.css'

const url = 'https://databasekedai.herokuapp.com'

export default function Cart() {
    const state = useSelector((state) => state.reducer)
    const dispatch = useDispatch()
    
    const [cartList, setCartList] = useState([])
    const [indexEdit, setIndexEdit] = useState(null)
    const [errorCeck, setErrorCeck] = useState(false)
    const handleClose = () => setErrorCeck(false);
    const [toHistory, setToHistory] = useState(false)

    // validation password
    const [validPw, setValidPw] = useState(false)
    const handleCloseValid = () => setValidPw(false);

    const [errorPassword, setErrorPassword] = useState(false)

    const [qty, setQty] = useState(null)

    useEffect(() => {
        Axios.get(`${url}/user/${state.id}`)
            .then(res => {
                setCartList(res.data.cart)
            })
    }, [state.id])

    const onDelete = (index) => {
        let tempCart = state.cart
        tempCart.splice(index, 1)
        Axios.patch(`${url}/user/${state.id}`, { cart: tempCart })
            .then(res => {
                setCartList(res.data.cart)
            })
    }

    const onEdit = (index) => {
        setIndexEdit(index)
        setQty(cartList[index].qtyBuy)
    }

    const onMin = (index) => {
        setQty(+qty - 1)
    }

    const onPlus = () => {
        setQty(+qty + 1)
    }

    const onQty = (e, maxStock) => {
        setQty(+e.target.value)

        let n = +e.target.value

        if (n < +1) {
            setQty(0)
        } else if (n > maxStock) {
            setQty(maxStock)
        } else {
            setQty(n)
        }
    }

    const onSave = (index) => {
        let tempCart = cartList
        let tempProd = cartList[index]

        tempProd.qtyBuy = qty
        tempCart.splice(index, 1, tempProd)

        Axios.patch(`${url}/user/${state.id}`, { cart: tempCart })
            .then(res => {
                setCartList(res.data.cart)
            })
        setIndexEdit(null)
    }

    const TotalPrice = () => {
        let total = null
        for (let i = 0; i < cartList.length; i++) {
            total += +cartList[i].qtyBuy * +cartList[i].price
        }
        return (total)
    }

    const onCeckOut = () => {
        if (cartList.length === 0) {
            return setErrorCeck(true)
        } else {
            return setValidPw(true)
        }
    }

    const onValidPw = () => {
        let validate = document.getElementById('password').value
        let dataHistory = {
            idUser: state.id,
            username: state.username,
            time: new Date().toLocaleString(),
            products: cartList
        }
        if (state.password !== validate) {
            return setErrorPassword(true)
        } else if (state.password === validate) {
            return (
                setToHistory(true),
                Axios.post(`${url}/history`, dataHistory)
                    .then(res => {
                        let idUser = localStorage.getItem('idUser')
                        Axios.get(`${url}/history?idUser=${idUser}`)
                            .then(res => {
                                dispatch({
                                    type: 'HISTORY_UPDATE',
                                    payload: res.data
                                })
                            })
                    })
                    .then(res => {
                        Axios.patch(`${url}/user/${state.id}`, { cart: [] })
                            .then(res => {
                                Axios.get(`${url}/user/${state.id}`)
                                    .then(res => {
                                        dispatch({
                                            type: 'LOGIN',
                                            payload: res.data
                                        })
                                    })
                                setCartList([])
                            })
                    })
            )
        }
    }

    if (toHistory) {
        return (<Navigate to="/history" />)
    }

    return (
        <div className="bg-detail">
            <Modal show={errorCeck} onHide={handleClose}>
                <Modal.Body className="modal-body"><i className="fa-solid fa-triangle-exclamation px-2"></i>Your shopping cart is empty. Please add product first !</Modal.Body>
            </Modal>
            <Modal show={validPw} onHide={handleCloseValid}>
                <Modal.Body className="modal-body-ceck">
                    <div className="checkout-box-pw p-0">
                        <label>Please input your password to validate </label>
                        <div >
                            <div className="modal-box-input">
                                <input className="login-input-modal px-0" type="password" placeholder="Input your password ..." id="password" />
                                <button className="btn-style mx-3" onClick={onValidPw}>Validate</button>
                            </div>
                        </div>
                        {errorPassword ? <b className="p-error"> Password doesn't match ! Validation failed. </b> : ''}
                    </div>
                </Modal.Body>
            </Modal>

            <NavBar />
            {console.log(cartList)}
            <Container style={{ paddingBottom: "4rem" }}>
                <Row className="mt-3 mb-0">
                    <Col lg={12} className="heading-detail px-0">
                        <label>Your Shopping Cart</label>
                        <button className="btn-style" onClick={onCeckOut}><i className="fa-solid fa-cart-shopping px-2" ></i>Checkout</button>
                    </Col>
                </Row>

                {cartList.length !== 0 ?
                    <>
                        {cartList.map((item, index) =>
                            <Row key={item.id}>
                                <div className="cart-box mt-3 py-3">
                                    <div className="cart-box-img m-0">
                                        <img className="cart-img me-2" src={item.images} alt="product" />
                                    </div>
                                    <div className="cart-title me-2">
                                        <div className="cart-title-brand">{item.brand}</div>
                                        <div className="cart-title-name">{item.name}</div>
                                        <div className="cart-stock">Ready stock : {item.maxStock}</div>
                                    </div>
                                    <div className="cart-price-pcs me-2">IDR {item.price.toLocaleString()} / pcs</div>

                                    <div className="cart-counter me-2">
                                        {indexEdit === index ?
                                            <>
                                                <div>
                                                    <button className="btn-qty" onClick={() => onMin(index)} disabled={qty === 1 ? true : false}> -</button>
                                                    <input className="qty-input" type="text" value={qty} onChange={(e) => onQty(e, item.maxStock)} />
                                                    <button className="btn-qty" onClick={onPlus} disabled={qty === item.maxStock ? true : false}>+</button>
                                                </div>

                                                <div>
                                                    <button className="btn-style-3 px-1" onClick={() => setIndexEdit(null)}>
                                                        <i className="fa-solid fa-rectangle-xmark "></i>
                                                    </button>
                                                    <button className="btn-style-3 p-0" onClick={() => onSave(index)}>
                                                        <i className="fa-solid fa-square-check "></i>
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <>
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                <p className="m-0">{item.qtyBuy}</p>
                                                <button className="btn-style-3" onClick={() => onEdit(index)}><i className="fa-solid fa-pen-to-square"></i></button>
                                            </div>
                                            </>
                                        }
                                    </div>

                                    <div className="cart-price me-2">IDR {(item.qtyBuy * item.price).toLocaleString()}</div>
                                    <div className="cart-close" >
                                        <button className="btn-style-3" onClick={() => onDelete(index)}>
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            </Row>
                        )}
                        <Row>
                            <div className="cart-box-bottom py-4 mt-3">
                                <div>
                                    <Link as={Link} to="/">
                                        <button className="btn-style-3 "><i class="fa-solid fa-arrow-left-long pe-2"></i>Back to Shop</button>
                                    </Link>
                                </div>
                                <div className="cart-bottom-price">
                                    Total Price : IDR {cartList.length !== 0 ? TotalPrice().toLocaleString() : ''}
                                    <Link as={Link} to="/">
                                        <button className="btn-style-3 ps-5"><i className="fa-solid fa-cart-shopping px-2"></i></button>
                                    </Link>
                                </div>
                            </div>
                        </Row>
                    </>
                    :
                    <>
                        {!state.id ?
                            <div className="empty-cart">
                                <i className="fa-solid fa-triangle-exclamation py-3"></i>Please Login first to see your Shopping Cart !
                                <Link as={Link} to="/login">
                                    <button className="btn-style my-2">Go to Login</button>
                                </Link>
                            </div>
                            :
                            <>
                                <div className="empty-cart">
                                    <i className="fa-solid fa-triangle-exclamation my-3"></i>Your Shopping Cart is Empty !
                                    <Link as={Link} to="/">
                                        <button className="btn-style mt-4">Back to Shop</button>
                                    </Link>
                                </div>
                            </>
                        }
                    </>
                }

            </Container>
        </div>
    )
}