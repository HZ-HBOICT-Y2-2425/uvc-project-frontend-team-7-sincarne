import type { PageLoad } from "./$types";
import  axios  from "axios";


export async function load({params})  {
	const url = 'user/getRecipes'
	axios.get(url).then((res)=>console.log(res));



}