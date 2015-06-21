var express = require('express');
var router = express.Router();

var models  = require('../models');

var Promise = require("bluebird");

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/main-dashboard', function(req, res) {
    models.Account.all().then(function(accounts) {
        res.render('dashboard_main', {accounts: accounts});
    });
});

router.post('/add-account', function(req, res) {
    models.Account
        .build({financialInstitution: req.body.financial_institution,
                name: req.body.name,
                currency: req.body.currency,
                type: req.body.type,
                amount: parseInt(req.body.amount)})
        .save()
        .then(function() {
            res.redirect('/main-dashboard');
        });
});

router.get('/account-details', function(req, res) {
//    account.getAllAccounts(function(err, results) {
//        if(err) {
//            console.log("ROUTER: ERROR " + JSON.stringify(err));
//            res.render('account_details', {
//                accounts: null,
//                account: null,
//                transactionTypes: null,
//                budgets: null,
//                transactions: null
//            });
//        } else {
//            account.getAccountById(req.param('accountId'), function(err, result) {
//                if(err) {
//                    console.log("ROUTER: ERROR " + JSON.stringify(err));
//                    res.render('account_details', {
//                        accounts: results,
//                        account: null,
//                        transactionTypes: null,
//                        budgets: null,
//                        transactions: null
//                    });
//                }
//                if(result) {
//                    transactionType.getAllTransactionTypes(function(err, transactionTypes) {
//                       if(!err) {
//                           budget.getAllBudgets(function(err, budgets) {
//                              if(!err) {
//                                  transaction.getTransactionsByAccountId(req.param('accountId'), function(err, transactions) {
//                                      if(!err) {
//                                          prettyfiTransaction(transactions).then(function(prettyTransactions) {
//                                              console.log("***" + JSON.stringify(prettyTransactions));
//                                              for(var i=0; i<prettyTransactions.length; i++) {
//                                                  if(prettyTransactions[i]) {
//                                                      var prettyTransactionsRet = prettyTransactions[i];
//                                                      return prettyTransactionsRet;
//                                                  }
//                                              }
//                                          }).then(function(prettyTransactions) {
//                                              res.render('account_details', {
//                                                  accounts: results,
//                                                  account: result[0],
//                                                  transactionTypes: transactionTypes,
//                                                  budgets: budgets,
//                                                  transactions: prettyTransactions
//                                              });
//                                          });
//                                      } else {
//                                          console.log(JSON.stringify(err));
//                                          res.render('account_details', {
//                                              accounts: results,
//                                              account: result[0],
//                                              transactionTypes: transactionTypes,
//                                              budgets: budgets,
//                                              transactions: null
//                                          });
//                                      }
//                                  });
//                              } else {
//                                  console.log(JSON.stringify(err));
//                                  res.render('account_details', {
//                                      accounts: results,
//                                      account: result[0],
//                                      transactionTypes: transactionTypes,
//                                      budgets: null,
//                                      transactions: null
//                                  });
//                              }
//                           });
//                       } else {
//                           res.render('account_details', {
//                               accounts: results,
//                               account: result[0],
//                               transactionTypes: null,
//                               budgets: null,
//                               transactions: null
//                           });
//                       }
//                    });
//                }
//            });
//        }
//    });

    models.Account.findAll({
        where: {
            id: req.param('accountId')
        },
        include: [models.Transaction]
    }).then(function(account) {
        res.render('account_details', {
                       accounts: null,
                       account: account,
                       transactionTypes: null,
                       budgets: null,
                       transactions: null
                   });
    });

});

router.post('/insert-transaction', function(req, res) {
    transaction.createTransaction(req, function(err, response) {
       if(!err) {
           account.getAccountById(req.body.account_type, function(err, accountRes) {
               if(req.body.transaction_type == "1") {
                   var newAmount = parseInt(accountRes[0].amount) - parseInt(req.body.amount);
               } else if(req.body.transaction_type == "2") {
                   var newAmount = parseInt(accountRes[0].amount) + parseInt(req.body.amount);
               }
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

router.get('/test', function(req, res) {
    transaction.getTransactions(function(err, transactions) {
       prettyfiTransaction(transactions).then(function(prettyTransactions) {
          console.log("***" + JSON.stringify(prettyTransactions));
       });
    });
});

module.exports = router;
