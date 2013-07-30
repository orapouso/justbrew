
/**
 * Home Controller
 */
exports.index = function (req, res) {
  res.render('home/index', { title: 'Justbrew' });
};

exports.login = function (req, res) {
  res.render('home/login', { title: 'Justbrew', message: '' });
};
