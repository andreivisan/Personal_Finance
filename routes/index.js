var express = require('express');
var router = express.Router();

var account = require("../account_module/account")

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/main-dashboard', function(req, res) {
    account.getAllAccounts(function(err, results) {
        if(err) {
            console.log("ROUTER: ERROR " + JSON.stringify(err));
            res.render('dashboard_main', {accounts: null});
        } else {
            res.render('dashboard_main', {accounts: results});
        }
    });
});

router.post('/add-account', function(req, res) {
    account.createAccount(req, function(err, result) {
       if(err) {
           console.log("ROUTER: ERROR " + JSON.stringify(err));
           res.render('dashboard_main', {accounts: null});
       } else {
           console.log("ROUTER: ACCOUNT ADD RESULT " + JSON.stringify(result));
           account.getAllAccounts(function(err, results) {
               if(err) {
                   console.log("ROUTER: ERROR " + JSON.stringify(err));
                   res.render('dashboard_main', {accounts: null});
               } else {
                   res.render('dashboard_main', {accounts: results});
               }
           });
       }
    });
});

module.exports = router;
