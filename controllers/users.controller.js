const User = require('../models/users.model');
const { ResponseStatus } = require('../utils/constants.util');

const controller = {
  async getById(req, res) {
    try {
      const users = await User.findOne({ _id: req.params.id });

      return res.status(200).json({
        status: ResponseStatus.Success,
        message: 'Succefully get user by id',
        data: users,
      });
    } catch (error) {
      console.error('Failed get user by id: ', error.message);
      return res.status(500).json({
        status: ResponseStatus.Failed,
        message: 'INTERNAL SERVER ERROR.',
        errors: [error.message],
      });
    }
  },
};

module.exports = controller;
