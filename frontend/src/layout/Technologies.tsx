interface Techology{
  name: string,
  imageSrc: string,
  description: string,

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
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Neo4j-logo_color.png/800px-Neo4j-logo_color.png",
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

  return (
    <section className="bg-my-dark py-10">
      <p className="text-center font-semibold text-3xl bg-my-orange p-5  text-my-darker">
        Modern Technologies
      </p>

      <div className="grid grid-cols-4 gap-10 mx-5 lg:mx-72 mt-5">
        {technologies.map((tech) => (
          <>
            <div className=" rounded-full p-2 bg-my-orange">
              <div className="rounded-full w-full h-full bg-my-dark p-2">
                <img
                  src={tech.imageSrc}
                  alt={`${tech.name} logo`}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="font-semibold text-lg text-my-orange">
                {tech.name}
              </h1>
              <p className="font-thin text-sm mt-2">{tech.description}</p>
            </div>
          
          </>
        ))}
      </div>
    </section>
  );
}
