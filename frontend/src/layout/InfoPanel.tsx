interface panelProps {
  photoRight: boolean;
  photo: string;
  text: string;
  index: number;
}

export default function InfoPanel(props: panelProps) {
  return (
    <section className="min-h-screen text-my-light  gap-10 min-w-fit ">
      <div className={props.index % 2 !== 0 ? "bg-my-orange" : "bg-my-purple"}>
      <div className=" mx-50 lg:mx-72 flex items-center justify-center min-h-screen content-center">

          <div className=" flex flex-row gap-10 lg:gap-40">
            <div>
              <img
                src={props.photo}
                className="rounded-3xl "
              />
            </div>
            <div
              className={`bg-my-dark p-10 rounded-xl self-center text-justify ${
                !props.photoRight ? "" : "order-first"
              }`}
            >
              <p className=" text-2xl lg:text-4xl font-semibold mb-10"> TITLE </p>
              <p className=" text-lg lg:text-2xl">
              {props.text}
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
