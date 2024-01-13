import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface TransitionProps {
  startAnimation: boolean;
}

const Transition: React.FC<TransitionProps> = ({ startAnimation }) => {
  const controls = useAnimation();

  const animateSquare = async () => {
    console.log("start anim");
    
    await controls.start({ y: 0, opacity: 1});

    await new Promise((resolve) => setTimeout(resolve,80));

    await controls.start({ y: "-100%" });

    await controls.start({  opacity: 0 });
  };

  useEffect(() => {
    console.log(startAnimation);
    
    if (startAnimation) {
      animateSquare();
    }
  }, [startAnimation]);

  return (
    <div id="transition-div">
      <motion.div
        style={{
          width: "100%",
          height: "100vh",
          background: "#FF8001",
          position: "absolute",
          top: 0,
          zIndex: 10,
        }}
        initial={{ y: "-100%"}}
        animate={controls}
      />
    </div>
  );
};

export default Transition;
