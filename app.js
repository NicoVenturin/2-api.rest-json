const express = require('express');
const fs = require('fs'); //file system, permite trabajar con archivos, no se instala, viene con node
const app = express();
const port = 4000;

//middleware
app.use(express.json());
const leerDatos = () => {
    try{
        const datos = fs.readFileSync('./data/datos.json');
        return JSON.parse(datos);//convierte json a objeto de js
        //console.log(JSON.parse(datos));
    }
    catch(error){
        console.log(error);
    }
}

const escribirDatos = (datos) => {
    try{
        fs.writeFileSync('./data/datos.json', JSON.stringify(datos));//convierte objetos a json
    }
    catch(error){
        console.log(error);
    }
}

app.get('/productos',(req,res)=>{
    res.send('listado de productos');
});

app.post('/productos',(req,res)=>{
    res.send('agregar producto');
});

app.get('/productos/:id',(req,res)=>{
    res.send('producto');
});

app.put('/productos/:id',(req,res)=>{
    res.send('actualizar producto');
});

app.delete('/productos/:id',(req,res)=>{
    res.send('borrar producto');
});
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});