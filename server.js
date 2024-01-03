import {app} from "./app.js"
import { connectDatabase } from "./Config/database.js";
connectDatabase().catch((err)=>console.log(err));
app.listen(process.env.PORT, ()=> console.log(process.env.PORT))