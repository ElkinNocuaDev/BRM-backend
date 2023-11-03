const express = require("express");
const router = express.Router();
const { Purchase,
    PurchaseDetail,
    Invoice,
    PurchaseHistory } = require("../model/purchase.model");

// Listar todas las Purchases
router.get('/purchases', async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [PurchaseDetail, Invoice, PurchaseHistory]
            // Puedes incluir más opciones si es necesario, como atributos a excluir, etc.
        });

        if (purchases.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron compras'
            });
        }

        res.status(200).json({
            success: true,
            purchases: purchases
        });
    } catch (error) {
        console.error('Error al obtener las compras:', error);
        res.status(500).json({ error: 'Error al obtener las compras', fullError: error });
    }
});

// Listar Purchase por id
router.get('/purchases/:purchaseId', async (req, res) => {
    const { purchaseId } = req.params;
    try {
        const purchase = await Purchase.findByPk(purchaseId, {
            include: [PurchaseDetail, Invoice, PurchaseHistory]
            // Puedes incluir más opciones si es necesario, como atributos a excluir, etc.
        });

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            purchase: purchase
        });
    } catch (error) {
        console.error('Error al obtener la compra:', error);
        res.status(500).json({ error: 'Error al obtener la compra', fullError: error });
    }
});



// Registrar Purchase
router.post('/purchases/add', async (req, res) => {
    try {
        const { user_id, purchase_date, total_amount, details } = req.body;

        // Crear la compra
        const newPurchase = await Purchase.create({
            user_id,
            purchase_date,
            total_amount
        });

        // Crear los detalles de la compra
        const purchaseId = newPurchase.purchase_id;
        const purchaseDetails = details.map(detail => ({
            purchase_id: purchaseId,
            product_id: detail.product_id,
            quantity: detail.quantity,
            unit_price: detail.unit_price
        }));
        await PurchaseDetail.bulkCreate(purchaseDetails);


        function generateInvoiceNumber() {
            // Genera un número aleatorio entre 1000 y 9999
            const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        
            // Obtiene la fecha actual
            const date = new Date();
        
            // Obtiene partes de la fecha actual
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Se suma 1 ya que los meses comienzan en 0
            const day = date.getDate();
        
            // Formatea la fecha como cadena en formato YYYYMMDD
            const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
        
            // Combina la fecha y el número aleatorio para formar el número de factura
            const invoiceNumber = `INV-${formattedDate}-${randomNumber}`;
        
            return invoiceNumber;
        }
        
        // Crear la factura
        const newInvoice = await Invoice.create({
            purchase_id: purchaseId,
            invoice_number: generateInvoiceNumber(), // Función para generar un número de factura
            invoice_date: new Date(), // Fecha de emisión de la factura
            total_amount: total_amount // Monto total de la compra
        });

        // Crear historial de compra
        const newPurchaseHistory = await PurchaseHistory.create({
            user_id: user_id, // ID del usuario que realizó la compra
            purchase_id: purchaseId // ID de la compra
        });


        res.status(201).json({
            success: true,
            message: 'Compra creada exitosamente',
            purchase: newPurchase
            // Puedes enviar más detalles de la compra si es necesario
        });
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(500).json({ error: 'Error al crear la compra', fullError: error });
    }
});

module.exports = router;