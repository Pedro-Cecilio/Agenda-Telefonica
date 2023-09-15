import {app} from './app.js'


app.listen({
    port: 3000
}).then(()=>{
    console.log("HTTP Server Running!")
})