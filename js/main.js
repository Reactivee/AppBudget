let budgetController = (() => {
    let Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.persentage = -1;
    };
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };


    Expenses.prototype.calcPersentage = function (totalInc) {
        if (totalInc > 0) {
            this.persentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.persentage = -1;
        }
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        persent: -1
    }
    calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach(item => {
            sum += item.value;
        })
        data.totals[type] = sum;
    }

    return {
        sendExp: () => {
            return {
                Exp: data.allItems.exp
            }
        },

        addItem: (type, des, val) => {
            let newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0;
            }
            if (type == "exp") {
                newItem = new Expenses(ID, des, val)
            } else if (type == "inc") {
                newItem = new Income(ID, des, val)
            }
            data.allItems[type].push(newItem);

            return newItem
        },
        deleteItemStorage: (type, id) => {
            let index, ids;
            ids = data.allItems[type].map(item => {
                return item.id
            })
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: () => {
            calculateTotal("exp");
            calculateTotal("inc");

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.persent = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.persent = -1;
            }
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                persentage: data.persent
            }
        },

        calculatePersentages: () => {
            data.allItems.exp.forEach(item => {
                item.calcPersentage(data.totals.inc)
            })
        },

        getLabelPersentages: () => {
            let allPersent = data.allItems.exp.map(item => {
                item.persentage;
            })
            return allPersent
        },

        // consoling: () => {
        //     data.allItems.exp.forEach(item => {
        //         console.log(item.allpersent);
        //     })
        // }
    }

})();


let UIcontroller = (() => {

    let DOMstrings = {
        inputType: ".in-exp-btn",
        inputDescription: ".add-descri",
        inputValue: ".add-summ",
        inputSubmit: ".submit",
        inputIncome: ".items-income",
        inputExpen: ".items-expen",
        totalLabel: ".summ",
        incomeLabel: ".in-exp",
        expenLabel: ".expen-sum",
        expenPersentLabel: ".exp-persent_top",
        mainPart: ".information",
        labelPersent: ".exp-persent",
        dataLabel: ".top_title"
    }

    let formatNumburs = (num, type) => {
        let numSplit, int, dec, intLength;
        num = num.toFixed(2);
        numSplit = num.split(".");

        int = numSplit[0];
        intLength = int.length
        dec = numSplit[1];
        console.log(intLength, dec)

        if (intLength > 3) {
            switch (intLength) {
                case 7:
                    int = int.substr(0, 1) + "," + int.substr(1, 3) + "," + int.substr(intLength - 3, intLength) + "." + dec;
                    break;
                case 8:
                    int = int.substr(0, 2) + "," + int.substr(2, 3) + "," + int.substr(intLength - 3, intLength) + "." + dec;
                    break;

                case 9:
                    int = int.substr(0, 3) + "," + int.substr(3, 3) + "," + int.substr(intLength - 3, intLength) + "." + dec;
                    break;

                default:
                    int = int.substr(0, intLength - 3) + "," + int.substr(intLength - 3, intLength) + "." + dec;

            }
        }
        return int

    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDOMstrings: () => {
            return DOMstrings
        },
        addListItem: (obj, type) => {
            let html, newHtml, Parentelement;

            if (type === "exp") {
                Parentelement = DOMstrings.inputExpen;
                html = `<li class="item-exp item-inexp"   id = "exp-%id%">
                <span class="name-item">%description%</span>
                <div class="summ-persent">
                    <div class="summ-item">%value%</div>
                    <span class="exp-persent">25</span>
                    <button class="close"><i class="fa fa-close"></i></button>
                </div>
            </li>`

            } else if (type === "inc") {
                Parentelement = DOMstrings.inputIncome;
                html = `<li class="item-income item-inexp" id = "inc-%id%">
                <span class="name-item">%description%</span>
                <div class="summ-persent">
                    <div class="summ-item">%value%</div>
                    <button class="close"><i class="fa fa-close"></i></button>
                </div>
            </li>`
            }
            newHtml = html.replace("%id%", obj.id)
            newHtml = newHtml.replace("%description%", obj.description)
            newHtml = newHtml.replace("%value%", formatNumburs(obj.value, type))
            // newHtml = newHtml.replace("%persent%", persent.persentage)

            document.querySelector(Parentelement).insertAdjacentHTML('beforeend', newHtml)
        },
        clearFields: () => {
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(element => {
                element.value = "";
            });
            fieldsArr[0].focus();
            return fieldsArr
        },
        displayBudget: (obj) => {
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenLabel).textContent = obj.totalExp;
            document.querySelector(DOMstrings.totalLabel).textContent = obj.budget;

            if (obj.persentage > 0) {
                document.querySelector(DOMstrings.expenPersentLabel).textContent = obj.persentage + "%";
            } else {
                document.querySelector(DOMstrings.expenPersentLabel).textContent = "---";
            }
        },
        deleteListItem: (selecId) => {
            let element = document.getElementById(selecId);
            element.parentNode.removeChild(element);
        },
        displayLabelPersent: () => {
            let alllabel = document.querySelectorAll(DOMstrings.labelPersent);
            let allPersent = budgetController.sendExp();
            // console.log(allPersent.Exp)
            for (let index = 0; index < alllabel.length; index++) {
                alllabel[index].textContent = allPersent.Exp[index].persentage + "%";
            }
        },
        dataLabel: () => {
            let year, month, date, now, months = [];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            date = now.getUTCDate();
            months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', "Dekabr"]
            document.querySelector(DOMstrings.dataLabel).textContent = date + " " + months[month] + " " + year;
        }

    }


})();


let controller = ((budgetCtrl, UIctrl) => {

    setupEventlistener = () => {
        let DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputSubmit).addEventListener("click", ctrlAddItem)

        document.querySelector(DOM.inputSubmit).addEventListener("keypress", (event) => {
            if (event.keyCode == 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.mainPart).addEventListener("click", deleteItem);
    };

    updateBudjet = () => {
        // Calculate budget
        budgetCtrl.calculateBudget();
        // return budget
        let budget = budgetCtrl.getBudget();
        // console.log(budget)
        // display UI 
        UIctrl.displayBudget(budget);
    };
    updatePersentage = () => {
        // Calculate budget
        budgetCtrl.calculatePersentages();

        // read from budget controll
        // let persentages = budgetCtrl.getLabelPersentages();

        // display label persent
        UIctrl.displayLabelPersent()
    }

    ctrlAddItem = () => {
        let input, newItem;
        //1.Get input data
        // let budget = budgetCtrl.getBudget();
        input = UIctrl.getInput();

        if (input.description !== "" && input.value > 0 && !isNaN(input.value)) {
            //2.Add item to budgetcontroller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            //3.Add item  to the UI
            UIctrl.addListItem(newItem, input.type);
            // Clear input
            UIctrl.clearFields()

            //4.Calculate budget
            updateBudjet();
            // budgetCtrl.consoling();

            // Update persentage
            updatePersentage()

        } else {
            alert("No input elements/ or wrong ")
        }
        //5.Display the budget on the UI   

    }
    deleteItem = (event) => {
        let itemID, type, splitID, ID;
        itemID = event.target.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split("-");
            ID = parseInt(splitID[1]);
            type = splitID[0];
        }

        // console.log(itemID) 
        budgetCtrl.deleteItemStorage(type, ID);

        UIctrl.deleteListItem(itemID);

        updateBudjet();

        updatePersentage();
    }

    return {
        init: () => {
            setupEventlistener();
            UIctrl.dataLabel();
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                persentage: 0,
            });

        }
    }

})(budgetController, UIcontroller);

controller.init();

