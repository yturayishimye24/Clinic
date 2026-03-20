
import { Button } from "@/components/ui/button"
import {LogOut,Users,Settings} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useAuth} from "../../context/authContext.jsx"

export default function DropdownMenuDemo() {
    const {LogOut} = useAuth();
    const handleLogout= () => {
        LogOut();
    }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-10 h-10 rounded-full">
            <img src="/public/images/user.png" alt="User default avatar" className="w-10 h-10 rounded-full object-cover"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut><img src="/public/images/user.png" alt ="profile icon image" className="w-10 h-10"/></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Patients
            <DropdownMenuShortcut><Users/></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut><Settings/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut><LogOut/></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
