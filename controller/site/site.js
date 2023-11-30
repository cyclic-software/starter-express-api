export const homepage = async (req, res, next) => {
  try {
    res.send('welcome to luckybuystore homepage');
  } catch (err) {
    next(err);
  }
};
