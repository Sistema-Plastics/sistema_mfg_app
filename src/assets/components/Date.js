import { useState, useEffect } from "react";

export default function CurrentDate() {
  const curDateConfig = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const [dateTime, setDateTime] = useState(
    new Date().toLocaleString("en-NZ", curDateConfig)
  );

  useEffect(() => {
    const id = setInterval(
      () => setDateTime(new Date().toLocaleString("en-NZ", curDateConfig)),
      1000
    );
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line
  }, []);

  return dateTime;
}
