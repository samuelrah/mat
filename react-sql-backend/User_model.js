const pool = require('./db')

const getUser = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM public.Users ORDER BY userName ASC', (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results.rows);
    });
  });
};
const createUser = (body) => {
  return new Promise(function(resolve, reject) {
    const { 
      userName, 
      firstName, 
      lastName, 
      phoneNum, 
      userMail, 
      userAdress, 
      user_is_premium, 
      user_is_admin 
    } = body;


    if (!userName || !userMail || !firstName || !lastName || !userAdress) {
      reject(new Error('userName, userMail, firstName, lastName och userAdress är obligatoriska'));
      return;
    }

    pool.query(
      'INSERT INTO public.Users (userName, firstName, lastName, phoneNum, userMail, userAdress, user_is_premium, user_is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userName, firstName, lastName, phoneNum, userMail, userAdress, user_is_premium, user_is_admin],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results.rows[0]);
      }
    );
  });
};
const deleteUser = (request) => {
  return new Promise(function(resolve, reject) {
    const { userName } = request.params;
    
    if (!userName) {
      reject(new Error('userName saknas'));
      return;
    }

    pool.query(
      'DELETE FROM public.Users WHERE userName = $1 RETURNING *',
      [userName], 
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (results.rowCount === 0) {
          reject(new Error(`Ingen användare hittades med userName: ${userName}`));
          return;
        }
        
        resolve({
          message: `Användare borttagen: ${userName}`,
          deletedUser: results.rows[0]
        });
      }
    );
  });
};

module.exports = {
  getUser,
  createUser,
  deleteUser,
}


