import { pool } from '../../config/database.js';
import bcrypt from 'bcryptjs';

const ALLOWED_GENDERS = new Set(['Male', 'Female', 'Other']);

const makeServiceError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const toNullableString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();
  return text === '' ? null : text;
};

const toNullableDate = (value, fieldName) => {
  const dateValue = toNullableString(value);

  if (dateValue === null) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    throw makeServiceError(`${fieldName} must be in YYYY-MM-DD format`);
  }

  const [year, month, day] = dateValue.split('-').map(Number);
  const parsed = new Date(`${dateValue}T00:00:00.000Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    throw makeServiceError(`${fieldName} must be a valid date`);
  }

  return dateValue;
};

const toNullableGender = (value, fieldName = 'gender') => {
  const gender = toNullableString(value);

  if (gender === null) {
    return null;
  }

  if (!ALLOWED_GENDERS.has(gender)) {
    throw makeServiceError(`${fieldName} must be one of: Male, Female, Other`);
  }

  return gender;
};

const toNullableEmail = (value, fieldName = 'email') => {
  const email = toNullableString(value);

  if (email === null) {
    return null;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw makeServiceError(`${fieldName} must be a valid email address`);
  }

  return email.toLowerCase();
};

const ensureUserExists = async (userId) => {
  const [users] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);

  if (users.length === 0) {
    throw makeServiceError('User not found', 404);
  }
};

const normalizeProfilePayload = (payload = {}) => ({
  firstMiddleName: toNullableString(payload.firstMiddleName ?? payload.first_middle_name),
  lastName: toNullableString(payload.lastName ?? payload.last_name),
  gender: toNullableGender(payload.gender),
  dateOfBirth: toNullableDate(payload.dateOfBirth ?? payload.date_of_birth, 'dateOfBirth'),
  nationality: toNullableString(payload.nationality),
  cityOfResidence: toNullableString(payload.cityOfResidence ?? payload.city_of_residence),
  stateName: toNullableString(payload.state ?? payload.stateName ?? payload.state_name),
  countryCode: toNullableString(payload.countryCode ?? payload.country_code),
  mobile: toNullableString(payload.mobile),
  passportNo: toNullableString(payload.passportNo ?? payload.passport_no),
  passportExpiryDate: toNullableDate(payload.passportExpiryDate ?? payload.passport_expiry_date, 'passportExpiryDate'),
  passportIssuingCountry: toNullableString(payload.passportIssuingCountry ?? payload.passport_issuing_country),
  panCardNumber: toNullableString(payload.panCardNumber ?? payload.pan_card_number),
  avatarUrl: toNullableString(payload.avatarUrl ?? payload.avatar_url)
});

const resolveUpdatedUserName = (payload, profileData) => {
  const explicitNameProvided = hasOwn(payload, 'name');
  const explicitName = toNullableString(payload.name);

  if (explicitNameProvided) {
    return explicitName;
  }

  const firstProvided = hasOwn(payload, 'firstMiddleName') || hasOwn(payload, 'first_middle_name');
  const lastProvided = hasOwn(payload, 'lastName') || hasOwn(payload, 'last_name');

  if (firstProvided || lastProvided) {
    const combined = [profileData.firstMiddleName, profileData.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    return combined || null;
  }

  return null;
};

const normalizeCoTravellerPayload = (payload = {}) => {
  const normalized = {
    firstName: toNullableString(payload.firstName ?? payload.first_name),
    lastName: toNullableString(payload.lastName ?? payload.last_name),
    gender: toNullableGender(payload.gender),
    dateOfBirth: toNullableDate(payload.dateOfBirth ?? payload.date_of_birth, 'dateOfBirth'),
    nationality: toNullableString(payload.nationality),
    relationship: toNullableString(payload.relationship),
    mealPreference: toNullableString(payload.mealPreference ?? payload.meal_preference),
    trainBerthPreference: toNullableString(payload.trainBerthPreference ?? payload.train_berth_preference),
    passportNo: toNullableString(payload.passportNo ?? payload.passport_no),
    passportExpiryDate: toNullableDate(payload.passportExpiryDate ?? payload.passport_expiry_date, 'passportExpiryDate'),
    issuingCountry: toNullableString(payload.issuingCountry ?? payload.issuing_country),
    mobile: toNullableString(payload.mobile),
    email: toNullableEmail(payload.email)
  };

  if (!normalized.firstName) {
    throw makeServiceError('firstName is required for co-traveller');
  }

  return normalized;
};

const mapProfileRow = (row) => ({
  firstMiddleName: row.firstMiddleName ?? null,
  lastName: row.lastName ?? null,
  gender: row.gender ?? null,
  dateOfBirth: row.dateOfBirth ?? null,
  nationality: row.nationality ?? null,
  cityOfResidence: row.cityOfResidence ?? null,
  state: row.stateName ?? null,
  countryCode: row.countryCode ?? null,
  mobile: row.mobile ?? null,
  passportNo: row.passportNo ?? null,
  passportExpiryDate: row.passportExpiryDate ?? null,
  passportIssuingCountry: row.passportIssuingCountry ?? null,
  panCardNumber: row.panCardNumber ?? null,
  avatarUrl: row.avatarUrl ?? null
});

const mapCoTravellerRow = (row) => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName ?? null,
  gender: row.gender ?? null,
  dateOfBirth: row.dateOfBirth ?? null,
  nationality: row.nationality ?? null,
  relationship: row.relationship ?? null,
  mealPreference: row.mealPreference ?? null,
  trainBerthPreference: row.trainBerthPreference ?? null,
  passportNo: row.passportNo ?? null,
  passportExpiryDate: row.passportExpiryDate ?? null,
  issuingCountry: row.issuingCountry ?? null,
  mobile: row.mobile ?? null,
  email: row.email ?? null
});

export const getProfileByUserId = async (userId) => {
  await ensureUserExists(userId);

  const [rows] = await pool.query(
    `
      SELECT
        u.id AS userId,
        u.name AS userName,
        u.email AS userEmail,
        up.first_middle_name AS firstMiddleName,
        up.last_name AS lastName,
        up.gender AS gender,
        up.date_of_birth AS dateOfBirth,
        up.nationality AS nationality,
        up.city_of_residence AS cityOfResidence,
        up.state_name AS stateName,
        up.country_code AS countryCode,
        up.mobile AS mobile,
        up.passport_no AS passportNo,
        up.passport_expiry_date AS passportExpiryDate,
        up.passport_issuing_country AS passportIssuingCountry,
        up.pan_card_number AS panCardNumber,
        up.avatar_url AS avatarUrl
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = ?
      LIMIT 1
    `,
    [userId]
  );

  const userRow = rows[0];
  const coTravellers = await getCoTravellersByUserId(userId);

  return {
    user: {
      id: userRow.userId,
      name: userRow.userName,
      email: userRow.userEmail
    },
    profile: mapProfileRow(userRow),
    coTravellers
  };
};

export const upsertProfileByUserId = async (userId, payload) => {
  await ensureUserExists(userId);

  const profileData = normalizeProfilePayload(payload);

  if (!profileData.firstMiddleName) {
    throw makeServiceError('First name is required');
  }

  if (!profileData.mobile) {
    throw makeServiceError('Contact details are required');
  }

  const [existingRows] = await pool.query(
    'SELECT id FROM user_profiles WHERE user_id = ? LIMIT 1',
    [userId]
  );

  const operationType = existingRows.length > 0 ? 'UPDATE' : 'INSERT';
  console.log(`[Profile][PUT] userId=${userId} profileOperation=${operationType}`);

  await pool.query(
    `
      INSERT INTO user_profiles (
        user_id,
        first_middle_name,
        last_name,
        gender,
        date_of_birth,
        nationality,
        city_of_residence,
        state_name,
        country_code,
        mobile,
        passport_no,
        passport_expiry_date,
        passport_issuing_country,
        pan_card_number,
        avatar_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_middle_name = VALUES(first_middle_name),
        last_name = VALUES(last_name),
        gender = VALUES(gender),
        date_of_birth = VALUES(date_of_birth),
        nationality = VALUES(nationality),
        city_of_residence = VALUES(city_of_residence),
        state_name = VALUES(state_name),
        country_code = VALUES(country_code),
        mobile = VALUES(mobile),
        passport_no = VALUES(passport_no),
        passport_expiry_date = VALUES(passport_expiry_date),
        passport_issuing_country = VALUES(passport_issuing_country),
        pan_card_number = VALUES(pan_card_number),
        avatar_url = VALUES(avatar_url),
        updated_at = NOW()
    `,
    [
      userId,
      profileData.firstMiddleName,
      profileData.lastName,
      profileData.gender,
      profileData.dateOfBirth,
      profileData.nationality,
      profileData.cityOfResidence,
      profileData.stateName,
      profileData.countryCode,
      profileData.mobile,
      profileData.passportNo,
      profileData.passportExpiryDate,
      profileData.passportIssuingCountry,
      profileData.panCardNumber,
      profileData.avatarUrl
    ]
  );

  const updatedName = resolveUpdatedUserName(payload, profileData);
  if (updatedName) {
    await pool.query(
      'UPDATE users SET name = ?, updated_at = NOW() WHERE id = ?',
      [updatedName, userId]
    );
  }

  return { operationType };
};

export const resetPasswordByUserId = async (userId, payload = {}) => {
  await ensureUserExists(userId);

  const oldPassword = payload.oldPassword ?? payload.old_password;
  const newPassword = payload.newPassword ?? payload.new_password;

  if (typeof oldPassword !== 'string' || oldPassword.length === 0) {
    throw makeServiceError('Old password is required');
  }

  if (typeof newPassword !== 'string' || newPassword.length === 0) {
    throw makeServiceError('New password is required');
  }

  if (oldPassword === newPassword) {
    throw makeServiceError('New password must be different from old password');
  }

  const [rows] = await pool.query(
    'SELECT password FROM users WHERE id = ? LIMIT 1',
    [userId]
  );

  if (rows.length === 0) {
    throw makeServiceError('User not found', 404);
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, rows[0].password);

  if (!isOldPasswordValid) {
    throw makeServiceError('Password is not matched with the Current Password', 401);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
    [hashedNewPassword, userId]
  );
};

export const verifyCurrentPasswordByUserId = async (userId, payload = {}) => {
  await ensureUserExists(userId);

  const oldPassword = payload.oldPassword ?? payload.old_password;

  if (typeof oldPassword !== 'string' || oldPassword.length === 0) {
    throw makeServiceError('Old password is required');
  }

  const [rows] = await pool.query(
    'SELECT password FROM users WHERE id = ? LIMIT 1',
    [userId]
  );

  if (rows.length === 0) {
    throw makeServiceError('User not found', 404);
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, rows[0].password);

  if (!isOldPasswordValid) {
    throw makeServiceError('Password is not matched with the Current Password', 401);
  }

  return { matched: true };
};

export const getCoTravellersByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        first_name AS firstName,
        last_name AS lastName,
        gender,
        date_of_birth AS dateOfBirth,
        nationality,
        relationship,
        meal_preference AS mealPreference,
        train_berth_preference AS trainBerthPreference,
        passport_no AS passportNo,
        passport_expiry_date AS passportExpiryDate,
        issuing_country AS issuingCountry,
        mobile,
        email
      FROM co_travellers
      WHERE user_id = ?
      ORDER BY updated_at DESC, id DESC
    `,
    [userId]
  );

  return rows.map(mapCoTravellerRow);
};

