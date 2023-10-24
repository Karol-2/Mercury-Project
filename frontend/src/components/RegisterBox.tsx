import { useEffect, useState } from "react"
import Button from "../components/Button"


function RegisterBox() {
  const [user, setUser] = useState({})
  useEffect(() => {
    console.log(user)
  }, [user])

  const updateFormUser = (key: string) => {
    const changeKey = updateUser(key)
    return (e: React.ChangeEvent<HTMLInputElement>) => changeKey(e.target.value)
  }

  const updateUser = (key: string) => (value: any) => {
    setUser({...user, [key]: value})
  }

  const registerFunc = async () => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    const userJson = await response.json()
    console.log("Register " + JSON.stringify(userJson))
  }

  return (
    <div className="w-64 flex flex-col gap-2">
      <div>Login:</div>
      <input type="text" className="text-my-dark" onChange={updateFormUser("nick")} />

      <div>First name:</div>
      <input type="text" className="text-my-dark" onChange={updateFormUser("first_name")} />

      <div>Last name:</div>
      <input type="text" className="text-my-dark" onChange={updateFormUser("last_name")} />

      <div>
        <span>Country:</span>
        <input type="text" className="text-my-dark" onChange={updateFormUser("country")} />
      </div>

      <div>Profile picture:</div>
      <input type="file" className="text-my-dark" onChange={updateFormUser("profile_picture")} />

      <div>E-mail:</div>
      <input type="text" className="text-my-dark" onChange={updateFormUser("mail")} />
      
      <Button type="normal" onClick={() => registerFunc()}>Register</Button>
    </div>
  )
}

export default RegisterBox
