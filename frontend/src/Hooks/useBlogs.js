import { getallBlogs } from "../Services/allblogsservice";
import { useState, useEffect } from "react";

export const useBlogs = () => {
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
    useEffect(() => {
      getallBlogs()
        .then((data) => {
            setBlogs(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(true);
            setLoading(false);
        });
    }, []);

  return { blogs, loading, error };
}