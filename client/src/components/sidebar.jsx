import { ChevronFirst, MoreVertical, ChevronLast } from "lucide-react";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  EllipsisVertical,
  Pencil,
  SquarePlus,
  TrashBin,
} from "@gravity-ui/icons";
import {
  Description,
  Dropdown,
  Header,
  Kbd,
  Label,
  Separator,
} from "@heroui/react";
import PopoverInteractive from "../components/popoverSignOut.jsx";


const SidebarContext = createContext();
export default function Sidebar({ children, expanded, setExpanded }) {
  const navigate = useNavigate();
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("notworking@gmail.com");
  const fetchEmail = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendurl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setEmail(response.data.email);
      }
    } catch (error) {
      console.log("Error fetching nurse's email", error.message);
    }
  };
  useEffect(() => {
    fetchEmail();
  }, []);
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }
  return (
    <aside
      className={`fixed top-0 left-0 h-screen transition-all duration-300 ${expanded ? "w-64" : "w-20"} bg-white border-r`}
    >
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <svg
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.0964 20.3536L17.6262 22.4473L17.046 27.6527L8.94876 36.8282C4.2486 33.8023 0.898178 28.8615 0 23.108L13.0964 20.3536Z"
              fill="#15E3FF"
            ></path>
            <path
              d="M25.183 25.94L31.2414 36.3789C27.992 38.6605 24.0331 40 19.7612 40C18.3744 40 17.0206 39.8587 15.7133 39.59L17.046 27.6527L20.4765 23.7656L25.183 25.94Z"
              fill="#348DFC"
            ></path>
            <path
              d="M39.1022 14.881C39.5332 16.5143 39.763 18.2294 39.763 19.9982C39.763 24.1145 38.5192 27.9403 36.3874 31.1207L25.184 25.9405L22.5551 21.4123L25.8574 17.6692L39.1022 14.881Z"
              fill="#FD4873"
            ></path>
            <path
              d="M17.046 27.6524L17.0458 27.6527L17.1686 26.552L17.046 27.6524Z"
              fill="#FFC700"
            ></path>
            <path
              d="M20.132 0C26.1505 0.109415 31.5194 2.877 35.1148 7.17842L25.8561 17.6694L20.9792 18.6959L18.519 14.4574L20.132 0Z"
              fill="#FFC700"
            ></path>
            <path
              d="M18.519 14.4574L17.9745 19.3269L13.0991 20.353L0.514709 14.5347C2.09964 8.94044 6.05794 4.3436 11.2327 1.9007L18.519 14.4574Z"
              fill="#00E7B9"
            ></path>
          </svg>
          <button
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            onClick={() => setExpanded((curr) => !curr)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <PopoverInteractive/>

          {/* <div
            className={`flex justify-between items-center ${expanded ? "w-52 ml-3" : "w-0"}`}
          >
            <div className="leading-4">
              <h4 className={`font-semibold ${expanded ? "" : "hidden"}`}>
                {localStorage.getItem("username")}
              </h4>
              <span
                className={`text-xs text-gray-60 ${expanded ? "" : "hidden"}`}
              >
                {email}
              </span>
            </div>
            <Dropdown>
              <Dropdown.Trigger
                aria-label="Menu"
                className="button button-md button--secondary button--icon-only data-[focus-visible=true]:status-focused"
              >
                <EllipsisVertical className={`outline-none ${expanded ? "w-4 h-4" : "w-0 h-0"}`} />
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => console.log(`Selected: ${key}`)}
                >
                  <Dropdown.Section>
                    <Header>Actions</Header>
                    <Dropdown.Item id="new-file" textValue="New file">
                      <div className="flex h-8 items-start justify-center pt-px">
                        <SquarePlus className="size-4 shrink-0 text-muted" />
                      </div>
                      <div className="flex flex-col">
                        <Label>New file</Label>
                        <Description>Create a new file</Description>
                      </div>
                      <Kbd className="ms-auto" slot="keyboard" variant="light">
                        <Kbd.Abbr keyValue="command" />
                        <Kbd.Content>N</Kbd.Content>
                      </Kbd>
                    </Dropdown.Item>
                    <Dropdown.Item id="edit-file" textValue="Edit file">
                      <div className="flex h-8 items-start justify-center pt-px">
                        <Pencil className="size-4 shrink-0 text-muted" />
                      </div>
                      <div className="flex flex-col">
                        <Label>Edit file</Label>
                        <Description>Make changes</Description>
                      </div>
                      <Kbd className="ms-auto" slot="keyboard" variant="light">
                        <Kbd.Abbr keyValue="command" />
                        <Kbd.Content>E</Kbd.Content>
                      </Kbd>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Separator />
                  <Dropdown.Section>
                    <Header>Danger zone</Header>
                    <Dropdown.Item
                      id="delete-file"
                      textValue="Delete file"
                      variant="danger"
                    >
                      <div className="flex h-8 items-start justify-center pt-px">
                        <TrashBin className="size-4 shrink-0 text-danger" />
                      </div>
                      <div className="flex flex-col">
                        <Label>Delete file</Label>
                        <Description>Move to trash</Description>
                      </div>
                      <Kbd className="ms-auto" slot="keyboard" variant="light">
                        <Kbd.Abbr keyValue="command" />
                        <Kbd.Abbr keyValue="shift" />
                        <Kbd.Content>D</Kbd.Content>
                      </Kbd>
                    </Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div> */}
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onClick }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
        `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-30 rounded-md bg-indigo-400 ${expanded ? "" : "top-2"}`}
        />
      )}
      {!expanded && (
        <div
          className={`
        absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-[99]`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
