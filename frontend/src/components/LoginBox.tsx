import Button from "../components/Button"


function LoginBox() {
  const loginFunc = async () => {
    const response = await fetch("http://localhost:5000/users/1")
    const user = await response.json()
    console.log("Login " + JSON.stringify(user))
  }

  const registerFunc = () => {
    console.log("Register")
  }

  return (
    <div className="w-64 flex flex-col gap-2">
      <div>Login:</div>
      <input type="text" className="text-my-dark"/>

      <div>Password:</div>
      <input type="password" className="text-my-dark"/>

      <div className="grid grid-cols-2">
        <Button type="normal" onClick={() => loginFunc()}>Login</Button>
        <Button type="normal" onClick={() => registerFunc()}>Register</Button>
      </div>
    </div>
  )
}

export default LoginBox
