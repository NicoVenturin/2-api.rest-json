const express = require('express');
const fs = require('fs'); //file system, permite trabajar con archivos, no se instala, viene con node
const app = express();
const port = 3000;

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

function reIndex(datos){
    let indice = 1;
    datos.productos.map((p)=>{ //map loopea todos los objetos
        p.id = indice;
        indice++;
    });
}
app.get('/productos',(req,res)=>{
    const datos = leerDatos(); // returnea todo el json
    res.json(datos.productos) 
    //res.send('listado de productos');
});

app.post('/productos',(req,res)=>{
    const datos = leerDatos();    
    const nuevoProducto={ id:datos.productos.length+1, //asigna id y copia el body insertado
        ...req.body
    }
    datos.productos.push(nuevoProducto); 
    escribirDatos(datos);
    res.json({mensaje:'nuevo producto agregado',
        producto:nuevoProducto //devuelve el nuevo objeto
    })
    //res.send('agregar producto');
});

app.get('/productos/:id',(req,res)=>{
    const datos = leerDatos();    
    const prodEncontrado = datos.productos.find(p=>p.id == req.params.id); //toma p de parametro y busca un objeto de igual id
    if(!prodEncontrado){
        return res.status(404).json({mensaje:'producto no encontrado'});
    }
    else{
        res.json({mensaje:'producto encontrado',
            producto:prodEncontrado //devuelve el objeto encontrado
        });
    }
    
    //res.send('producto');
});

app.put('/productos/:id',(req,res)=>{
    const id = req.params.id;
    const nuevosDatos = req.body;
    const datos = leerDatos();
    const prodEncontrado = datos.productos.find(p=>p.id == req.params.id);
    if(!prodEncontrado){
        return res.status(404).json({mensaje:'producto no encontrado'});
    }
    datos.productos = datos.productos.map(p=>p.id==req.params.id ? {...p,...nuevosDatos}:p); //actualiza el objeto con los datos insertados
    res.json({mensaje:"datos actualizados"});
});

app.delete('/productos/:id',(req,res)=>{
    //res.send(`borrando un producto`);
    const datos = leerDatos();
    const prodEncontrado = datos.productos.find((p)=>p.id == req.params.id);
    if(!prodEncontrado){
        return res.status(404),res.json("no se encuentra el producto");
    }
    //filter crea un reemplazo del array sin el borrado
    datos.productos = datos.productos.filter((p)=>p.id != req.params.id); //encuentra el producto con el mismo id, lo filtra del array y reescribe los id para evitar conflictos
    reIndex(datos);
    escribirDatos(datos);
    console.log(datos.productos);
    res.json("producto eliminado");
});
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});