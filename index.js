//importamos los modulos
const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const { writeFile } = require('fs');

const PORT= 7050;
const writeArchivo = async(path, arr) =>{
    await fs.writeFile(path, JSON.stringify(arr))
}

const app= http.createServer(async (req, res) =>{
  
    const requestMethod = req.method;
    const requestURL = req.url;
    //leer la ruta y la petición 
        const jsonPath = path.resolve('./data.json');
        const jsonf = await fs.readFile(jsonPath, 'utf8');
        const arr = JSON.parse(jsonf);
        if (requestURL === "/apiv1/tasks/" && requestMethod === "GET"){
            res.writeHead(200, {"Content-Type": "aplication/json"}); //el 200 es que todo salio ok
            //res.write(JSON.stringify(arr));
            res.end(JSON.stringify(arr));       
         }
     if (requestURL === "/apiv1/tasks/"  && requestMethod === "POST"){
        
            req.on("data", async (data) => {              
                arry = arr.sort((a,b) =>
                a.id - b.id);
                console.log(arry);
                const id= arry[arr.length-1].id;
                const newTaks = JSON.parse(data);
                newTaks.id = id + 1;
                arr.push(newTaks);
                console.log(arr);   
                await writeArchivo(jsonPath, arr)
            });
            res.setHeader("Content-Type", "aplication/json");
            res.writeHead(201);
        }
    if(requestURL.includes("/apiv1/task/") && (requestMethod === "PUT")) {
           const splitURL = requestURL.split("/");
           const id = Number(splitURL[splitURL.length-1]);
           req.on('data', async (data) =>{
            data = JSON.parse(data);
            const newArr = arr.map((task)=>{
            if (task.id === id){
                task.status = data.status;
            }
            return task;
           });
           await writeArchivo(jsonPath, newArr)
           console.log(newArr);
        });        
    }

    if(requestURL.includes("/apiv1/task/") && (requestMethod === "DELETE")) {
                const splitURL = requestURL.split("/");
                const id = Number(splitURL[splitURL.length-1]);
                const deleteObj = arr.filter(obj => obj.id !== id);
                await writeArchivo(jsonPath, deleteObj)
                console.log(deleteObj);
    }
    
    if(requestURL !== "/apiv1/tasks" && !requestURL.includes("/apiv1/task/") ){
       res.writeHead(503);     
    }
    res.end();
});

app.listen(PORT);
console.log("RUNNNNN")
