import React, { useState } from "react";

import {
    Modal, Nav
} from 'react-bootstrap'

import { Link, Navigate } from 'react-router-dom'
import Axios from 'axios'

import { useDispatch, useSelector } from "react-redux";

const url = "https://databasekedai.herokuapp.com"

export default function Login() {
    const state = useSelector((state) => state.reducer)
    const dispatch = useDispatch()

    
    const handleCloseLogin = () => {
        dispatch({
            type: "HANDLE_CLOSE"
        })
    }

    // Authentication
    const [errorUsername, setErrorUsername] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)

    const onSign = async () => {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value

        if (!username && !password) {
            return (setErrorPassword(true), setErrorUsername(true))
        } else if (!username && password) {
            return (setErrorPassword(false), setErrorUsername(true))
        } else if (username && !password) {
            return (setErrorPassword(true), setErrorUsername(false))
        }

        await Axios.get(`${url}/user?username=${username}&password=${password}`)
            .then(res => {
                if (res.data.length === 0) {
                    dispatch({
                        type: "ERROR_LOGIN"
                    })
                } else {
                    localStorage.setItem('idUser', res.data[0].id)
                    dispatch({
                        type: "LOGIN",
                        payload: res.data[0]
                    })
                }
                console.log(res.data)
            })
    }

    if (state.username) {
        return (<Navigate to="/" />)
    }

    return (
        <div className="login-bg">
            <div className="img-login-front">

                <Modal show={state.errorLogin} onHide={handleCloseLogin}>
                    <Modal.Body className="modal-body"><i className="fa-solid fa-triangle-exclamation px-2"></i>Akun ini belum terdaftar.</Modal.Body>
                </Modal>

                <div className="login-from-container">
                    <div className="login-text-title">Hello, welcome back !</div>
                    <div>
                        <div className="login-box-from">
                            <label>Username </label>
                            <input className="login-input px-0" style={{ width: "100%" }} type="text" placeholder="Username" id="username" />
                            {errorUsername ? <b className="p-error"> Please input your Username !</b> : ''}
                        </div>

                        <div className="login-box-from pt-2">
                            <label >Password </label>
                            <div className="login-box-form-pw">
                                <input className="login-input px-0" type="password" placeholder="Password" id="password" />
                            </div>
                            {errorPassword ? <b className="p-error"> Please input your Password !</b> : ''}
                        </div>

                        <button className="btn-style mt-3" onClick={onSign}>Login</button>

                        <p className="text-ask pt-3 m-0">
                            Don't have an account yet ?
                            <Nav as={Link} to="/register" className="btn-sign-up"> Sign Up </Nav>
                        </p>
                        <p className="text-ask ">
                            Go to
                            <Nav as={Link} to="/" className="btn-sign-up"> Home </Nav>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}