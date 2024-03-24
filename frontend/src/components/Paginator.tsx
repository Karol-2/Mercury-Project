import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import User from "../models/User";

interface PaginatorProps {
  users: User[];
  itemsPerPage: number;
  renderItem: (user: User) => React.ReactNode;
}

function Paginator(props: PaginatorProps) {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const indexOfLastItem: number = currentPageNum * props.itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - props.itemsPerPage;

  const totalPages: number = Math.ceil(props.users.length / props.itemsPerPage);
  const currentItems: User[] = props.users.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

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
        {currentItems.map((user) => (
          <div key={user.id}>{props.renderItem(user)}</div>
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

export default Paginator;
