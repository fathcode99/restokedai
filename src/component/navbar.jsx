import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    Nav, Navbar
} from 'react-bootstrap'

import { Link } from "react-router-dom";
import './component.css'

export default function NavBar() {
    const state = useSelector((state) => state.reducer)
    const dispatch = useDispatch()

    const onLogOut = () => {
        localStorage.removeItem('idUser')
        dispatch({
            type: "LOGOUT"
        })
    }

    return (

        <Navbar className='px-5' expand="lg">
            <Navbar.Brand className="nav-brand-style fs-2">
                Kedai Pahlawan
            </Navbar.Brand>


            <Navbar.Toggle className="toogle-style" />
            <Navbar.Collapse id="basic-navbar-nav" className="cont-nav-menu">
                <Nav className="nav-menu-style">
                    <Nav className="nav-text-menu" as={Link} to="/">HOME</Nav>
                    <Nav className="nav-text-menu" as={Link} to="/">ABOUT US</Nav>
                    <Nav className="nav-text-menu me-2" as={Link} to="/history">HISTORY</Nav>
                </Nav>

                
                {state.username ?
                    <Nav className="nav-menu-login">
                        <Nav className="nav-text-menu" as={Link} to="/login">Hello, {state.username}</Nav>
                        <Nav className="nav-text-menu" as={Link} to="/" onClick={onLogOut}>Log Out</Nav>
                    </Nav>
                    :
                    <Nav className="nav-menu-login">
                        <Nav className="nav-text-menu" as={Link} to="/login">LOGIN</Nav>
                        <Nav className="nav-text-menu" as={Link} to="/register">SIGN UP</Nav>
                    </Nav>
                }

            </Navbar.Collapse>

        </Navbar>
    )
} 