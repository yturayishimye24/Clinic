import React from "react";
import BlueCench from "../../public/images/BlueCench.png";
import RedCench from "../../public/images/RedCench.jpeg";
import patients from "../../public/images/patients.png";
import drake from "../../public/images/drake.png";
import aos from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react";

import { forwardRef } from "react";
import { Card, Dropdown, DropdownItem } from "flowbite-react";
import { differenceInCalendarISOWeekYears } from "date-fns";

const TeamSection = forwardRef((props, ref) => {
  useEffect(() =>{
    aos.init();
  })
  return (

    <section className="max-w-6xl mx-auto px-4 py-16" ref={ref}>
      <h2 className="text-3xl font-bold mb-12 text-center mb-30 text-gray-400">
        Meet Our Team
      </h2>
      <div
        className="
  flex
  sm:flex-col
  sm:w-full
  md:w-full
  md:flex-col
  lg:flex-row
  items-center
  justify-center
  gap-3
  sm:gap-4
  pt-6
  sm:pt-10
"
      >
        <Card className="sm:w-full md:w-full lg:w-1/3" data-aos="zoom-in-left" duration="2000">
          <div className="flex justify-end px-4 pt-4">
            <Dropdown inline label="">
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Edit
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Export Data
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Delete
                </a>
              </DropdownItem>
            </Dropdown>
          </div>
          <div className="flex flex-col items-center pb-10">
            <img
              src={drake}
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
            ></img>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Kazeneza
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visual Designer
            </span>
            <div className="mt-4 flex space-x-3 lg:mt-6">
              <a
                href="#"
                className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                Add friend
              </a>
              <a
                href="#"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Message
              </a>
            </div>
          </div>
        </Card>
        <Card className="sm:w-full md:w-full lg:w-1/3" data-aos="fade-up" duration="3000">
          <div className="flex justify-end px-4 pt-4">
            <Dropdown inline label="">
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Edit
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Export Data
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Delete
                </a>
              </DropdownItem>
            </Dropdown>
          </div>
          <div className="flex flex-col items-center pb-10">
            <img
              src={RedCench}
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
            ></img>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Bonnie Green
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visual Designer
            </span>
            <div className="mt-4 flex space-x-3 lg:mt-6">
              <a
                href="#"
                className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                Add friend
              </a>
              <a
                href="#"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Message
              </a>
            </div>
          </div>
        </Card>
        <Card className="sm:w-full md:w-full lg:w-1/3" data-aos="fade-down" duration="4000">
          <div className="flex justify-end px-4 pt-4">
            <Dropdown inline label="">
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Edit
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Export Data
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Delete
                </a>
              </DropdownItem>
            </Dropdown>
          </div>
          <div className="flex flex-col items-center pb-10">
            <img
              src={BlueCench}
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
            ></img>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Bonnie Green
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visual Designer
            </span>
            <div className="mt-4 flex space-x-3 lg:mt-6">
              <a
                href="#"
                className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              >
                Add friend
              </a>
              <a
                href="#"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Message
              </a>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
});

export default TeamSection;
