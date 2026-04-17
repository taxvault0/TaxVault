const Address = require('./address.model');
const Spouse = require('./spouse.model');
const UserProfile = require('./user-profile.model');

function hasSpouseLikeStatus(status = '') {
  const normalized = String(status).trim().toLowerCase();

  return (
    normalized === 'married' ||
    normalized === 'common-law' ||
    normalized === 'common law'
  );
}

function hasMeaningfulSpouseData(spouse = {}) {
  return Boolean(
    spouse.name ||
      spouse.dob ||
      spouse.sin ||
      spouse.phone ||
      (Array.isArray(spouse.gigPlatforms) && spouse.gigPlatforms.length) ||
      (Array.isArray(spouse.additionalIncomeSources) &&
        spouse.additionalIncomeSources.length)
  );
}

function normalizeSpouse(spouse = {}) {
  return {
    name: spouse.name || '',
    dob: spouse.dob || '',
    sin: spouse.sin || '',
    phone: spouse.phone || '',
    gigPlatforms: Array.isArray(spouse.gigPlatforms) ? spouse.gigPlatforms : [],
    additionalIncomeSources: Array.isArray(spouse.additionalIncomeSources)
      ? spouse.additionalIncomeSources
      : [],
  };
}

async function upsertPersonalDetails(userId, payload = {}) {
  let profile = await UserProfile.findOne({ user: userId });

  if (!profile) {
    profile = await UserProfile.create({ user: userId });
  }

  if (payload.address) {
    let addressDoc = null;

    if (profile.address) {
      addressDoc = await Address.findByIdAndUpdate(
        profile.address,
        {
          street: payload.address.street || '',
          city: payload.address.city || '',
          province: payload.address.province || '',
          postalCode: payload.address.postalCode || '',
          country: payload.address.country || 'Canada',
        },
        { new: true, runValidators: true }
      );
    } else {
      addressDoc = await Address.create({
        street: payload.address.street || '',
        city: payload.address.city || '',
        province: payload.address.province || '',
        postalCode: payload.address.postalCode || '',
        country: payload.address.country || 'Canada',
      });

      profile.address = addressDoc._id;
    }
  }

  const familyStatus = payload.familyStatus || '';
  const shouldKeepSpouse = hasSpouseLikeStatus(familyStatus);
  const spousePayload = normalizeSpouse(payload.spouse || {});

  if (shouldKeepSpouse && hasMeaningfulSpouseData(spousePayload)) {
    let spouseDoc = null;

    if (profile.spouse) {
      spouseDoc = await Spouse.findByIdAndUpdate(
        profile.spouse,
        spousePayload,
        { new: true, runValidators: true }
      );
    } else {
      spouseDoc = await Spouse.create({
        user: userId,
        ...spousePayload,
      });

      profile.spouse = spouseDoc._id;
    }
  } else if (profile.spouse) {
    await Spouse.findByIdAndDelete(profile.spouse);
    profile.spouse = null;
  }

  if (typeof payload.familyStatus !== 'undefined') {
    profile.familyStatus = familyStatus;
  }

  if (typeof payload.numberOfDependents !== 'undefined') {
    profile.numberOfDependents = Number(payload.numberOfDependents || 0);
  }

  await profile.save();

  return profile;
}

module.exports = {
  upsertPersonalDetails,
};