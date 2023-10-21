import { Link } from "react-router-dom"
import Button from "../components/Button"


function HomePage() {
  return (
    <div>
      <Link to={"/login"}> <Button type="highlight"> Login </Button> </Link>
    </div>
  )
}

export default HomePage
