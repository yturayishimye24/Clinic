import React from "react";
import { Button, AlertDialog } from "@heroui/react";

export default function SettingsPage() {
  return (
    <div>

  
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="bg-gray-200 p-6 rounded-full flex items-center justify-center mb-8">
          <i className="fa-solid fa-gear text-5xl text-gray-700"></i>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-sm mx-auto">

        
        <AlertDialog>
          <Button fullWidth>
            Edit Profile
          </Button>

          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-[500px]">

                <AlertDialog.Header>
                  <AlertDialog.Heading>
                    Update Profile
                  </AlertDialog.Heading>
                </AlertDialog.Header>

                <AlertDialog.Body>
                  <form className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className=" text-black p-3 focused:ring-3 focus:ring-violet-600 focus:outline-none placeholder:text-black/50"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className=" text-black p-3 focused:ring-3 focus:ring-violet-600 focus:outline-none placeholder:text-black/50"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className=" text-black p-3 focused:ring-3 focus:ring-violet-600 focus:outline-none placeholder:text-black/50"
                    />
                  </form>
                </AlertDialog.Body>

                <AlertDialog.Footer>
                  <Button variant="tertiary" slot="close">
                    Cancel
                  </Button>
                  <Button variant="primary">
                    Save Changes
                  </Button>
                </AlertDialog.Footer>

              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>


        
        <AlertDialog>
          <Button fullWidth variant="outline">
            Configure Theme
          </Button>

          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog>

                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>
                    <p className="text-black/50">Feature under development</p>
                  </AlertDialog.Heading>
                </AlertDialog.Header>

                <AlertDialog.Body>
                  <p className="text-black/50">This feature is not ready yet.</p>
                </AlertDialog.Body>

                <AlertDialog.Footer>
                  <Button slot="close">Close</Button>
                </AlertDialog.Footer>

              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>

      </div>
    </div>
  );
}