import Slider from "../components/Slider/Slider";

  export default function Carousel() {
 
  
    return (
      <section >
        <p className="text-center font-semibold text-3xl bg-my-orange p-5  text-my-darker">
        Inside The App
      </p>
        <div className="lg:mx-64 mx-10 mt-10 p-10 flex flex-col rounded-3xl justify-center align-middle">
        
        {/* <img
          src="https://cdn2.thecatapi.com/images/di7.jpg"
          className=" rounded-3xl"
        ></img> */}
        <Slider />
      </div>
      </section>
    );
  }
  