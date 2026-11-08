import express from 'express';
import { pool, queryAsDispatcher } from '../db/db.js';
import { authenticate } from '../middleware/authenticate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();
const ALLOWED_STATUSES = ['pending', 'acknowledged', 'resolved'];

router.post('/', asyncHandler(async (req, res) => {
  const {
    situation_type, city, qr_code_id, venue_name, placement,
    latitude, longitude, location_accuracy_m, location_method,
    live_tracking, victim_message
  } = req.body;

  if (!situation_type || !city) {
    throw new AppError(400, 'Date lipsă', 'situation_type și city sunt obligatorii');
  }

  const result = await queryAsDispatcher(
    { city, role: '' },
    `INSERT INTO incidents (
       situation_type, city, qr_code_id, venue_name, placement,
       latitude, longitude, location_accuracy_m, location_method,
       live_tracking, victim_message
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [situation_type, city, qr_code_id ?? null, venue_name ?? null, placement ?? null,
     latitude ?? null, longitude ?? null, location_accuracy_m ?? null, location_method ?? null,
     live_tracking ?? false, victim_message ?? null]
  );
  res.status(201).json(result.rows[0]);
}));

// Public — victima trimite poziția live cât ține pagina deschisă (112 / 119).
// Securizat prin update_token primit la crearea incidentului; RLS cere potrivirea orașului.
router.patch('/:id/location', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, location_accuracy_m, update_token, city } = req.body;

  if (latitude == null || longitude == null || !update_token || !city) {
    throw new AppError(400, 'Date lipsă', 'latitude, longitude, update_token și city sunt obligatorii');
  }

  const result = await queryAsDispatcher(
    { city, role: '' },
    `UPDATE incidents
       SET latitude = $1, longitude = $2, location_accuracy_m = $3,
           location_method = 'gps', location_updated_at = now()
     WHERE id = $4 AND update_token = $5
     RETURNING id`,
    [latitude, longitude, location_accuracy_m ?? null, id, update_token]
  );

  if (result.rowCount === 0) {
    throw new AppError(404, 'Incident inexistent', 'Incident inexistent sau token invalid');
  }

  res.status(204).send();
}));

// Public — o persoană de încredere deschide linkul live ("Anunță pe cineva").
// Accesul e controlat de share_token (capabilitatea); întoarce DOAR câmpuri de locație.
// Contextul super_admin ocolește RLS pe oraș; tokenul e secretul care gestionează accesul.
router.get('/track/:token', asyncHandler(async (req, res) => {
  const { token } = req.params;
  const result = await queryAsDispatcher(
    { city: '', role: 'super_admin' },
    `SELECT latitude, longitude, location_accuracy_m, location_updated_at,
            status, situation_type, venue_name, created_at
       FROM incidents WHERE share_token = $1`,
    [token]
  );
  if (result.rowCount === 0) {
    throw new AppError(404, 'Link invalid', 'Link invalid sau expirat');
  }
  res.json(result.rows[0]);
}));

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const result = await queryAsDispatcher(
    req.dispatcher,
    'SELECT * FROM incidents ORDER BY created_at DESC'
  );
  res.json(result.rows);
}));

router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    throw new AppError(400, 'Status invalid', `status trebuie să fie unul din: ${ALLOWED_STATUSES.join(', ')}`);
  }

  const timestampColumn = status === 'acknowledged' ? 'acknowledged_at'
                         : status === 'resolved' ? 'resolved_at'
                         : null;

  const result = await queryAsDispatcher(
    req.dispatcher,
    `UPDATE incidents
     SET status = $1, dispatcher_id = $2
         ${timestampColumn ? `, ${timestampColumn} = now()` : ''}
     WHERE id = $3
     RETURNING *`,
    [status, req.dispatcher.id, id]
  );

  if (result.rowCount === 0) {
    throw new AppError(404, 'Incident inexistent', 'Incidentul nu există sau nu ai acces la el');
  }

  res.json(result.rows[0]);
}));

router.post('/:id/actions', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action_type, note } = req.body;

  if (!action_type) {
    throw new AppError(400, 'Date lipsă', 'action_type este obligatoriu');
  }

  const detailText = note ? `Incident #${id}: ${note}` : `Incident #${id}`;

  await pool.query(
    `INSERT INTO audit_log (dispatcher_id, action, detail) VALUES ($1, $2, $3)`,
    [req.dispatcher.id, action_type, detailText]
  );

  if (note) {
    await pool.query(
      `UPDATE incidents
       SET notes = CASE
         WHEN notes IS NULL OR notes = '' THEN $1
         ELSE notes || E'\n' || $1
       END
       WHERE id = $2`,
      [note, id]
    );
  }

  res.status(201).json({ status: 'logged' });
}));

export default router;