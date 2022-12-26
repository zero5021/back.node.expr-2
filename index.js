const express= require('express');
const app = express();
const fs = require("fs");
app.use(express.json());

app.listen(4000, ()=>{
    console.log("puerto 4000 operativo")
})

app.get('/',(req,res)=>{
    res.sendFile('./public/index.html',{
root: __dirname 
    });
})

 app.get("/canciones", (req, res) => {
    try {
      const canciones = JSON.parse(fs.readFileSync("repertory.json", "utf8"));
      res.json(canciones);
    } catch (error) {
      res.json({ message: "lo siento, la informacion no esta disponible" });
    }
  });
  
  app.post("/canciones", (req, res) => {
    try {
      const cancion = req.body;
  
      if (Object.values(cancion).some((value) => value === "")) {
        return res.status(404).json({ message: "datos incompletos" });
      }
  
      const canciones = JSON.parse(fs.readFileSync("repertory.json", "utf8"));
      fs.writeFileSync(
        "repertory.json",
        JSON.stringify([...canciones, cancion])
      );
      res.send("carga exitosa");
    } catch (error) {
      res.json({ message: "lo siento, la informacion no esta disponible" });
    }
  });
  
  app.put("/canciones/:id", (req, res) => {
    try {
      const { id } = req.params;
      const cancion = req.body;
  
      if (Object.values(cancion).some((value) => value === "")) {
        return res.status(404).json({ message: "datos incompletos" });
      }
  
      const canciones = JSON.parse(fs.readFileSync("repertory.json", "utf8"));
      const index = canciones.findIndex((cancion) => cancion.id === parseInt(id));

      if (index === -1) {
        return res
          .status(404)
          .json({ message: "cancion no existente" });
      }
      canciones[index] = cancion;
      fs.writeFileSync("repertory.json", JSON.stringify(canciones));
      res.send("cancion actualizada");
    } catch (error) {
      res.json({ message: "lo siento, la informacion no esta disponible" });
    }
  });

  app.delete("/canciones/:id", (req, res) => {
    try {
      const { id } = req.params;
  
      const canciones = JSON.parse(fs.readFileSync("repertory.json", "utf8"));
      const index = canciones.findIndex((cancion) => cancion.id === parseInt(id));
  
      console.log(index);
  
      if (index === -1) {
        return res.status(404).json({
          message: "no se puede eliminar, no existe",
        });
      }
      canciones.splice(index, 1);
    fs.writeFileSync("repertory.json", JSON.stringify(canciones));
    res.send("eliminacion exitosa");
  } catch (error) {
    res.json({ message: "lo siento, la informacion no esta disponible" });
  }
});
  
