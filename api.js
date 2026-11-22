const express = require("express");
const fs = require("fs");
const pc = require("picocolors");
const app = express();
const port = 3000;
const productos = require("./DATOS_API/productos.json");
const categorias = require("./DATOS_API/categorias.json");

app.use(express.json());

app.use((req, res, next) => {
    res.on("finish", () => {
        const status = res.statusCode;
        const color = status < 400 ? pc.green(status) : pc.red(status);
        console.log(`[${pc.cyan(req.method)}] ${req.url} -> ${color}`);
    });
    next();
});

function siguienteID(lista) {
    if (lista.length === 0) return 1;
    return Math.max(...lista.map(e => e.id)) + 1;
}

// ===== PRODUCTOS =====

app.get("/api/productos", (req, res) => {
    res.json(productos);
});

app.get("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
});

app.post("/api/productos", (req, res) => {
    const nuevo = {
        id: siguienteID(productos),
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoriaId: req.body.categoriaId
    };
    productos.push(nuevo);
    fs.writeFileSync("./DATOS_API/productos.json", JSON.stringify(productos, null, 2));
    res.status(201).json(nuevo);
});

app.put("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    productos[index] = {
        id: id,
        nombre: req.body.nombre ?? productos[index].nombre,
        precio: req.body.precio ?? productos[index].precio,
        categoriaId: req.body.categoriaId ?? productos[index].categoriaId
    };
    fs.writeFileSync("./DATOS_API/productos.json", JSON.stringify(productos, null, 2));
    res.json(productos[index]);
});

app.delete("/api/productos/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    productos.splice(index, 1);
    fs.writeFileSync("./DATOS_API/productos.json", JSON.stringify(productos, null, 2));
    res.json({ mensaje: "Producto eliminado" });
});

// ===== CATEGORÍAS (mismo patrón) =====

app.get("/api/categorias", (req, res) => {
    res.json(categorias);
});

app.get("/api/categorias/:id", (req, res) => {
    const id = Number(req.params.id);
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) {
        return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(categoria);
});

app.post("/api/categorias", (req, res) => {
    const nueva = {
        id: siguienteID(categorias),
        nombre: req.body.nombre
    };
    categorias.push(nueva);
    fs.writeFileSync("./DATOS_API/categorias.json", JSON.stringify(categorias, null, 2));
    res.status(201).json(nueva);
});

app.put("/api/categorias/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = categorias.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Categoría no encontrada" });
    }
    categorias[index] = {
        id: id,
        nombre: req.body.nombre ?? categorias[index].nombre
    };
    fs.writeFileSync("./DATOS_API/categorias.json", JSON.stringify(categorias, null, 2));
    res.json(categorias[index]);
});

app.delete("/api/categorias/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = categorias.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Categoría no encontrada" });
    }
    categorias.splice(index, 1);
    fs.writeFileSync("./DATOS_API/categorias.json", JSON.stringify(categorias, null, 2));
    res.json({ mensaje: "Categoría eliminada" });
});

// ===== 404 FINAL =====

app.use((req, res) => {
    res.status(404).send("<h1>Error 404</h1><h2>Page Not Found</h2>");
});

app.listen(port, () => {
    console.log(pc.green(`Servidor escuchando en http://localhost:${port}`));
});