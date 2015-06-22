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
        .build({
            financialInstitution: req.body.financial_institution,
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
                    accountDetailsResponse.transactions = account[0].Transactions;
                    decorateTransactionList(accountDetailsResponse.transactions).then(function(decoratedTransactions) {
                        console.log("=======> decorated tx: " + JSON.stringify(decoratedTransactions));
                        accountDetailsResponse.transactions = decoratedTransactions;
                        res.render('account_details', {accountDetailsResponse: accountDetailsResponse});
                    });
                });
            });
        });
    });
});

function decorateTransactionList(transactions) {
    return Promise.map(transactions, function(transaction) {
        return transaction.getBudget().then(function(budget) {
            transaction.BudgetId = budget.name;
            return transaction.getTransactionType().then(function(transactionType) {
                transaction.TransactionTypeId = transactionType.type;
                return transaction;
            });
        });
    });
}

router.post('/insert-transaction', function(req, res) {
    models.Transaction
        .build({
            description: req.body.description,
            amount: parseInt(req.body.amount),
            BudgetId: parseInt(req.body.budget),
            date: new Date(req.body.date).toISOString().slice(0, 19).replace('T', ' '),
            AccountId: parseInt(req.body.account_type),
            TransactionTypeId: parseInt(req.body.transaction_type)})
        .save()
        .then(function() {
            res.redirect('/account-details?accountId=' + req.body.account_type);
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
