export default function PhotoAndText() {
  return (
    <section className=" text-my-darker  gap-10 min-w-fit ">
      <div className="bg-my-dark relative">
      <p className="text-center font-semibold text-3xl bg-my-orange p-5">
        Brand New Approach
      </p>
        <div className=" mx-50 lg:mx-72 flex items-center justify-center py-20 content-center  ">
          

          <div className=" grid grid-cols-2 gap-10">
            <div className="w-80 h-80 rounded-full p-2 bg-my-orange">
              <div className="rounded-full w-full h-full bg-my-dark p-2">
                <img
                  src="https://images.inc.com/uploaded_files/image/1920x1080/getty_478389113_970647970450091_99776.jpg"
                  alt="Happy working people"
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>

            <div className=" bg-my-orange p-5 rounded-xl text-lg">
              <p>
                Are you tired of struggling to keep in touch with friends,
                family, and colleagues?{" "}
              </p>
              <p className=" mt-10">
                Mercury is here to make communication effortless and enjoyable.
                Our powerful communication app is designed to connect people in
                a whole new way!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
