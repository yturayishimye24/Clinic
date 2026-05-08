import delay from "../utils/Delay.jsx";

import {Avatar, Button, Popover} from "@heroui/react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function PopoverInteractive() { 
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleSignout = async () => {
    setIsFollowing(true);
    await logOut();
    await delay(300);
    navigate("/");
  }
  return (
    <div className="flex items-center gap-6">
      <Popover>
        <Popover.Trigger aria-label="User profile">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
                alt="Sarah Johnson"
                src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
              />
              <Avatar.Fallback>SJ</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">Sarah Johnson</p>
              <p className="text-xs text-gray-500">@sarahj</p>
            </div>
          </div>
        </Popover.Trigger>
        <Popover.Content className="w-[320px]">
          <Popover.Dialog>
            <Popover.Heading>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="md">
                    <Avatar.Image
                      alt="Sarah Johnson"
                      src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
                    />
                    <Avatar.Fallback>SJ</Avatar.Fallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-[#787072]">@sarahj</p>
                  </div>
                </div>
                <Button
                  onPress={handleSignout}
                  className="rounded-full bg-[#F8F4F5] text-[#1A178]"
                  size="sm"
                  variant={isFollowing ? "tertiary" : "primary"}
                >
                  {isFollowing ? "Signing out.." : "Signout"}
                </Button>
              </div>
            </Popover.Heading>
            <p className="mt-3 text-sm  text-[#787072]">
              Product designer and creative director. Building beautiful experiences that matter.
            </p>
           
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}