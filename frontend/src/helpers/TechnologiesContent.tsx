interface Techology {
    name: string;
    imageSrc: string;
    description: string;
  }

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
        "https://go.neo4j.com/rs/710-RRC-335/images/neo4j_logo_globe.png",
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

  export default technologies