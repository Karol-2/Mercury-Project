import Button from "../components/Button"


function RegisterBox() {
  const registerFunc = async () => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
    const user = await response.json()
    console.log("Register " + JSON.stringify(user))
  }

  return (
    <div className="w-64 flex flex-col gap-2">
      <div>Login:</div>
      <input type="text" className="text-my-dark" />

      <div>First name:</div>
      <input type="text" className="text-my-dark" />

      <div>Last name:</div>
      <input type="text" className="text-my-dark" />

      <div>
        <span>Country:</span>
        <input type="text" className="text-my-dark" />
      </div>

      <div>Profile picture:</div>
      <input type="file" className="text-my-dark" />

      <div>E-mail:</div>
      <input type="text" className="text-my-dark" />
      
      <Button type="normal" onClick={() => registerFunc()}>Register</Button>
    </div>
  )
}

export default RegisterBox
