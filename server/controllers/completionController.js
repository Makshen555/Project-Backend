const Completion = require("../models/completionModel");

const completionPost = async (req, res) => {
    try {
        const { prompt, user } = req.body;
        const model = "text-davinci-edit-003"
        const temperature = 0

        const completion = new Completion({ model, prompt, temperature, user });
        await completion.save();
        res.status(201).json({ message: 'Completion prompt registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el Completion prompt' });
    }
}
const completionGet = async (req, res) => {
    if (req.query && req.query.id) {
        Completion.findById(req.query.id, function (err, edit) {
        if (err) {
          res.status(404);
          console.log('error while queryting the teacher', err)
          res.json({ error: "Teacher doesnt exist" })
        }
        res.json(edit);
      });
    } else {
      try {
        const completions = await Completion.find();
        res.json(completions);
      } catch (err) {
        res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
      }
    }
}
const completionDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await Completion.findByIdAndRemove(id);
    res.json({ message: 'Completion eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el completion' });
  }
};
module.exports = {
    completionPost,
    completionGet,
    //editPut,
    completionDelete
  };