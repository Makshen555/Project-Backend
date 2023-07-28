const User = require("../models/userModel");
const jwt = require('jsonwebtoken');

const userPost = async (req, res) => {

    try {
      const {email, name, password } = req.body;
      const role = "usuario"
      const verified = false;
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(409).json({ message: 'El nombre de usuario ya existe' });
      }
  
      const user = new User({email, name, password, role, verified });
      await user.save();
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}
const userPut = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden editar usuarios.' });
  }

  try {
    const { username } = req.body;
    await User.findByIdAndUpdate(id, { username });
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};
const userGet = async (req, res) => {
  const { role } = req.user;

  if (role !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden ver la lista de usuarios.' });
  }
  if (req.query && req.query.id) {
    User.findById(req.query.id, function (err, teacher) {
      if (err) {
        res.status(404);
        console.log('error while queryting the teacher', err)
        res.json({ error: "Teacher doesnt exist" })
      }
      res.json(teacher);
    });
  } else {
    try {
      const users = await User.find({ role: { $ne: 'administrador' } }, { password: 0 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
    }

  }
}
const userDelete = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden eliminar usuarios.' });
  }
  try {
    await User.findByIdAndRemove(id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }

  if (user.role === 'user' && user.verified === false) {
    return res.status(200).json({ message: 'Espera la verificación del administrador' });
  }

  const token = jwt.sign({ email: user.email, name: user.username, role: user.role, verified: user.verified, _id : user._id }, 'clave-secreta-del-jwt');
  res.json({ token, role: user.role, verified: user.verified, _id : user._id });
};

const userVerification = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== 'administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden verificar usuarios.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.verified = true;
    await user.save();
    res.json({ message: 'Usuario verificado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar el usuario' });
  }
}

module.exports = {
  userPost,
  userPut,
  userGet,
  userDelete,
  userLogin,
  userVerification
}