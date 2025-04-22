import React from "react";

function PageHeader({ content }) {
  return (
    <div
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)" }}
      className="border border-base-300 p-3 bg-white mb-5"
    >
      <p className="font-bold text-xl">{content}</p>
    </div>
  );
}

export default PageHeader;
