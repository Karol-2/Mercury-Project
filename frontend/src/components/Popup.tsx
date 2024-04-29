import { motion } from "framer-motion";
import { useEffect } from "react";

interface PopupProps {
  header: string;
  isVisibleState: boolean;
  isVisibleHandler: () => void;
  seconds: number;
}

function Popup(props: PopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.isVisibleHandler();
    }, 1000 * props.seconds);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {" "}
      {props.isVisibleState && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="bg-my-orange fixed top-1/2 right-5 p-2 rounded-lg"
          id="popup-body"
        >
          <div className=" flex flex-row" id="popup-content">
            <h1 className="font-semibold text-2xl mr-5">{props.header}</h1>
            <button
              onClick={() => {
                props.isVisibleHandler();
              }}
              className="btn h-10 w-10 bg-my-purple"
            >
              X
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Popup;
