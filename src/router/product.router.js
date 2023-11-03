const router = require("express").Router();
const { faker } = require("@faker-js/faker");

const Products = require("../model/product.model");

//obtener todos los productos
router.get("/products", async (req, res) => {
    try {
        const products = await Products.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            body: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Error fetching products", error });
    }
});


//obtener productos por ID
router.get("/products/:product_id", async (req, res) => {
    try {
        const id = req.params.product_id;
        const product = await Products.findOne({
            where: {
                product_id: id,
            },
        });

        if (product) {
            res.status(200).json({
                ok: true,
                status: 200,
                body: product,
            });
        } else {
            res.status(404).json({
                ok: false,
                status: 404,
                message: "Product not found",
            });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Error fetching product", fullError: error });
    }
});



//Creación del Producto
router.post("/products/add", async (req, res) => {
    try{  
        const dataProducts = req.body;
        await Products.sync();
        const createProduct = await Products.create({
            product_lote: dataProducts.product_lote,
            product_name: dataProducts.product_name,
            price: dataProducts.price,
            amount: dataProducts.amount,
            date_in: dataProducts.date_in,
            is_stock: dataProducts.is_stock,
        },{
            fields: ['product_lote', 'product_name', 'price', 'amount', 'date_in', 'is_stock']
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Created Product",
        }
    );
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, error });
    }  
});

//Actualizar un producto por ID
router.put("/products/:product_id", async (req, res) => {
    try {
        const id = req.params.product_id;
        const dataProducts = req.body;
        
        const [updatedRowsCount] = await Products.update(
            {
                product_lote: dataProducts.product_lote,
                product_name: dataProducts.product_name,
                price: dataProducts.price,
                amount: dataProducts.amount,
                date_in: dataProducts.date_in,
                is_stock: dataProducts.is_stock,
            },
            {
                where: {
                    product_id: id,
                },
            }
        );

        if (updatedRowsCount > 0) {
            res.status(200).json({
                ok: true,
                status: 200,
                message: "Product updated successfully",
            });
        } else {
            res.status(404).json({
                ok: false,
                status: 404,
                message: "Product updated",
            });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Error updating product", error });
    }
});


//Eliminar un producto por ID
router.delete("/products/:product_id", async (req, res) => {
    try {
        const id = req.params.product_id;
        const deleteProduct = await Products.destroy({
            where: {
                product_id: id,
            },
        });

        res.status(200).json({
            ok: true,
            status: 204,
            //body: deleteProduct,
            message: "Product deleted!",
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Error deleting product", error });
    }
});

module.exports = router;
