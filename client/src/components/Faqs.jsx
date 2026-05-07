import React from "react";
import Accordion from "./Accordion";
import {useState} from "react"



const FAQ = () => {
  const [openIndex,setOpenIndex] = useState(null)
  return (
 
    <div className="w-full  py-20 px-6">
      <div className="max-w-5xl mx-auto">
        
       

        <div className={`border-t ${openIndex !==null ? "border-gray-200":"border-blue-600"}`}> 
          <Accordion
            title="How does the system ensure HIPAA and GDPR data compliance?"
            answer="Security is the foundation of our architecture. Every patient record is protected by end-to-end AES-256 encryption, ensuring that sensitive medical history remains confidential and tamper-proof. We maintain strict adherence to HIPAA and GDPR standards, providing automated audit logs, role-based access controls, and secure cloud backups."
            isOpen={openIndex===0}
            onClick={()=> setOpenIndex(openIndex===0?null:0)}
          />
          <Accordion
            isOpen={openIndex===2}
            onClick={()=> setOpenIndex(openIndex===2?null:2)}
            title="Can the platform integrate with our existing laboratory and pharmacy systems?"
            answer="Our system is built on an open-API framework designed for seamless interoperability. We support HL7 and FHIR standards, allowing for real-time synchronization with third-party diagnostic laboratories and electronic prescription services."
          />
          <Accordion 
            isOpen={openIndex===1}
            onClick={()=> setOpenIndex(openIndex===1?null:1)}
            title="How does the automated scheduling engine reduce patient no-shows?" 
            answer="The platform utilizes an intelligent notification engine that sends automated reminders via SMS, email, and WhatsApp. By allowing patients to confirm or reschedule appointments with a single click, we’ve seen our partner clinics reduce no-show rates by up to 40%." 
          />
        </div>
      </div>
    </div>
  );
};

export default FAQ;