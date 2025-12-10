// packages/ui-kit/index.js (The entry point for the UI Kit library)

import React from "react";

/**
 * The primary button for the Zarish platform.
 * This is a standard "Lego Block" available in the Studio builder.
 */
export const PrimaryButton = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#1E90FF", // Dodger Blue (Zarish primary color)
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "5px",
      }}
    >
      {label}
    </button>
  );
};

// TODO: Add more shared components like DataCard, Modal, and InputField.
// The automated TODO list will capture this task!

export default {
  PrimaryButton,
};
