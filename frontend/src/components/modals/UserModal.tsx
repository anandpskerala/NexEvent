import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Check, User as UserIcon, Mail, Phone, AlertCircle, Shield } from "lucide-react";
import { availableRoles, type UserModalProps } from "../../interfaces/props/modalProps";


const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(user);
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleRoleToggle = (roleId: string) => {
    setFormData((prev) => {
      if (prev.roles.includes(roleId)) {
        return {
          ...prev,
          roles: prev.roles.filter(r => r !== roleId)
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, roleId]
        };
      }
    });
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${animateIn ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-md relative transition-all duration-300 transform ${animateIn ? "scale-100 translate-y-0" : "scale-95 -translate-y-4"
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            Edit User Profile
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-500" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed transition-colors"
                disabled
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Phone className="w-4 h-4 text-gray-500" />
                Phone Number
              </label>
              <input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Shield className="w-4 h-4 text-gray-500" />
                User Roles <span className="text-xs text-gray-500 ml-1">(Select multiple)</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {availableRoles.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleToggle(role.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer
                      ${formData.roles.includes(role.id)
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'}`}
                  >
                    {formData.roles.includes(role.id) && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    {role.label}
                  </button>
                ))}
              </div>

              {formData.roles.length === 0 && (
                <p className="text-xs text-red-500 mt-1">Please select at least one role</p>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <label className="text-sm font-medium text-gray-700">
                    Block User
                  </label>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    name="isBlocked"
                    id="isBlocked"
                    checked={formData.isBlocked}
                    onChange={handleChange}
                    className="opacity-0 absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="isBlocked"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${formData.isBlocked ? "bg-red-500" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full transform transition-transform duration-200 ease-in bg-white border-2 border-gray-300 shadow-md ${formData.isBlocked ? "translate-x-6" : "translate-x-0"
                        }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default UserModal;