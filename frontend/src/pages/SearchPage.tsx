import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import dataService from "../services/data";
import { useState } from "react";
import FoundUser from "../components/FoundUser";

function SearchPage() {
  const [searchState, setSearchState] = useState("");
  const [usersFound, setUsersFound] = useState([]);

  const handleSearch = async(e: { preventDefault: () => void; }) => {
    if(searchState.trim() === ""){
      return
    }
    e.preventDefault();
    const response = await dataService.fetchData(`/users/search?q=${searchState}`,"GET")
    setUsersFound(response.users)
    
  }
  return (
    <>
      <Navbar />
      <section className=" min-h-screen mx-50 lg:mx-72 ">
        <div>
          <form className="flex flex-row max-w-3xl w-full mt-5" onSubmit={handleSearch} >
            <input type="text" placeholder="Enter your friend's name..." className="form-input text-my-darker" 
            onChange={e => setSearchState(e.target.value)}></input>
            <button type="submit" className="btn small bg-my-purple ml-5">Search</button>
          </form>
        </div>
        <div>
          {
            usersFound && usersFound.length > 0
             && usersFound.map((user, index) => ( <FoundUser user={user[0]} key={String(index)} />))
          }
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SearchPage;
