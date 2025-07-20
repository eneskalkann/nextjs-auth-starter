import React from "react";

type SpinnerProps = {
  overlay?: boolean;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ overlay = false, className }) => {
  if (overlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
        <div className={"loader " + (className ?? "")}></div>
      </div>
    );
  }
  return <div className={"loader " + (className ?? "")}></div>;
};

export default Spinner;
