const express = require('express');
const router = express.Router();

const {
  createConsultation,
  getMyConsultations,
  getCAConsultations,
  getConsultationById,
  confirmConsultation,
  rescheduleConsultation,
  completeConsultation,
  cancelConsultation,
} = require('./consultation.controller');

const {
  protect,
  authorize,
} = require('../../shared/middleware/auth.middleware');

router.use(protect);

router.post('/', authorize('user', 'ca', 'admin'), createConsultation);
router.get('/my', authorize('user', 'ca', 'admin'), getMyConsultations);
router.get('/ca/my', authorize('ca', 'admin'), getCAConsultations);
router.get('/:id', authorize('user', 'ca', 'admin'), getConsultationById);

router.patch('/:id/confirm', authorize('ca', 'admin'), confirmConsultation);
router.patch('/:id/reschedule', authorize('ca', 'admin'), rescheduleConsultation);
router.patch('/:id/complete', authorize('ca', 'admin'), completeConsultation);
router.patch('/:id/cancel', authorize('user', 'ca', 'admin'), cancelConsultation);

module.exports = router;