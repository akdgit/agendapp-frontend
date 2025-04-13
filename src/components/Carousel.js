import React from "react";
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import carousel1 from "./images/carrusel-1.webp";
import carousel2 from "./images/carrusel-2.webp";
import carousel3 from "./images/carrusel-3.webp";


function CustomCarousel() {
    return (
        <Carousel interval={4000} >
            <Carousel.Item>
                <img className="d-block w-100" src={carousel1} alt="Primera imagen" />
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src={carousel2} alt="Segunda imagen" />
            </Carousel.Item>
            <Carousel.Item>
                <img className="d-block w-100" src={carousel3} alt="Tercera imagen" />
            </Carousel.Item>
        </Carousel>
    );

};

export default CustomCarousel;