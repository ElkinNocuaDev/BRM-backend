const express = require("express");
const router = express.Router();
const { User, LoginLog } = require("../model/user.model");

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            body: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users", error });
    }
});

// Obtener un usuario por ID
router.get("/users/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
          return res.status(404).json({
              ok: false,
              status: 404,
              message: "User not found",
          });
      }

      res.status(200).json({
          ok: true,
          status: 200,
          body: user,
      });
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user", fullError: error });
  }
});

// Agregar un usuario
router.post("/users/add", async (req, res) => {
  try {
      const userData = req.body;

      const newUser = await User.create({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role_id: userData.role_id
      });

      res.status(201).json({
          ok: true,
          status: 201,
          body: newUser,
          message: "User created successfully",
      });
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user", fullError: error });
  }
});

// Actualizar un usuario por id
router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    // Encuentra el usuario por su ID
    const user = await User.findByPk(userId);

    // Comprueba si el usuario existe
    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User not found",
      });
    }

    // Actualiza el usuario con los nuevos datos
    await user.update({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role_id: userData.role_id
    });

    // Envía una respuesta con el usuario actualizado
    res.status(200).json({
      ok: true,
      status: 200,
      body: user,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user", fullError: error });
  }
});

// Eliminar un usuario por id
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
      // Busca el usuario por su ID
      const user = await User.findByPk(userId);

      // Verifica si el usuario existe
      if (!user) {
          return res.status(404).json({
              ok: false,
              status: 404,
              message: "User not found",
          });
      }

      // Elimina el usuario
      await user.destroy();

      res.status(200).json({
          ok: true,
          status: 204,
          message: "User deleted!",
      });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error deleting user", error });
  }
});

// Login de usuario
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si existe un usuario con el correo electrónico proporcionado
    const user = await User.findOne({ where: { email } });

    if (!user) {
      await LoginLog.create({
        email: email,
        login_status: 'failure',
        ip_address: req.ip
      });

      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User not found",
      });
    }

    if (password !== user.password) {
      await LoginLog.create({
        user_id: user.id, // Establecer user_id con el ID del usuario
        email: email,
        login_status: 'failure',
        ip_address: req.ip
      });

      return res.status(401).json({
        ok: false,
        status: 401,
        message: "Invalid password",
      });
    }

    await LoginLog.create({
      user_id: user.id, // Establecer user_id con el ID del usuario
      email: email,
      login_status: 'success',
      ip_address: req.ip
    });

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login", fullError: error });
  }
});



module.exports = router;




