import { AnimatePresence, motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

interface Techology {
  name: string;
  imageSrc: string;
  description: string;
}

export default function Technologies() {
  const technologies: Techology[] = [
    {
      name: "React",
      imageSrc:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
      description:
        "React's component-based architecture allows us to create a dynamic and responsive user interface that ensures a smooth and engaging user experience. With React, we can quickly adapt to changing user needs and continuously improve the app's performance.",
    },
    {
      name: "WebRTC",
      imageSrc:
        "https://webrtc.github.io/webrtc-org/assets/images/webrtc-logo-vert-retro-255x305.png",
      description:
        "This open-source project empowers us to offer seamless and secure peer-to-peer connections. WebRTC's capability to establish direct communication between users' devices ensures high-quality voice and video calls, contributing to an unparalleled communication experience.",
    },
    {
      name: "NEO4J",
      imageSrc:
        "https://assets.stickpng.com/thumbs/6303a04bab1b900654aad39e.png",
      description:
        "Neo4J's graph database structure is instrumental in managing complex relationships and connections, which is vital for a communication app. This technology enables us to provide users with efficient and relevant search and recommendation features while maintaining data integrity and security.",
    },
    {
      name: "TypeScript",
      imageSrc:
        "https://cdn.icon-icons.com/icons2/2415/PNG/512/typescript_original_logo_icon_146317.png",
      description:
        "TypeScript plays a crucial role in enhancing the maintainability and reliability of our app. As a statically typed superset of JavaScript, TypeScript helps us catch potential issues during development, reducing errors and improving code quality.",
    },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  return (
    <section className="bg-my-dark">
      <p className="text-center font-semibold text-3xl bg-my-orange p-5 text-my-darker">
        Modern Technologies
      </p>
      <AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mx-5 lg:mx-72 mt-5 py-10">
          {technologies.map((tech, index) => (
          <motion.div
          ref={ref}
          key={tech.name}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -100 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, delay: index * 0.5 }}
        >
              <div
                key={tech.name}
                className="relative w-[15vw] h-[15vw] rounded-full p-2 bg-my-orange"
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
