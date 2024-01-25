/* eslint-disable no-underscore-dangle */
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
  async getSegment(req, res) {
    try {
      const [
        totalData,
        genderData,
        brandDeviceData,
        digitalInterestData,
        ageData,
      ] = await Promise.all([
        User.aggregate([{
          $count: 'count',
        }]),
        User.aggregate([
          {
            $group: {
              _id: '$gender',
              count: { $sum: 1 },
            },
          },
        ]),
        User.aggregate([
          {
            $group: {
              _id: '$brand_device',
              count: { $sum: 1 },
            },
          },
        ]),
        User.aggregate([
          {
            $group: {
              _id: '$digital_interest',
              count: { $sum: 1 },
            },
          },
        ]),
        User.aggregate([
          {
            $project: {
              name: 1,
              age: {
                $subtract: [new Date().getFullYear(), '$age'],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              ageCategory: {
                $switch: {
                  branches: [
                    { case: { $lt: ['$age', 18] }, then: 'under_18' },
                    { case: { $and: [{ $gte: ['$age', 18] }, { $lte: ['$age', 24] }] }, then: '18_until_24' },
                    { case: { $and: [{ $gte: ['$age', 25] }, { $lte: ['$age', 34] }] }, then: '25_until_34' },
                    { case: { $and: [{ $gte: ['$age', 35] }, { $lte: ['$age', 44] }] }, then: '35_until_44' },
                    { case: { $and: [{ $gte: ['$age', 45] }, { $lte: ['$age', 64] }] }, then: '45_until_64' },
                    { case: { $gte: ['$age', 65] }, then: '65_above' },
                  ],
                  default: 'Unknown',
                },
              },
            },
          },
          {
            $group: {
              _id: '$ageCategory',
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const total = totalData[0].count;

      const mapPercentageByGender = {};
      for (const genderItem of genderData) {
        if (!mapPercentageByGender[genderItem._id]) {
          const key = genderItem._id.toLowerCase().split(' ').join('_');
          mapPercentageByGender[key] = (genderItem.count / total) * 100;
        }
      }

      const mapPercentageByDevice = {};
      for (const deviceItem of brandDeviceData) {
        if (!mapPercentageByDevice[deviceItem._id]) {
          const key = deviceItem._id.toLowerCase().split(' ').join('_');
          mapPercentageByDevice[key] = (deviceItem.count / total) * 100;
        }
      }

      const mapPercentageByInterest = {};
      for (const interestItem of digitalInterestData) {
        if (!mapPercentageByInterest[interestItem._id]) {
          const key = interestItem._id.toLowerCase().split(' ').join('_');
          mapPercentageByInterest[key] = (interestItem.count / total) * 100;
        }
      }

      const mapPercentageByAge = {};
      for (const ageItem of ageData) {
        if (!mapPercentageByAge[ageItem._id]) {
          const key = ageItem._id.toLowerCase().split(' ').join('_');
          mapPercentageByAge[key] = (ageItem.count / total) * 100;
        }
      }

      return res.status(200).json({
        status: ResponseStatus.Success,
        message: 'Succefully get user segment',
        data: {
          gender: { ...mapPercentageByGender },
          brand_device: { ...mapPercentageByDevice },
          digital_interest: { ...mapPercentageByInterest },
          age: { ...mapPercentageByAge },
        },
      });
    } catch (error) {
      console.error('Failed get user segment: ', error.message);
      return res.status(500).json({
        status: ResponseStatus.Failed,
        message: 'INTERNAL SERVER ERROR.',
        errors: [error.message],
      });
    }
  },
  async getSummary(req, res) {
    try {
      const [
        uniqueUserPerDayData,
        uniqueUserData,
        newAndReturningPerDayOneToNineteenData,
        newAndReturningPerDayTwentyToThirtyData,
        newAndReturningData,
        crowdedDayData,
        crowdedHourData,
        totalData,
      ] = await Promise.all([
        User.aggregate([
          {
            $group: {
              _id: {
                login_date: '$login_date',
                email: '$email',
              },
            },
          },
          {
            $group: {
              _id: '$_id.login_date',
              total: { $sum: 1 },
            },
          },
        ]),
        User.aggregate([
          {
            $group: {
              _id: '$email',
            },
          },
          {
            $count: 'count',
          },
        ]),
        User.aggregate([
          {
            $match: {
              login_date: {
                $gte: new Date('2023-11-30'),
                $lte: new Date('2023-12-19'),
              },
            },
          },
          {
            $group: {
              _id: {
                login_date: '$login_date',
                email: '$email',
                name_of_location: '$name_of_location',
                location_type: '$location_type',
              },
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: { $gt: 1 },
            },
          },
          {
            $group: {
              _id: {
                login_date: '$_id.login_date',
              },
              total: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              login_date: '$_id.login_date',
              total: 1,
            },
          },
        ], { allowDiskUse: true }),
        User.aggregate([
          {
            $match: {
              login_date: {
                $gte: new Date('2023-12-20'),
                $lte: new Date('2023-12-30'),
              },
            },
          },
          {
            $group: {
              _id: {
                login_date: '$login_date',
                email: '$email',
                name_of_location: '$name_of_location',
                location_type: '$location_type',
              },
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: { $gt: 1 },
            },
          },
          {
            $group: {
              _id: {
                login_date: '$_id.login_date',
              },
              total: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              login_date: '$_id.login_date',
              total: 1,
            },
          },
        ], { allowDiskUse: true }),
        User.aggregate([
          {
            $group: {
              _id: {
                email: '$email',
                name_of_location: '$name_of_location',
                location_type: '$location_type',
              },
              count: { $sum: 1 },
            },
          },
          {
            $match: {
              count: { $gt: 1 },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: '$count' },
            },
          },
        ], { allowDiskUse: true }),
        User.aggregate([
          {
            $group: {
              _id: '$login_date',
              total_users: { $sum: 1 },
            },
          },
          {
            $sort: {
              total_users: -1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 0,
              most_crowded_day: '$_id',
              total_users: 1,
            },
          },
        ]),
        User.aggregate([
          {
            $group: {
              _id: '$login_hour',
              total_users: { $sum: 1 },
            },
          },
          {
            $sort: {
              total_users: -1,
            },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 0,
              most_crowded_hour: '$_id',
              total_users: 1,
            },
          },
        ]),
        User.aggregate([{
          $count: 'count',
        }]),
      ]);

      return res.status(200).json({
        status: ResponseStatus.Success,
        message: 'Succefully get user summary',
        data: {
          unique_user_per_day: uniqueUserPerDayData,
          total_unique_user: uniqueUserData[0].count,
          most_crowded_day: crowdedDayData[0].most_crowded_day,
          most_crowded_hour: crowdedHourData[0].most_crowded_hour,
          total_data: totalData[0].count,
          new_and_returning_per_day: newAndReturningPerDayOneToNineteenData.concat(newAndReturningPerDayTwentyToThirtyData),
          total_new_and_returning: newAndReturningData[0].count,
        },
      });
    } catch (error) {
      console.error('Failed get user summary: ', error.message);
      return res.status(500).json({
        status: ResponseStatus.Failed,
        message: 'INTERNAL SERVER ERROR.',
        errors: [error.message],
      });
    }
  },
};

module.exports = controller;
