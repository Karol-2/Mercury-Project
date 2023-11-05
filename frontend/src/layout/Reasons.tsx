import {
  faShield,
  faDesktop,
  faUsers,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

import { motion } from "framer-motion";
import ReasonCard from "../components/ReasonCard";

export default function Reasons() {
  return (
    <section className="bg-my-purple text-my-light p-10">
      <h1 className="text-center text-5xl font-bold">
        Why Should I Use Mercury?
      </h1>
      <motion.div
        initial={{ x: -200 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col md:grid md:grid-cols-4 md:gap-x-50 justify-evenly mt-5">
          <ReasonCard icon={faShield} title="Privacy and Security" />
          <ReasonCard
            icon={faDesktop}
            title="Cross-Platform Compatibility"
          />
          <ReasonCard
            icon={faUsers}
            title="User-Friendly Interface"
          />
          <ReasonCard icon={faGlobe} title="Global Reach" />
        </div>
      </motion.div>
    </section>
  );
}