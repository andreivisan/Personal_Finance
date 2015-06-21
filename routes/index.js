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
    var accountDetailsResponse = {
        accounts: null,
        account: null,
        budgets: null,
        transactions: null,
        transactionTypes: null
    }

    models.Account.all().then(function(accounts) {
        accountDetailsResponse.accounts = accounts;
        return accountDetailsResponse;
    }).then(function(accountDetailsResponse) {
        models.Budget.all().then(function(budgets) {
            accountDetailsResponse.budgets = budgets;
            return accountDetailsResponse;
        }).then(function(accountDetailsResponse) {
            models.TransactionType.all().then(function(transactionTypes){
                accountDetailsResponse.transactionTypes = transactionTypes;
                return accountDetailsResponse;
            }).then(function(accountDetailsResponse){
                models.Account.findAll({
                    where: {
                        id: req.param('accountId')
                    },
                    include: [models.Transaction]
                }).then(function(account) {
                    accountDetailsResponse.account = account;
                    accountDetailsResponse.transactions - account.Transactions;
                    console.log("=======> ACCOUNT DETAILS RESPONSE: " + JSON.stringify(accountDetailsResponse));
                    res.render('account_details', {accountDetailsResponse: accountDetailsResponse});
                });
            });
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
