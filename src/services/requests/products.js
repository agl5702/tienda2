import {fetchData} from "@/services/api.js"

export const getAllProducts = async ()=>{
  return fetchData("GET","/products/")
}