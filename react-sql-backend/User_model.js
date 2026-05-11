const pool = require('./db');
const bcrypt = require('bcryptjs');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getUser = async () => {
  try {
    const result = await pool.query('SELECT * FROM public.Users ORDER BY userName ASC');
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

const getUserByName = async (userName) => {
  if (!userName) throw new Error('userName saknas');
  try {
    const result = await pool.query('SELECT * FROM public.Users WHERE userName = $1', [userName]);
    if (result.rows.length === 0) throw new Error(`Ingen användare hittades med userName: ${userName}`);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

const createUser = async (body) => {
  const { 
    userName, 
    firstName, 
    lastName, 
    phoneNum, 
    userMail, 
    userAdress, 
    password,
    user_is_premium, 
    user_is_admin 
  } = body;

  if (!userName || !userMail || !firstName || !lastName || !userAdress || !password) {
    throw new Error('userName, userMail, firstName, lastName, userAdress och password är obligatoriska');
  }

  if (!validateEmail(userMail)) {
    throw new Error('Invalid email format');
  }

  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText =
      'INSERT INTO public.Users (userName, firstName, lastName, phoneNum, userMail, userAdress, passwords, user_is_premium, user_is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
    const result = await pool.query(
      queryText,
      [
        userName,
        firstName,
        lastName,
        phoneNum,
        userMail,
        userAdress,
        hashedPassword,
        user_is_premium || false,
        user_is_admin || false,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

const deleteUser = async (userName) => {
  if (!userName) throw new Error('userName saknas');

  try {
    const result = await pool.query(
      'DELETE FROM public.Users WHERE userName = $1 RETURNING *',
      [userName]
    );
    
    if (result.rowCount === 0) {
      throw new Error(`Ingen användare hittades med userName: ${userName}`);
    }
    
    return {
      message: `Användare borttagen: ${userName}`,
      deletedUser: result.rows[0]
    };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

const updateUser = async (userName, body) => {
  if (!userName) throw new Error('userName saknas');

  const { firstName, lastName, phoneNum, userMail, userAdress, user_is_premium, user_is_admin } = body;

  if (userMail && !validateEmail(userMail)) {
    throw new Error('Invalid email format');
  }

  try {
    const result = await pool.query(
      `UPDATE public.Users SET 
        firstName = COALESCE($2, firstName),
        lastName = COALESCE($3, lastName),
        phoneNum = COALESCE($4, phoneNum),
        userMail = COALESCE($5, userMail),
        userAdress = COALESCE($6, userAdress),
        user_is_premium = COALESCE($7, user_is_premium),
        user_is_admin = COALESCE($8, user_is_admin)
      WHERE userName = $1 RETURNING *`,
      [userName, firstName || null, lastName || null, phoneNum || null, userMail || null, userAdress || null, user_is_premium || null, user_is_admin || null]
    );
    
    if (result.rowCount === 0) {
      throw new Error(`Ingen användare hittades med userName: ${userName}`);
    }
    
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

module.exports = {
  getUser,
  getUserByName,
  createUser,
  deleteUser,
  updateUser
};


