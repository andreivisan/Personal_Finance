var express = require('express');
var router = express.Router();

var account = require("../account_module/account");
var transactionType = require("../transaction_type/transactionType");
var budget = require("../budget/budget");
var transaction = require("../transaction/transaction");

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

router.get('/account-details', function(req, res) {
    account.getAllAccounts(function(err, results) {
        if(err) {
            console.log("ROUTER: ERROR " + JSON.stringify(err));
            res.render('account_details', {
                accounts: null,
                account: null,
                transactionTypes: null,
                budgets: null
            });
        } else {
            account.getAccountById(req.param('accountId'), function(err, result) {
                if(err) {
                    console.log("ROUTER: ERROR " + JSON.stringify(err));
                    res.render('account_details', {
                        accounts: results,
                        account: null,
                        transactionTypes: null,
                        budgets: null
                    });
                }
                if(result) {
                    transactionType.getAllTransactionTypes(function(err, transactionTypes) {
                       if(!err) {
                           budget.getAllBudgets(function(err, budgets) {
                              if(!err) {
                                  res.render('account_details', {
                                      accounts: results,
                                      account: result[0],
                                      transactionTypes: transactionTypes,
                                      budgets: budgets
                                  });
                              }
                           });
                       }
                    });
                } else {
                    res.render('account_details', {
                        accounts: results,
                        account: null,
                        transactionTypes: null,
                        budgets: null
                    });
                }

            });
        }
    });
});

router.post('/insert-transaction', function(req, res) {
    transaction.createTransaction(req, function(err, response) {
       if(!err) {
           account.getAccountById(req.body.account_type, function(err, accountRes) {
               var newAmount = parseInt(accountRes[0].amount) - parseInt(req.body.amount);
               console.log("ROUTER: new amount is: " + newAmount);
               account.updateAccountAmount(req.body.account_type, newAmount, function(err, updateResponse) {
                  if(!err) {
                      res.redirect('/account-details?accountId=' + req.body.account_type);
                  } else {
                      console.log(JSON.stringify(err));
                      res.redirect('/account-details?accountId=' + req.body.account_type);
                  }
               });
           });
       } else {
           console.log(JSON.stringify(err));
           res.redirect('/account-details?accountId=' + req.body.account_type);
       }
    });
})

module.exports = router;
