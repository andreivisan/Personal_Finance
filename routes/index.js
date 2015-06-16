var express = require('express');
var router = express.Router();

var account = require("../account_module/account");
var transactionType = require("../transaction_type/transactionType");
var budget = require("../budget/budget");
var transaction = require("../transaction/transaction");

var Promise = require("bluebird");

function prettyfiTransaction(transactions) {
    var prettyTransaction = {
        date: null,
        amount: null,
        description: null,
        budget: null,
        account: null,
        transactionType: null
    }

    var promises = [];

    var preetyTransactions = [];

    var index = 0;
    var arrayLength = transactions.length;

    transactions.forEach(function(transaction) {
        var itemResolver = Promise.defer();

        prettyTransaction.date = transaction.date;
        prettyTransaction.amount = transaction.amount;
        prettyTransaction.description = transaction.description;

        budget.getBudgetById(transaction.budget_id, function(err, budgetResp) {
            prettyTransaction.budget = budgetResp[0].name;
            account.getAccountById(transaction.account_id, function(err, accountResp) {
                prettyTransaction.account = accountResp[0].name;
                transactionType.getTransactionTypeById(transaction.transaction_type_id, function(err, transactionTypeRes) {
                    prettyTransaction.transactionType = transactionTypeRes[0].type;
                    preetyTransactions.push(prettyTransaction);
                    index++
                    if(index === arrayLength) {
                        itemResolver.resolve(preetyTransactions);
                    } else {
                        itemResolver.resolve();
                    }
                });
            });
        });

        promises.push(itemResolver.promise);
    });

    return Promise.all(promises);
}

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
                budgets: null,
                transactions: null
            });
        } else {
            account.getAccountById(req.param('accountId'), function(err, result) {
                if(err) {
                    console.log("ROUTER: ERROR " + JSON.stringify(err));
                    res.render('account_details', {
                        accounts: results,
                        account: null,
                        transactionTypes: null,
                        budgets: null,
                        transactions: null
                    });
                }
                if(result) {
                    transactionType.getAllTransactionTypes(function(err, transactionTypes) {
                       if(!err) {
                           budget.getAllBudgets(function(err, budgets) {
                              if(!err) {
                                  transaction.getTransactionsByAccountId(req.param('accountId'), function(err, transactions) {
                                      if(!err) {
                                          prettyfiTransaction(transactions).then(function(prettyTransactions) {
                                              console.log("***" + JSON.stringify(prettyTransactions));
                                              for(var i=0; i<prettyTransactions.length; i++) {
                                                  if(prettyTransactions[i]) {
                                                      var prettyTransactionsRet = prettyTransactions[i];
                                                      return prettyTransactionsRet;
                                                  }
                                              }
                                          }).then(function(prettyTransactions) {
                                              res.render('account_details', {
                                                  accounts: results,
                                                  account: result[0],
                                                  transactionTypes: transactionTypes,
                                                  budgets: budgets,
                                                  transactions: prettyTransactions
                                              });
                                          });
                                      } else {
                                          console.log(JSON.stringify(err));
                                          res.render('account_details', {
                                              accounts: results,
                                              account: result[0],
                                              transactionTypes: transactionTypes,
                                              budgets: budgets,
                                              transactions: null
                                          });
                                      }
                                  });
                              } else {
                                  console.log(JSON.stringify(err));
                                  res.render('account_details', {
                                      accounts: results,
                                      account: result[0],
                                      transactionTypes: transactionTypes,
                                      budgets: null,
                                      transactions: null
                                  });
                              }
                           });
                       } else {
                           res.render('account_details', {
                               accounts: results,
                               account: result[0],
                               transactionTypes: null,
                               budgets: null,
                               transactions: null
                           });
                       }
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
