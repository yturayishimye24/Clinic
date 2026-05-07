import React from "react";

const Accordion = ({ title, answer, isOpen, onClick }) => {

  return (
    <div className={`border-b ${isOpen ?"border-[#1967D2]":"border-gray-300"} py-6`}>

      <button
        onClick={onClick}
        className="flex justify-between items-center w-full group py-2"
      >

        <span className="font-google text-2xl md:text-3xl text-left font-medium tracking-tight text-[#1967D2] transition-colors group-hover:text-blue-800">
          {title}
        </span>

        <svg
          className={`transform transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4V20M4 12H20"
            stroke="#1967D2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">

          <p className="font-google text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl">
            {answer}
          </p>

        </div>
      </div>

    </div>
  );
};

export default Accordion;