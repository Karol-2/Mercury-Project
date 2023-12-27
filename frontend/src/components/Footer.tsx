import {
  faFacebook,
  faGithub,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  const scrollToTop = (_e: React.MouseEvent<HTMLButtonElement>) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialStyle =
    "flex flex-row gap-1 h-8 font-medium text-my-darker clickable";

  return (
    <footer className="bg-my-orange mt-5 text-my-light p-10 flex flex-row">
      <section className="min-w-full">
        <div className="mx-50 lg:mx-72 flex flex-row justify-around">
          <figure className="flex flex-col content-evenly gap-2">
            <div className={socialStyle}>
              <FontAwesomeIcon icon={faYoutube} className="w-8 text-3xl" />
              <span className="self-center">Mercury App Channel</span>
            </div>
            <div className={socialStyle}>
              <FontAwesomeIcon icon={faFacebook} className="w-8 text-3xl" />
              <span className="self-center">MercuryApp</span>
            </div>
            <div className={socialStyle}>
              <FontAwesomeIcon icon={faTwitter} className="w-8 text-3xl" />
              <span className="self-center">@MercuryApp</span>
            </div>
            <a
              className={socialStyle}
              href="https://github.com/Karol-2/Mercury-Project"
            >
              <FontAwesomeIcon icon={faGithub} className="w-8 text-3xl" />
              <span className="self-center">Mercury Project</span>
            </a>
          </figure>

          <div className="flex flex-col">
            <button onClick={scrollToTop} className="text-my-darker clickable">
              <FontAwesomeIcon
                icon={faArrowCircleUp}
                className="text-7xl self-end"
              />
            </button>

            <p className="font-thin mt-20">
              &#169; 2023 Mercury. All Rights Reserved.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
