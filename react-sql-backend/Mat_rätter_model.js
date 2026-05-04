const pool = require('./db')

const getDishes = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM public.Mat_Ratter ORDER BY matNamn ASC', (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results.rows);
    });
  });
};

const createDish = (body) => {
  return new Promise(function(resolve, reject) {
    const { matNamn, matPrice, matRating, matDesc } = body;
    
    if (!matNamn || !matPrice) {
      reject(new Error('matNamn och matPrice är obligatoriska'));
      return;
    }
    
    if (matRating && (matRating < 1 || matRating > 5 || !Number.isInteger(matRating))) {
      reject(new Error('matRating måste vara ett heltal mellan 1 och 5'));
      return;
    }
    
    pool.query(
      'INSERT INTO public.Mat_Ratter (matNamn, matPrice, matRating, matDesc) VALUES ($1, $2, $3, $4) RETURNING *',
      [matNamn, matPrice, matRating || null, matDesc || null],
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

const deleteDish = (request) => {
  return new Promise(function(resolve, reject) {
    const { matNamn } = request.params;
    
    if (!matNamn) {
      reject(new Error('matNamn saknas'));
      return;
    }
    
    pool.query(
      'DELETE FROM public.Mat_Ratter WHERE matNamn = $1 RETURNING *',
      [matNamn],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (results.rowCount === 0) {
          reject(new Error(`Ingen maträtt hittades med namnet: ${matNamn}`));
          return;
        }
        
        resolve({
          message: `Maträtt borttagen: ${matNamn}`,
          deletedDish: results.rows[0]
        });
      }
    );
  });
};

const updateDish = (request) => {
  return new Promise(function(resolve, reject) {
    const { matNamn } = request.params;
    const { matPrice, matRating, matDesc } = request.body;
    
    if (!matNamn) {
      reject(new Error('matNamn saknas i URL:en'));
      return;
    }
    
    if (matRating && (matRating < 1 || matRating > 5 || !Number.isInteger(matRating))) {
      reject(new Error('matRating måste vara ett heltal mellan 1 och 5'));
      return;
    }
    
    pool.query(
      'UPDATE public.Mat_Ratter SET matPrice = COALESCE($2, matPrice), matRating = COALESCE($3, matRating), matDesc = COALESCE($4, matDesc) WHERE matNamn = $1 RETURNING *',
      [matNamn, matPrice || null, matRating || null, matDesc || null],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        
        if (results.rowCount === 0) {
          reject(new Error(`Ingen maträtt hittades med namnet: ${matNamn}`));
          return;
        }
        
        resolve(results.rows[0]);
      }
    );
  });
};