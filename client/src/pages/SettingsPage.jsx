import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Surface } from "@heroui/react";
import { useAuth } from "../../context/authContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SettingsPage() {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  // Sync state with user context on mount or update
  useEffect(() => {
    if (user) {
      setFullName(user.username || "");
      setEmail(user.email || "");
      if (user.image) {
        setImagePreview(`${backendUrl}${user.image}`);
      }
    }
  }, [user]);

  // Handle local image selection and preview generation
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Trigger hidden native file picker when camera icon is clicked
  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", fullName);
      formData.append("email", email);
      
      if (password.trim()) {
        formData.append("password", password);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        `${backendUrl}/api/accounts/nurses/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        const updatedUser = response.data.nurse;
        login(updatedUser);
        
        const role = localStorage.getItem("role") || "nurse";
        const absoluteImageUrl = updatedUser.image ? `${backendUrl}${updatedUser.image}` : "";
        
        // Update local storage parameters
        localStorage.setItem(`${role}Username`, updatedUser.username);
        localStorage.setItem(`${role}Email`, updatedUser.email || "");
        localStorage.setItem(`${role}Image`, absoluteImageUrl);
        localStorage.setItem("image", absoluteImageUrl);
        localStorage.setItem("username", updatedUser.username);
        localStorage.setItem("email", updatedUser.email || "");
        
        setMessage({ type: "success", text: "Profile updated successfully." });
        setPassword("");
        setImageFile(null);
        setImagePreview(absoluteImageUrl);
      } else {
        setMessage({ type: "error", text: response.data.message || "Unable to update profile." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error saving profile."
      });
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] py-12 px-4 flex flex-col items-center font-sans">
      
      {/* --- PROFILE AVATAR SECTION --- */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-md bg-white flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-3xl uppercase">
                {fullName.charAt(0) || "Y"}
              </div>
            )}
          </div>
          
          {/* Camera overlay button matching Google design */}
          <button
            type="button"
            onClick={triggerFilePicker}
            className="absolute bottom-0 right-0 bg-white hover:bg-gray-50 border border-gray-200 p-2 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Update profile photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </button>

          {/* Hidden native input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <h1 className="mt-4 text-2xl font-normal text-gray-900">{fullName || "User Name"}</h1>
        <p className="text-sm text-gray-500 mt-1">{email || "user@email.com"}</p>
      </div>

      {/* --- MAIN FORM CARD --- */}
      <Surface className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Full Name Input Field */}
          <div className="relative border border-gray-300 rounded-xl px-3 py-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full mt-0.5 bg-transparent border-0 p-0 text-gray-900 text-base focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Email Address Input Field */}
          <div className="relative border border-gray-300 rounded-xl px-3 py-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            <label className="block text-xs font-medium text-gray-500">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-0.5 bg-transparent border-0 p-0 text-gray-900 text-base focus:ring-0 focus:outline-none"
            />
          </div>

          {/* New Password Input Field */}
          <div className="relative border border-gray-300 rounded-xl px-3 py-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
            <label className="block text-xs font-medium text-gray-500">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-0.5 bg-transparent border-0 p-0 text-gray-900 placeholder-gray-400 text-base focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Action Status Messages */}
          {message.text && (
            <div className={`text-sm p-3.5 rounded-xl border ${
              message.type === "success" 
                ? "bg-green-50 text-green-800 border-green-200" 
                : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Action Button Strip */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-70"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>

        </form>
      </Surface>

      {/* Optional decorative bottom card link */}
      <div className="mt-6 text-xs text-gray-400 text-center max-w-sm">
        Your information is handled safely according to your organizational privacy standards.
      </div>

    </div>
  );
}