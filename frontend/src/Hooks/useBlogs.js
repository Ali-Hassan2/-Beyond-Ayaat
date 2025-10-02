import { useState, useEffect} from "react";
import { getallBlogs } from "../Services/allblogsservice";

export const useBlogs=()=>{
    const [blogs,setBlogs]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    useEffect(()=>{
        const fetchBlogs=async()=>{
            try{
                const data=await getallBlogs();
                setBlogs(data);
                console.log(data);
            }catch(err){
                setError(err);
            }
            setLoading(false);
        };
        fetchBlogs();
    },[]);
    return {blogs,loading,error};
}