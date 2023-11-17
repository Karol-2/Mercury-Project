import Button from "../components/Button";

function ButtonShowcase() {
  return (
    <>
      <div className="text-my-light">Button showcase</div>
      <Button type="disabled">disabled</Button>
      <Button type="normal">normal</Button>
      <Button type="cancel">cancel</Button>
      <Button type="accept">accept</Button>
      <Button type="highlight">highlight</Button>
    </>
  );
}

export default ButtonShowcase;
