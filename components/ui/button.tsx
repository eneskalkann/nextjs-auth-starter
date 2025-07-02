import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
};

const Button: React.FC<ButtonProps> = ({ variant = "primary", children, className = "", ...props }) => {
  const styles = "px-4 py-2 rounded-md font-medium transition-all";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    tertiary: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={`${styles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;