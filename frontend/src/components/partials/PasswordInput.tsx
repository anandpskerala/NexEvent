import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import type { PasswordProps } from '../../interfaces/props/passwordProps';


export const PasswordInput: React.FC<PasswordProps> = ({
  name,
  label = 'Password',
  errors,
  handleForm,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`mt-4 relative ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          id={name}
          aria-invalid={!!errors[name]}
          className={`w-full mt-1 p-2 border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="********"
          onChange={handleForm}
        />
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
        </button>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 text-center">{errors[name]}</p>
      )}
    </div>
  );
};