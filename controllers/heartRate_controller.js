const HeartRate = require('../models/heartRate');

exports.createHeartRate = async (req, res) => {
  try {
    const { user_id, date, time, heartRate, avgHeartRate } = req.body;
    const newHeartRate = new HeartRate({ user_id, date, time, heartRate, avgHeartRate });
    await newHeartRate.save();
    res.status(201).json(newHeartRate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getHeartRatesByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const heartRates = await HeartRate.find({ user_id });
    res.json(heartRates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteHeartRate = async (req, res) => {
  try {
    const id = req.params.id;
    const heartRate = await HeartRate.findById(id);
    if (!heartRate) {
      return res.status(404).json({ msg: 'Heart rate not found' });
    }
    await heartRate.remove();
    res.json({ msg: 'Heart rate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
