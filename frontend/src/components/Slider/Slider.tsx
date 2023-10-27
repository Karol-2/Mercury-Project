import React, { useState, useEffect } from "react";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import SliderContent from "./SliderContent";
import "./Slider.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Slider() {
  const [index, setIndex] = useState(0);
  const photoBase = [
    "https://cdn2.thecatapi.com/images/3bh.jpg",
    "https://cdn2.thecatapi.com/images/di7.jpg",
    "https://cdn2.thecatapi.com/images/e67.jpg",
    "https://cdn2.thecatapi.com/images/fa.jpg",
  ];

  useEffect(() => {
    const lastIndex = photoBase.length -1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index]);

  useEffect(() => {
    const slider = setInterval(() => {
      setIndex(index + 1);
    }, 4000);
    return () => clearInterval(slider);
  }, [index]);

  return (
    <section className="section">
      <div className="section-center">
        {photoBase.slice(0, 5).map((photo, photoIndex) => {
          return (
            <SliderContent
              photoThumb={photo}
              photoIndex={photoIndex}
              index={index}
            />
          );
        })}
        <button className="prev" onClick={() => setIndex(index - 1)}>
          <FontAwesomeIcon icon={faArrowCircleLeft} />
        </button>
        <button className="next" onClick={() => setIndex(index + 1)}>
          <FontAwesomeIcon icon={faArrowCircleRight} />
        </button>
      </div>
    </section>
  );
}

export default Slider;
