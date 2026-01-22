import React from 'react';
import { useTheme } from '../../Context/TheamContext';


const Gallerymemories = () => {
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
        
      Coming Soon Memories Gallery  🚀
    </div>
  );
};

 export default Gallerymemories

