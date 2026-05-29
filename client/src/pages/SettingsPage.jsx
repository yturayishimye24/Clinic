import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, AlertDialog } from "@heroui/react";
import { useAuth } from "../../context/authContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SettingsPage() {
  const { user, login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    
    if (user) {
      setFullName(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = { username: fullName, email };
      if (password.trim()) payload.password = password;

      const response = await axios.put(
        `${backendUrl}/api/accounts/nurses/${user._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const updatedUser = response.data.nurse;
        login(updatedUser);
        const role = localStorage.getItem("role") || "nurse";
        // update both role-scoped and global for compatibility
        localStorage.setItem(`${role}Username`, updatedUser.username);
        localStorage.setItem(`${role}Email`, updatedUser.email || "");
        localStorage.setItem("username", updatedUser.username);
        localStorage.setItem("email", updatedUser.email || "");
        setMessage("Profile updated successfully.");
        setPassword("");
      } else {
        setMessage(response.data.message || "Unable to update profile.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving profile.");
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };
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
              <AlertDialog.Dialog className="sm:max-w-125">

                <AlertDialog.Header>
                  <AlertDialog.Heading>
                    Update Profile
                  </AlertDialog.Heading>
                </AlertDialog.Header>

                <AlertDialog.Body>
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="text-green-700 border border-gray-200 p-3 focus:outline-none focus:border-gray-300 placeholder:text-gray-600"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-green-700 border border-gray-200 p-3 focus:outline-none focus:border-gray-300 placeholder:text-gray-600"
                    />
                    <input
                      type="password"
                      placeholder="New Password (leave blank to keep current)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-green-700 border border-gray-200 p-3 focus:outline-none focus:border-gray-300 placeholder:text-gray-600"
                    />
                    {message && (
                      <div className="text-sm text-left text-green-600">{message}</div>
                    )}
                    <div className="flex items-center justify-end gap-3">
                      <Button variant="tertiary" slot="close">Cancel</Button>
                      <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </AlertDialog.Body>

                <AlertDialog.Footer />

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