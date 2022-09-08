import React, { useState } from "react";

import { Link, Navigate } from "react-router-dom"

import { useSelector } from "react-redux"
import Axios from 'axios'

import './component.css'

const url = 'https://databasekedai.herokuapp.com'

export default function Card(dataproducts) {
    const state = useSelector((state) => state.reducer)

    const qty = 1
    const [toLogin, setToLogin] = useState(false)


    const onAddToCart = (id) => {
        if (!state.username)
            return setToLogin(true)

        let tempCart = state.cart

        let dataProducts = {
            id: dataproducts.data.id,
            name: dataproducts.data.name,
            price: dataproducts.data.price,
            images: dataproducts.data.images[0],
            maxStock: dataproducts.data.stock,
            qtyBuy: qty,
        }

        // untuk menambahkan update data jika produk sudak tersedia
        for (let i = 0; i < state.cart.length; i++) {
            if (state.cart[i].id === dataproducts.data.id) {
                let tempCart = state.cart
                let tempProd = state.cart[i]
                tempProd.qtyBuy += qty
                return (
                    tempCart.splice(i, 1, tempProd),
                    Axios.patch(`${url}/user/${state.id}`, { cart: tempCart })
                )
            }
        }

        tempCart.push(dataProducts)

        Axios.patch(`${url}/user/${state.id}`, { cart: tempCart })
    }

    if (toLogin)
        return (<Navigate to="/login" />)

    return (
        <div className="cont-card-menu p-2 my-4 mx-3">
            <div className="cont-img-card">
                <img className="img-card mb-3" src={dataproducts.data.images[0]} alt="menu" />
            </div>

            <div className="title-card-menu pt-2">{dataproducts.data.name}</div>
            <div className="title-card-menu">Rp {dataproducts.data.price.toLocaleString()}</div>
            <div className="cont-btn my-2">
                <Link as={Link} to={`/detail/${dataproducts.data.id}`} className="link-to-detail">
                    <button className="btn-style-comp px-2"> Detail </button>
                </Link>
                <button className="btn-style-comp px-2 mx-2" onClick={() => onAddToCart(dataproducts.data.id)}> Add to Cart </button>
                <Link as={Link} to={`/cart`} className="link-to-detail">
                    <button className="btn-style-comp px-2"> Cart </button>
                </Link>
            </div>
        </div >
    )
}