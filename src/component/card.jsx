import React from "react";

import { Link } from "react-router-dom"

import './component.css'
export default function Card(products) {   
    return (
        <div className="cont-card-menu p-2 my-4 mx-3">
            <div className="cont-img-card">
                <img className="img-card mb-3" src={products.data.images[0]} alt="menu" />
            </div>

            <div className="title-card-menu pt-2">{products.data.name}</div>
            <div className="title-card-menu">Rp {products.data.price.toLocaleString()}</div>
            <div className="cont-btn my-2">
                <Link as={Link} to={`/detail/${products.data.id}`} key={products.data.id} className="link-to-detail">
                    <button className="btn-style-comp px-2 me-2"> Detail </button>
                </Link>
                <button className="btn-style-comp px-2"> Add to Cart </button>
            </div>
        </div >
    )
}