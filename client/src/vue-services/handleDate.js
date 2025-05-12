const handleDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default handleDate;