export const createCoTravellerByUserId = async (userId, payload) => {
  await ensureUserExists(userId);

  const coTravellerData = normalizeCoTravellerPayload(payload);

  const [result] = await pool.query(
    `
      INSERT INTO co_travellers (
        user_id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        nationality,
        relationship,
        meal_preference,
        train_berth_preference,
        passport_no,
        passport_expiry_date,
        issuing_country,
        mobile,
        email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      coTravellerData.firstName,
      coTravellerData.lastName,
      coTravellerData.gender,
      coTravellerData.dateOfBirth,
      coTravellerData.nationality,
      coTravellerData.relationship,
      coTravellerData.mealPreference,
      coTravellerData.trainBerthPreference,
      coTravellerData.passportNo,
      coTravellerData.passportExpiryDate,
      coTravellerData.issuingCountry,
      coTravellerData.mobile,
      coTravellerData.email
    ]
  );

  const [rows] = await pool.query(
    `
      SELECT
        id,
        first_name AS firstName,
        last_name AS lastName,
        gender,
        date_of_birth AS dateOfBirth,
        nationality,
        relationship,
        meal_preference AS mealPreference,
        train_berth_preference AS trainBerthPreference,
        passport_no AS passportNo,
        passport_expiry_date AS passportExpiryDate,
        issuing_country AS issuingCountry,
        mobile,
        email
      FROM co_travellers
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `,
    [result.insertId, userId]
  );

  return mapCoTravellerRow(rows[0]);
};

export const updateCoTravellerByUserId = async (userId, coTravellerId, payload) => {
  const coTravellerData = normalizeCoTravellerPayload(payload);

  const [result] = await pool.query(
    `
      UPDATE co_travellers
      SET
        first_name = ?,
        last_name = ?,
        gender = ?,
        date_of_birth = ?,
        nationality = ?,
        relationship = ?,
        meal_preference = ?,
        train_berth_preference = ?,
        passport_no = ?,
        passport_expiry_date = ?,
        issuing_country = ?,
        mobile = ?,
        email = ?,
        updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `,
    [
      coTravellerData.firstName,
      coTravellerData.lastName,
      coTravellerData.gender,
      coTravellerData.dateOfBirth,
      coTravellerData.nationality,
      coTravellerData.relationship,
      coTravellerData.mealPreference,
      coTravellerData.trainBerthPreference,
      coTravellerData.passportNo,
      coTravellerData.passportExpiryDate,
      coTravellerData.issuingCountry,
      coTravellerData.mobile,
      coTravellerData.email,
      coTravellerId,
      userId
    ]
  );

  if (result.affectedRows === 0) {
    throw makeServiceError('Co-traveller not found', 404);
  }

  const [rows] = await pool.query(
    `
      SELECT
        id,
        first_name AS firstName,
        last_name AS lastName,
        gender,
        date_of_birth AS dateOfBirth,
        nationality,
        relationship,
        meal_preference AS mealPreference,
        train_berth_preference AS trainBerthPreference,
        passport_no AS passportNo,
        passport_expiry_date AS passportExpiryDate,
        issuing_country AS issuingCountry,
        mobile,
        email
      FROM co_travellers
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `,
    [coTravellerId, userId]
  );

  return mapCoTravellerRow(rows[0]);
};

export const deleteCoTravellerByUserId = async (userId, coTravellerId) => {
  const [result] = await pool.query(
    'DELETE FROM co_travellers WHERE id = ? AND user_id = ?',
    [coTravellerId, userId]
  );

  if (result.affectedRows === 0) {
    throw makeServiceError('Co-traveller not found', 404);
  }

  return { id: coTravellerId };
};
