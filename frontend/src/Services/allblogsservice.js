import axious from "axios";

export const getallBlogs=async()=>{
    const res=await axious.get("http://localhost:3004/blogs/getrandomblogs")
    console.log(res.data);
    return res.data;
}