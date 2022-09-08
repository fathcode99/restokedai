import React, { useState, useEffect } from "react";
import Axios from 'axios'
import {
    Container, Row, Col
} from 'react-bootstrap'

import './pages.css'

// import component
import NavBar from "../component/navbar";
import Card from "../component/card"

import { Link } from 'react-router-dom'

const url = 'https://databasekedai.herokuapp.com'


export default function HomePages() {
    const [products, setProducts] = useState([])

    // pagination
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)

    
    let prodPerPage = 8
    let startCard = (page - 1) * prodPerPage
    let sliceCard = products.slice(startCard, startCard + prodPerPage)

    const urlWa = 'https://api.whatsapp.com/send?phone=6285812408808&text=Halo%20Kedai%20Pahlawan.%0ASaya%20ingin%20reservasi.'

    useEffect(() => {
        Axios.get(`${url}/products`)
            .then(res => {
                setProducts(res.data)
                setMaxPage(Math.ceil(res.data.length / prodPerPage))
            })
    }, [prodPerPage])

    const onNext = () => {
        setPage(page + 1)
    }
    const onPrev = () => {
        setPage(page - 1)
    }

    return (

        <div>
            <NavBar />
            {/* HEADER */}
            <div className="home-bg text-front-bg img-front p-0 m-0">
                <Container >
                    <Row>
                        <Col className="text-front col-lg-7 col-12 p-0">
                            <div className="title-front">Sedia makanan yang berkualitas</div>
                            <div className="p-img-front"><p>Kualitas rasa dan bahan tidak perlu anda khawatirkan.</p></div>
                            <a href={urlWa} target="_blank" rel="noopener noreferrer">
                                <button className="btn-style">Reservasi</button>
                            </a>
                        </Col>

                        <Col className="cont-img col-lg-5 col-12 p-0">
                            <div className="img-front">
                                <img src="https://i.pinimg.com/564x/d7/63/bf/d763bf0cc1f80744f1261ee67381cdfa.jpg" alt="head" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* ADS TO LOGIN */}
            <div className="ads-sign-in">
                <Container>
                    <Row>
                        <Col className="text-ads-signup m-0 p-0">
                            <Link as={Link} to="/register">
                                <button className="btn-style my-3">REGISTER</button>
                            </Link>
                            <div>
                                Registrasi dan dapatkan pelayanan Free Delivery Order !
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* EXCESS  */}
            <div className="container-excess my-3">
                <Container>
                    <div className="header-excess my-4">Mengapa kami menjadi pilihan tepat anda ?</div>
                    <div className="container-card-excess">
                        <div className="card-excess p-3 me-2">
                            <div className="title-excess">Chef yang berpengalaman</div>
                            <p className="p-excess">Kami memiliki chef yang sudah berpengalaman bertahun-tahun sebagai chef</p>
                        </div>

                        <div className="card-excess p-3 me-2">
                            <div className="title-excess">Bahan yang berkualitas</div>
                            <p className="p-excess">Seleksi terhadap bahan yang kami gunakan cukup ketat, agar rasa tetap terjaga kualitasnya</p>
                        </div>

                        <div className="card-excess p-3 me-2">
                            <div className="title-excess">Harga yang bersahabat</div>
                            <p className="p-excess">Kami memberikan makanan yang berkualitas, namun dengan harga yang bersahabat</p>
                        </div>

                        <div className="card-excess p-3 me-2">
                            <div className="title-excess">Pelayanan yang ramah</div>
                            <p className="p-excess">Tidak perlu khawatir atas pelayanan kami. Kami senantiasa memberikan pelayanan sepenuh hahti.</p>
                        </div>
                    </div>
                </Container>
            </div>

            {/* CARD MENU */}
            <div className="bg-menu py-4 my-2">
                <Container className="my-2">
                    <div className="header-excess my-4">All Menu</div>
                    <div className="container-card-map">
                        {sliceCard.map((item) =>
                            <Card
                                data={item}
                                key={item.id}
                            />
                        )}
                    </div>

                    {/* PAGINATION */}
                    <div className="pagination-product my-4">
                        <button className="btn-style mx-3" onClick={onPrev} disabled={page === 1 ? true : false}>Prev</button>
                        <label>Page {page}/{maxPage} </label>
                        <button className="btn-style mx-3" onClick={onNext} disabled={page === maxPage ? true : false}>Next</button>
                    </div>

                </Container>
            </div>


            {/* FOOTER */}
            <footer className="cont-footer">
                <Container>
                    <div className="cont-socmed py-5">
                        <p className="p-0 m-0">"Kepuasan anda akan rasa dari masakan kami, adalah prioritas bagi kami.</p>
                        <p className="p-0">Untuk itulah kami menerima segala saran kritik yang membangun."</p>
                    </div>
                </Container>
            </footer>
        </div>
    )
}