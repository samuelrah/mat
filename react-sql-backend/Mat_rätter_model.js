const pool = require('./db');

const validateRating = (rating) => {
  if (!rating) return true;
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

const getDishes = async () => {
  try {
    const result = await pool.query('SELECT * FROM public.Mat_Ratter ORDER BY matNamn ASC');
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch dishes: ${error.message}`);
  }
};

const getDishByName = async (matNamn) => {
  if (!matNamn) throw new Error('matNamn saknas');
  try {
    const result = await pool.query('SELECT * FROM public.Mat_Ratter WHERE matNamn = $1', [matNamn]);
    if (result.rows.length === 0) throw new Error(`Ingen maträtt hittades med namnet: ${matNamn}`);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to fetch dish: ${error.message}`);
  }
};

const createDish = async (body) => {
  const { matNamn, matPrice, matRating, matDesc } = body;
  
  if (!matNamn || !matPrice) {
    throw new Error('matNamn och matPrice är obligatoriska');
  }
  
  if (!validateRating(matRating)) {
    throw new Error('matRating måste vara ett heltal mellan 1 och 5');
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO public.Mat_Ratter (matNamn, matPrice, matRating, matDesc) VALUES ($1, $2, $3, $4) RETURNING *',
      [matNamn, matPrice, matRating || null, matDesc || null]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create dish: ${error.message}`);
  }
};

const deleteDish = async (matNamn) => {
  if (!matNamn) throw new Error('matNamn saknas');
  
  try {
    const result = await pool.query(
      'DELETE FROM public.Mat_Ratter WHERE matNamn = $1 RETURNING *',
      [matNamn]
    );
    
    if (result.rowCount === 0) {
      throw new Error(`Ingen maträtt hittades med namnet: ${matNamn}`);
    }
    
    return {
      message: `Maträtt borttagen: ${matNamn}`,
      deletedDish: result.rows[0]
    };
  } catch (error) {
    throw new Error(`Failed to delete dish: ${error.message}`);
  }
};

const updateDish = async (matNamn, body) => {
  const { matPrice, matRating, matDesc } = body;
  
  if (!matNamn) throw new Error('matNamn saknas i URL:en');
  
  if (!validateRating(matRating)) {
    throw new Error('matRating måste vara ett heltal mellan 1 och 5');
  }
  
  try {
    const result = await pool.query(
      'UPDATE public.Mat_Ratter SET matPrice = COALESCE($2, matPrice), matRating = COALESCE($3, matRating), matDesc = COALESCE($4, matDesc) WHERE matNamn = $1 RETURNING *',
      [matNamn, matPrice || null, matRating || null, matDesc || null]
    );
    
    if (result.rowCount === 0) {
      throw new Error(`Ingen maträtt hittades med namnet: ${matNamn}`);
    }
    
    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to update dish: ${error.message}`);
  }
};

module.exports = {
  getDishes,
  getDishByName,
  createDish,
  deleteDish,
  updateDish
};