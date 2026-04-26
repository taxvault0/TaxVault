const CAProfile = require('./ca-profile.model');

// GET availability for user view
exports.getAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await CAProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: 'CA not found' });
    }

    res.json({
      success: true,
      availability: profile.hoursOfOperation || {},
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE availability (CA side)
exports.updateAvailability = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await CAProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.hoursOfOperation = req.body.hoursOfOperation;

    await profile.save();

    res.json({
      success: true,
      message: 'Availability updated',
      data: profile.hoursOfOperation,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};