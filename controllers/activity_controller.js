const Activity = require('../models/activity');

// Get all activities
exports.getAllActivities = (req, res) => {
  Activity.find()
    .then((activities) => {
      res.status(200).json(activities);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Get a single activity by ID
exports.getActivityById = (req, res) => {
  const { id } = req.params;
  Activity.findById(id)
    .then((activity) => {
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.status(200).json(activity);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Create a new activity
exports.createActivity = (req, res) => {
  const { id, user_id, date, steps, distance, runDistance, calories, activityType } = req.body;
  const newActivity = new Activity({
    id,
    user_id,
    date,
    steps,
    distance,
    runDistance,
    calories,
    activityType,
  });
  newActivity
    .save()
    .then((activity) => {
      res.status(201).json(activity);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Update an existing activity
exports.updateActivity = (req, res) => {
  const { id } = req.params;
  Activity.findByIdAndUpdate(id, req.body, { new: true })
    .then((activity) => {
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.status(200).json(activity);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Delete an existing activity
exports.deleteActivity = (req, res) => {
  const { id } = req.params;
  Activity.findByIdAndDelete(id)
    .then((activity) => {
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.status(200).json({ message: 'Activity deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

