import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const scrollToTop = (): void => {
  window.scrollTo(0, 0);
};

export default function CallToAction() {
  return (
    <section className="flex flex-col">
      <div className="mx-50 lg:mx-96 py-40">
        <h1 className="text-center font-bold text-5xl">Let's work together!</h1>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        >
          <div className="bg-my-orange p-5 rounded-xl text-center mt-10">
            <p className="text-my-dark mt-10 text-2xl font-bold ">
              Ready to revolutionize the way you communicate? Start your journey
              today.
            </p>
            <p className="text-my-dark mt-5 text-xl">
              Best of all, it's free to get started. Don't wait, experience the
              future of communication now.
            </p>
            <Link to="/register">
              <button className="btn secondary mt-20" onClick={scrollToTop}>
                Join Us!
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
