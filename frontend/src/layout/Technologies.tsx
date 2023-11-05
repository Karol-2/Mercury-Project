import { AnimatePresence, motion } from "framer-motion";
import technologies from "../helpers/TechnologiesContent";

export default function Technologies() {
  return (
    <section className="bg-my-dark">
      <p className="text-center font-semibold text-3xl bg-my-orange p-5 text-my-darker">
        Modern Technologies
      </p>
      <AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mx-5 lg:mx-72 mt-5 py-10">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.5 }}
            >
              <div
                key={tech.name}
                className="relative w-[10vw] h-[10vw] rounded-full p-1 md:p-2 bg-my-orange"
              >
                <div className="rounded-full w-full h-full bg-my-dark p-2">
                  <div
                    style={{
                      backgroundImage: `url(${tech.imageSrc})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="rounded-full w-full h-full border-my-orange border-2"
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-justify">
                <h1 className="font-semibold text-2xl text-my-orange">
                  {tech.name}
                </h1>
                <p className="font-thin text-lg mt-2">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </section>
  );
}
