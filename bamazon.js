var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "jinkim508",
    database: "bamazon_db"
});

var currentStocks = [];

function managerOp() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            message: "choose your options",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Sell Products"]
        }]).then(function (answer) {
            if (answer.choice === "View Products for Sale") {
                readProducts();
            };
            if (answer.choice === "View Low Inventory") {
                viewLowInv();
            };
            if (answer.choice === "Add to Inventory") {
                addInv();
            };
            if (answer.choice === "Add New Product") {
                addNew();
            };
            if (answer.choice === "Sell Products") {
                askUser();
            }
        })
};

function addNew() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "department_name",
                type: "input",
                message: "Which Department?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the item?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How Many?"
            }])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your item was added successfully!");

                    managerOp();
                }
            );
        });

}

function addInv() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which item?"
            },


            {
                name: "unit",
                type: "input",
                message: "how many?"
            }
        ]).then(function (answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                //console.log(results[i].product_id)
                if (results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                    console.log(chosenItem);
                    var newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.unit);
                    console.log("Added " + answer.unit + " to " + chosenItem.product_name + ": " + newQuantity);
                    if (answer.unit > 0) {
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    product_id: chosenItem.product_id
                                }
                            ],function (error) {
                                if (error) throw err;
                                readProducts();
                                //managerOp();
        
                            }
                        );
                    }
                    managerOp();
                }
            };
        })
    })
}

function viewLowInv() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        var lowStocks = [];
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 10) {
                lowStocks.push(res[i]);
                console.log(lowStocks[i].product_id + " | " + lowStocks[i].product_name + " | " + lowStocks[i].department_name + " | " + lowStocks[i].price + " | " + lowStocks[i].stock_quantity)
            };

        }

        managerOp();

    });
}

function readProducts() {
    currentStocks = [];
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            currentStocks.push(res[i]);
            //console.log(currentStocks[i])
            console.log(currentStocks[i].product_id + " | " + currentStocks[i].product_name + " | " + currentStocks[i].department_name + " | " + currentStocks[i].price + " | " + currentStocks[i].stock_quantity);
        }
        //connection.end();
        managerOp();

    });
};

function askUser() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which item?"
            },


            {
                name: "unit",
                type: "input",
                message: "how many?"
            }
        ]).then(function (answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                //console.log(results[i].product_id)
                if (results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                    console.log(chosenItem);
                    var newQuantity = parseInt(chosenItem.stock_quantity) - parseInt(answer.unit);
                    //console.log(newQuantity);
                }
            };

            if (chosenItem.stock_quantity >= parseInt(answer.unit)) {
                //console.log(chosenItem)
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            product_id: chosenItem.product_id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        var totalCost = (chosenItem.price) * parseInt(answer.unit)
                        console.log("Your total cost is " + totalCost)
                        readProducts();
                        //managerOp();

                    }
                );
            }
            else {
                console.log("Not enough quantities");
                //readProducts();
                askUser();
            }
        });
    });

}
managerOp();


