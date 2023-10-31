import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="flex flex-col">
      <div className="mx-50 lg:mx-96 py-40">
        <h1 className="text-center font-bold text-5xl">Let’s work together!</h1>
        <div className="bg-my-orange p-5 rounded-xl text-center mt-10 ">
          <p className="text-my-dark mt-5 text-xl">
            Ready to revolutionize the way you communicate? Start your journey
            today.
          </p>
          <p className="text-my-dark mt-5 text-xl">
            Best of all, it's free to get started. Don't wait, experience the
            future of communication now.
          </p>
          <Link to="/register">
            <button className="btn secondary mt-5">Join Us!</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
