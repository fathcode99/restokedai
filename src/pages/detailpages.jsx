import React, { useEffect, useState } from "react";
import Axios from 'axios'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {
    Container, Col, Row
} from "react-bootstrap"

import NavBar from '../component/navbar'

import "./pages.css"

const url = 'https://databasekedai.herokuapp.com'

export default function Detail() {
    const state = useSelector((state) => state.reducer)

    const [products, setProducts] = useState({})

    const [qty, setQty] = useState(1)
    const [toLogin, setToLogin] = useState(false)

    let { id } = useParams();
    useEffect(() => {
        Axios.get(`${url}/products/${id}`)
            .then(res => {
                setProducts(res.data)
            })
    }, [id])

    const onMin = () => {
        setQty(+qty - 1)
    }

    const onPlus = () => {
        setQty(+qty + 1)
    }

    const onQty = (e) => {
        setQty(+e.target.value)

        let n = +e.target.value
        let maxQty = +products.stock
        if (n < +1) {
            setQty('')
            if (qty === '') {
                setQty(1)
            }
        } else if (n > maxQty) {
            setQty(maxQty)
        } else if (n === '') {
            setQty(1)
        }
    }

    const onAddToCart = () => {
        if (!state.username)
            return setToLogin(true)

        let tempCart = state.cart
        let dataProducts = {
            id: products.id,
            name: products.name,
            price: products.price,
            images: products.images[0],
            maxStock: products.stock,
            qtyBuy: qty,
        }

        // untuk menambahkan update data jika produk sudak tersedia
        for (let i = 0; i < state.cart.length; i++) {
            if (state.cart[i].id === products.id) {
                let tempCart = state.cart
                let tempProd = state.cart[i]
                tempProd.qtyBuy += qty
                return (
                    tempCart.splice(i, 1, tempProd),
                    Axios.patch(`${url}/user/${state.id}`, { cart: tempCart })
                        .then(res => {
                            Axios.get(`${url}/products/${id}`)
                                .then(res => {
                                    setProducts(res.data)
                                })
                        })
                )
            }
        }
        tempCart.push(dataProducts)

        Axios.patch(`${url}/user/${state.id}`, { cart: tempCart })
            .then(res => {
                Axios.get(`${url}/products/${id}`)
                    .then(res => {
                        setProducts(res.data)
                    })
            })
    }

    if (toLogin)
        return (<Navigate to="/login" />)

    return (
        <div className="bg-detail">
            <NavBar />
            <Container>
                <Row className="mt-3 mb-0">
                    <Col lg={12} className="heading-detail px-0">
                        <label>Detail Product</label>
                        <Link as={Link} to="/cart">
                            <button className="btn-style"><i className="fa-solid fa-cart-shopping px-2"></i>Cart</button>
                        </Link>
                    </Col>
                </Row>

                <Row className="py-4">
                    <Col lg={5} className="detail-img-box px-0">
                        {products.images ?
                            <img src={products.images[0]} alt="products" className="img-detail" />
                            : []}
                    </Col>

                    <Col lg={7} className="ps-4">
                        <Col className="detail-brand mt-3 mb-0 p-0">{products.brand ? products.brand : ''} </Col>
                        <Col className="detail-title">{products.name ? products.name : ''}</Col>
                        <Col className="detail-price">IDR : {products.price ? products.price.toLocaleString() : ''}</Col>
                        <Col className="detail-p"> Ready stock :{products.stock ? products.stock : ''}</Col>
                        <Col className="detail-p">{products.description ? products.description : ''}</Col>

                        <Col className="detail-p"><i className="fa-solid fa-tags px-3"></i> Special Discount Today</Col>
                        <Col className="detail-p"><i className="fa-solid fa-tags px-3"></i>Free Delivery Order </Col>

                        <Col>
                            <label className="detail-p me-3"> Set Quantity : </label>
                            <button className="btn-qty" onClick={onMin} disabled={qty === 1 ? true : false}> -</button>
                            <input className="qty-input" type="text" value={qty} onChange={(e) => onQty(e)} />
                            <button className="btn-qty" onClick={onPlus} disabled={qty === products.stock ? true : false}>+</button>
                        </Col>
                        <Col>
                            <button className="btn-style me-2 mt-3" onClick={onAddToCart} >
                                <i className="fa-solid fa-cart-shopping px-2"></i>Add to Cart 
                                <span className="badge-cart px-1 mx-1">{state.cart.length}</span>
                            </button>
                            <button className="btn-style"><i className="fa-solid fa-comment-dollar px-2"></i>Chat Seller </button>
                        </Col>
                    </Col>


                </Row>
            </Container>
        </div>
    )
}