import { useState } from "react";

function useSendRequest(initialData) {
  const [loding, setLoding] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(initialData);

  const init = async ({ url, body, headers, method }) => {
    if (method === "GET") {
      let response = null;
      if (headers) {
        response = await fetch(url, { headers })
      } else {
        response = await fetch(url);
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.errorMessage);
      return data;

    } else if (method === "POST") {
      const response = await fetch(url, { body, headers, method });
      const data = await response.json();
      if (!response.ok) throw new Error(data.errorMessage);
      return data;
    }
  };

  const sendReq = ({ url, body, headers, method, doAuth }) => {
    setLoding(true);
    setError(false);
    setData(initialData)
    init({ url, body, headers, method })
      .then((data) => {
        setData(data);
        setLoding(false);
      })
      .catch((err) => {
        setError(true);
        setLoding(false);
        if (doAuth) {
          doAuth(err.message)
        }
      });
  };

  return [data, loding, error, sendReq, setData, init];
}

export default useSendRequest;
