import React from 'react';
import { useTheme } from '../../../Context/TheamContext';
import { FaHourglassStart } from 'react-icons/fa';

const FeedBack = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5",
        color: theme === "dark" ? "#ffffff" : "#000000",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
         {/* <FaHourglassStart size={50} color="orange" /> */}
      Coming Soon  🚀
    </div>
  );
};

 export default FeedBack
