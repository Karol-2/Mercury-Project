import React from "react";

interface ISlider {
  photoThumb: string;
  photoIndex: number;
  index: number;
}
const SliderContent = (props: ISlider) => {
  let position = "nextSlide";
  if (props.photoIndex === props.index) {
    position = "activeSlide";
  }
  if (
    props.photoIndex === props.index - 1 ||
    (props.index === 0 && props.photoIndex === 5)
  ) {
    position = "lastSlide";
  }
  return (
    <article className={position}>
      <img src={props.photoThumb} alt={`app interface ${props.index}`} />
    </article>
  );
};

export default SliderContent;
