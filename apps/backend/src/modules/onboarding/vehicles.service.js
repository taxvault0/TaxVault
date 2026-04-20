const Vehicle = require('./vehicle.model');
const UserProfile = require('./user-profile.model');

const ALLOWED_MAIN_USE = [
  'Employment',
  'Gig Work',
  'Self-Employment',
  'Business',
];

function normalizeMainUse(mainUse) {
  let normalized = mainUse;

  if (typeof normalized === 'string' && normalized.trim()) {
    normalized = [normalized.trim()];
  }

  if (!Array.isArray(normalized)) {
    normalized = [];
  }

  return normalized
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => ALLOWED_MAIN_USE.includes(item));
}

function normalizeVehicle(vehicle = {}) {
  return {
    ownerPerson: String(vehicle.ownerPerson || '').trim(),
    ownershipType: String(vehicle.ownershipType || '').trim(),
    mainUse: normalizeMainUse(vehicle.mainUse),
    purchaseDate: vehicle.purchaseDate || '',
    purchasePrice:
      vehicle.purchasePrice === '' || vehicle.purchasePrice == null
        ? 0
        : Number(vehicle.purchasePrice),
    gstHstPaid:
      vehicle.gstHstPaid === '' || vehicle.gstHstPaid == null
        ? 0
        : Number(vehicle.gstHstPaid),
  };
}

async function replaceVehicles(userId, vehicles = [], vehiclePurchasedForWork = false) {
  let profile = await UserProfile.findOne({ user: userId });

  if (!profile) {
    profile = await UserProfile.create({ user: userId });
  }

  if (profile.vehicles?.length) {
    await Vehicle.deleteMany({ _id: { $in: profile.vehicles } });
  }

  if (!vehiclePurchasedForWork || !Array.isArray(vehicles) || vehicles.length === 0) {
    profile.vehicles = [];
    profile.vehiclePurchasedForWork = false;
    await profile.save();
    return [];
  }

  const normalizedVehicles = vehicles.map((vehicle) => {
    const normalized = normalizeVehicle(vehicle);

    return {
      user: userId,
      ownerPerson: normalized.ownerPerson,
      ownershipType: normalized.ownershipType,
      mainUse: normalized.mainUse,
      purchaseDate: normalized.purchaseDate,
      purchasePrice: normalized.purchasePrice,
      gstHstPaid: normalized.gstHstPaid,
    };
  });

  const created = await Vehicle.insertMany(normalizedVehicles);

  profile.vehicles = created.map((doc) => doc._id);
  profile.vehiclePurchasedForWork = true;

  await profile.save();

  return created;
}

module.exports = {
  replaceVehicles,
};