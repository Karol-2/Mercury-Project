import {
  faShield,
  faDesktop,
  faUsers,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

export default function Reasons() {


  return (
    

      <section className="  bg-my-purple text-my-light p-10">
        <h1 className=" text-center text-5xl font-bold">
          Why Should I Use Mercury?
        </h1>
        <motion.div
       initial={{ x: -200 }}
       whileInView={{ x: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 1 }}
    >
        <div className="flex flex-col md:grid md:grid-cols-4 md:gap-x-50  justify-evenly mt-5">
          <div
            className=" hover:bg-my-light hover:text-my-dark p-5 rounded-xl
           text-center clickable cursor-default my-5"
          >
            <FontAwesomeIcon
              icon={faShield}
              className=" text-my-orange text-8xl mb-5"
            />
            <p className=" font-semibold text-lg">Privacy and Security</p>
          </div>
          <div
            className=" hover:bg-my-light hover:text-my-dark p-5 rounded-xl
           text-center clickable cursor-default my-5"
          >
            <FontAwesomeIcon
              icon={faDesktop}
              className=" text-my-orange text-8xl mb-5"
            />
            <p className=" font-semibold text-lg">
              Cross-Platform Compatibility
            </p>
          </div>
          <div
            className=" hover:bg-my-light hover:text-my-dark p-5 rounded-xl
           text-center clickable cursor-default my-5"
          >
            <FontAwesomeIcon
              icon={faUsers}
              className=" text-my-orange text-8xl mb-5"
            />
            <p className=" font-semibold text-lg">User-Friendly Interface</p>
          </div>
          <div
            className=" hover:bg-my-light hover:text-my-dark p-5 rounded-xl
           text-center clickable cursor-default my-5"
          >
            <FontAwesomeIcon
              icon={faGlobe}
              className=" text-my-orange text-8xl mb-5"
            />
            <p className=" font-semibold text-lg">Global Reach</p>
          </div>
        </div>
        </motion.div>
      </section>
    
  );
}
