import { motion, AnimatePresence } from "framer-motion";

interface ModalInterface {
  text: string;
  handleYes: () => void;
  handleNo: () => void;
}

function Modal(props: ModalInterface) {
  return (
    <AnimatePresence>
      <>
        <motion.div
          className="bg-my-darker fixed top-0 bottom-0 right-0 left-0 text-my-orange"
          id="bg-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
        ></motion.div>
        <motion.div
          className="bg-my-dark fixed top-1/2 left-1/2 p-5 rounded-lg"
          id="modal-content"
          initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%" }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <h1 className="font-semibold text-3xl">{props.text}</h1>
          <div className="flex justify-evenly text-my-light mt-10">
            <button
              onClick={props.handleYes}
              className="btn small bg-my-orange"
            >
              Yes
            </button>
            <button onClick={props.handleNo} className="btn small bg-my-purple">
              No
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

export default Modal;
