import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import User from "../models/User";
import dataService from "../services/data";

interface PaginatorProps {
  endpoint: string;
  itemsPerPage: number;
  renderItem: (user: User) => React.ReactNode;
}

function PaginatorV2(props: PaginatorProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2137);
  const [error, setError] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleRequest = async () => {
      const url =
        props.endpoint + `?page=${currentPage}&maxUsers=${props.itemsPerPage}`;
      await dataService
        .fetchData(url, "GET")
        .then((response) => {
          console.log(response);
          setUsers(response.friends);
        })
        .catch((err) => {
          console.error(err);
          // TODO: logika do błędu
        });

      // TODO: ZMIEŃ W SEARCH ABY NIE ZWRACAŁO NUMERU,
      //TODO: ORAZ ŻEBY ZAWSZE ZWRACAŁO USERS A NIE FRIENDS lub cokolwiek innego
      //TODO: dodać totalPages żeby można było: setTotalPages(response.totalPages)
    };

    handleRequest();
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div id="paginator">
      {error && <div> error </div>}
      <ul>
        {!error &&
          users &&
          users.map((user) => (
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
            Page {currentPage} of {totalPages}
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
