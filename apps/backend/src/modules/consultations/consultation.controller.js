const {
  validateCreateConsultation,
  isValidObjectId,
} = require('./consultation.validator');
const {
  createConsultation,
  getMyConsultations,
  getCAConsultations,
  getConsultationById,
  updateConsultation,
} = require('./consultation.service');

const canAccessConsultation = (consultation, user) => {
  if (!consultation || !user) return false;
  if (user.role === 'admin') return true;

  const userId = String(user._id);
  return (
    String(consultation.client?._id || consultation.client) === userId ||
    String(consultation.ca?._id || consultation.ca) === userId
  );
};

const canManageAsCA = (consultation, user) => {
  if (!consultation || !user) return false;
  if (user.role === 'admin') return true;
  return String(consultation.ca?._id || consultation.ca) === String(user._id);
};

exports.createConsultation = async (req, res) => {
  try {
    const { isValid, errors } = validateCreateConsultation(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.map((message) => ({ message })),
      });
    }

    const consultation = await createConsultation({
      user: req.user,
      payload: req.body,
    });

    return res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      consultation,
    });
  } catch (error) {
    console.error('createConsultation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to book consultation',
    });
  }
};

exports.getMyConsultations = async (req, res) => {
  try {
    const consultations = await getMyConsultations({
      user: req.user,
      status: req.query.status,
    });

    return res.status(200).json({
      success: true,
      consultations,
    });
  } catch (error) {
    console.error('getMyConsultations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load consultations',
    });
  }
};

exports.getCAConsultations = async (req, res) => {
  try {
    const consultations = await getCAConsultations({
      user: req.user,
      status: req.query.status,
    });

    return res.status(200).json({
      success: true,
      consultations,
    });
  } catch (error) {
    console.error('getCAConsultations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load CA consultations',
    });
  }
};

exports.getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultation ID',
      });
    }

    const consultation = await getConsultationById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    if (!canAccessConsultation(consultation, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    return res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    console.error('getConsultationById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load consultation',
    });
  }
};

exports.confirmConsultation = async (req, res) => {
  try {
    const consultation = await getConsultationById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    if (!canManageAsCA(consultation, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only assigned CA can confirm this consultation',
      });
    }

    const updated = await updateConsultation({
      consultation,
      userId: req.user._id,
      updates: {
        status: 'confirmed',
        notesFromCA: req.body.notesFromCA || consultation.notesFromCA,
        meetingLink: req.body.meetingLink || consultation.meetingLink,
        location: req.body.location || consultation.location,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation confirmed successfully',
      consultation: updated,
    });
  } catch (error) {
    console.error('confirmConsultation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm consultation',
    });
  }
};

exports.rescheduleConsultation = async (req, res) => {
  try {
    const consultation = await getConsultationById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    if (!canManageAsCA(consultation, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only assigned CA can reschedule this consultation',
      });
    }

    if (!req.body.scheduledDate || Number.isNaN(new Date(req.body.scheduledDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Valid scheduledDate is required',
      });
    }

    const updated = await updateConsultation({
      consultation,
      userId: req.user._id,
      updates: {
        status: 'rescheduled',
        scheduledDate: new Date(req.body.scheduledDate),
        durationMinutes: Number(req.body.durationMinutes || consultation.durationMinutes),
        timezone: req.body.timezone || consultation.timezone,
        rescheduleReason: req.body.rescheduleReason || '',
        meetingLink: req.body.meetingLink || consultation.meetingLink,
        location: req.body.location || consultation.location,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation rescheduled successfully',
      consultation: updated,
    });
  } catch (error) {
    console.error('rescheduleConsultation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reschedule consultation',
    });
  }
};

exports.completeConsultation = async (req, res) => {
  try {
    const consultation = await getConsultationById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    if (!canManageAsCA(consultation, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Only assigned CA can complete this consultation',
      });
    }

    const updated = await updateConsultation({
      consultation,
      userId: req.user._id,
      updates: {
        status: 'completed',
        completedAt: new Date(),
        notesFromCA: req.body.notesFromCA || consultation.notesFromCA,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation marked as completed',
      consultation: updated,
    });
  } catch (error) {
    console.error('completeConsultation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete consultation',
    });
  }
};

exports.cancelConsultation = async (req, res) => {
  try {
    const consultation = await getConsultationById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
      });
    }

    if (!canAccessConsultation(consultation, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updated = await updateConsultation({
      consultation,
      userId: req.user._id,
      updates: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: req.body.cancellationReason || '',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation cancelled successfully',
      consultation: updated,
    });
  } catch (error) {
    console.error('cancelConsultation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel consultation',
    });
  }
};