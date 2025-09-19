import axios from "axios";

export const getTopics = async () => {
    const res = await axios.get("http://localhost:3004/topics/gettopics")
    return res.data.data;

};