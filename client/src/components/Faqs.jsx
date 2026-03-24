import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { forwardRef } from "react";

const FAQ = forwardRef((props, ref) => {
  return (
    <Accordion
      collapseAll
      ref={ref}
      id="faq-section"
      className="
        w-full
        max-w-sm
        sm:max-w-md
        md:max-w-lg
        lg:max-w-xl
        mx-auto
      "
    >
    
      <AccordionPanel>
        <AccordionTitle>
          Where is clinic located?
        </AccordionTitle>
        <AccordionContent className="max-h-48 overflow-y-auto">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            You can find the clinic building after passing Urugwiro.
            You will see several maps showing the directions and services
            provided there. It will be easy to locate.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out this guide to learn how to&nbsp;
            <a
              href="https://flowbite.com/docs/getting-started/introduction/"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              get started
            </a>
            &nbsp;and start developing websites even faster.
          </p>
        </AccordionContent>
      </AccordionPanel>

      {/* Panel 2 */}
      <AccordionPanel>
        <AccordionTitle>
          What is the purpose of this website?
        </AccordionTitle>
        <AccordionContent className="max-h-48 overflow-y-auto">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            This website is designed to help you manage your patients and their information.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Check out the{" "}
            <a
              href="https://flowbite.com/figma/"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              www.clinicworkspace.com
            </a>
            .
          </p>
        </AccordionContent>
      </AccordionPanel>

      {/* Panel 3 */}
      <AccordionPanel>
        <AccordionTitle>
         How can I contact the administrator?
        </AccordionTitle>
        <AccordionContent className="max-h-56 overflow-y-auto">
          <p className="mb-2 text-gray-500 dark:text-gray-400">
           The administrator can be contacted via the contact button in the header.
          </p>
          <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="https://flowbite.com/pro/"
                className="text-cyan-600 hover:underline dark:text-cyan-500"
              >
                +250 788 932 710
              </a>
            </li>
            <li>
              <a
                href="https://tailwindui.com/"
                className="text-cyan-600 hover:underline dark:text-cyan-500"
              >
               contact@clinicworkspace.com
              </a>
            </li>
          </ul>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  );
});

export default FAQ;
