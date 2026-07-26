import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ThemeToggle(){

const {dark,setDark}=useContext(ThemeContext);

return(

<button

className="border px-4 py-2 rounded"

onClick={()=>setDark(!dark)}

>

{dark?"☀️":"🌙"}

</button>

)

}

export default ThemeToggle;