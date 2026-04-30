const Contact = require('../models/Contact');




const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json({ message: 'Message submitted successfully', id: contact._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
};
