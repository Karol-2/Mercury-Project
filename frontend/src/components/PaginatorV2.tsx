import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import User from "../models/User";
import dataService from "../services/data";

interface PaginatorProps {
  endpoint: string;
  itemsPerPage: number;
  renderItem: (user: User) => React.ReactNode;
}

function PaginatorV2(props: PaginatorProps) {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2137);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(()=>{
    const handleRequest = async () =>{
        const url = props.endpoint + `&page=${currentPageNum}&maxUsers=${props.itemsPerPage}`
        const response = await dataService.fetchData(url, "GET");
        console.log(response);
        // setUsers(response.users)
        // setTotalPages(response.totalPages)
        
    }

    handleRequest()
   
  },[currentPageNum])


  const nextPage = () => {
    if (currentPageNum + 1 <= totalPages) {
      setCurrentPageNum(currentPageNum + 1);
    }
  };

  const previousPage = () => {
    if (currentPageNum - 1 > 0) {
      setCurrentPageNum(currentPageNum - 1);
    }
  };

  return (
    <div id="paginator">
      <ul>
        {users.map((user) => (
          <li key={user.id}>{props.renderItem(user)}</li>
        ))}
      </ul>

      <div
        id="pagin-buttons"
        className=" bg-my-orange rounded-md flex flex-row justify-evenly text-lg p-2 align-middle"
      >
        <button
          onClick={previousPage}
          className=" rounded-lg bg-my-dark text-my-light p-2 transition duration-250 ease-in-out hover:bg-my-darker active:translate-y-1"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className=" flex flex-col justify-center">
          <p>
            Page {currentPageNum} of {totalPages}
          </p>
        </div>

        <button
          onClick={nextPage}
          className=" rounded-lg bg-my-dark text-my-light p-2 transition duration-250 ease-in-out hover:bg-my-darker active:translate-y-1"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}

export default PaginatorV2;
