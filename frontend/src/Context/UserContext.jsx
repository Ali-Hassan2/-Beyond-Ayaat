import { children, createContext, useContext, useEffect, useState } from 'react';

export const UserContext =createContext();

export const UserProvider = ({ children }) => {

const [name,setName]=useState('');
useEffect(()=>{
const token=localStorage.getItem("token");
const user= JSON.parse(localStorage.getItem("user"))
  if(token){
    setName(user.first_name);
  }

}),[];

return (

<UserContext.Provider value={name} >
  {children}
</UserContext.Provider>
);
};