var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/main-dashboard', function(req, res) {
    res.render('dashboard_main');
});

module.exports = router;
