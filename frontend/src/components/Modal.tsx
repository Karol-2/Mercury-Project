interface ModalInterface{
    text: string,
    handleYes: ()=>void,
    handleNo: ()=>void,
}

function Modal(props: ModalInterface) {
  return (
    <>
    <div className=" bg-my-darker fixed top-0 bottom-0 right-0 left-0 text-my-orange opacity-80" id="bg-modal">
        
    </div>
    <div className="opacity-100 bg-my-dark fixed top-1/2 left-1/2 p-5 transform -translate-x-1/2 -translate-y-1/2 rounded-lg" id="modal-content">
    <h1 className=" font-semibold text-3xl">{props.text}</h1>
    <div className="flex justify-evenly text-my-light mt-10">
        <button onClick={props.handleYes} className="btn small bg-my-orange">Yes</button>
        <button onClick={props.handleNo} className="btn small bg-my-purple">No</button>
    </div>
</div>
</>
  );
}

export default Modal;
