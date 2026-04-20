const Consultation = require('./consultation.model');

const defaultPopulate = [
  {
    path: 'client',
    select: 'name email phoneNumber profileImage role',
  },
  {
    path: 'ca',
    select: 'name email phoneNumber profileImage role',
  },
  {
    path: 'taxCase',
    select: 'taxYear status caseType',
  },
];

const buildListQuery = ({ userId, role, status }) => {
  const query = {};

  if (role === 'ca') {
    query.ca = userId;
  } else {
    query.client = userId;
  }

  if (status) {
    query.status = status;
  }

  return query;
};

const createConsultation = async ({ user, payload }) => {
  const consultation = await Consultation.create({
    client: user._id,
    ca: payload.caId,
    taxCase: payload.taxCaseId || null,
    title: payload.title || '',
    consultationType: payload.consultationType || 'initial-review',
    mode: payload.mode || 'video',
    scheduledDate: new Date(payload.scheduledDate),
    durationMinutes: Number(payload.durationMinutes || 30),
    timezone: payload.timezone || 'America/Toronto',
    notesFromClient: payload.notesFromClient || '',
    meetingLink: payload.meetingLink || '',
    location: payload.location || '',
    createdBy: user._id,
    updatedBy: user._id,
    status: 'requested',
  });

  return Consultation.findById(consultation._id).populate(defaultPopulate);
};

const getMyConsultations = async ({ user, status }) => {
  const query = buildListQuery({
    userId: user._id,
    role: user.role === 'ca' ? 'ca' : 'user',
    status,
  });

  return Consultation.find(query)
    .populate(defaultPopulate)
    .sort({ scheduledDate: 1, createdAt: -1 });
};

const getCAConsultations = async ({ user, status }) => {
  return Consultation.find(buildListQuery({ userId: user._id, role: 'ca', status }))
    .populate(defaultPopulate)
    .sort({ scheduledDate: 1, createdAt: -1 });
};

const getConsultationById = async (id) => {
  return Consultation.findById(id).populate(defaultPopulate);
};

const updateConsultation = async ({ consultation, updates, userId }) => {
  Object.assign(consultation, updates, {
    updatedBy: userId,
  });

  await consultation.save();
  return Consultation.findById(consultation._id).populate(defaultPopulate);
};

module.exports = {
  createConsultation,
  getMyConsultations,
  getCAConsultations,
  getConsultationById,
  updateConsultation,
};