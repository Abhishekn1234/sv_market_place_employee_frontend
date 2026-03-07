 export  const formatDateTime = (dateString?: string | Date) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getDate(); 
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase(); // JAN, FEB
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; 

  return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
};