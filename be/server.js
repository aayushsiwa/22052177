import bodyParser from "body-parser";
import { error } from "console";
import express from "express";
import { validate } from "uuid";

const app = express();
app.use(bodyParser.json());

const user="ayush"

let expenses = [];
let currId = 1;

const validation = (amt, date, cat, subCat, descr) => {
    if (amt <= 0) {
        const error = "Re-enter amount, it should be greater than 0";
    }
    if (Date.parse(date) > Date.now()) {
        const error = "Re-enter date, it should be not be a future date";
    }
    if (
        typeof cat != "string" ||
        typeof subCat != "string" ||
        typeof descr != "string"
    ) {
        const error =
            "Please enter string for category, sub-category and description";
    }
    return true;
};

app.post("/expenses", (req, res) => {
    // add validation
    const { amt, date, cat, subCat, descr } = req.body;
    // if (validate(amt, date, cat, subCat, descr) == true) {
    //     const newExpense = { id: currId++, amt, date, cat, subCat, descr };
    //     expenses.push(newExpense);
    //     res.status(201).json(newExpense);
    // } else {
    //     const err = validate(amt, date, cat, subCat, descr);
    //     res.status(400).json(err);
    // }
    const newExpense = { id: currId++, amt, date, cat, subCat, descr };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

app.get("/expenses", (req, res) => {
    res.status(201).json(expenses);
});

app.put("/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = expenses.findIndex((e) => e.id == id);
    expenses[index] = { ...expenses[index], ...req.body, id };
    res.json(expenses[index]);
});

app.delete("/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = expenses.findIndex((e) => e.id == id);
    expenses.pop(index);
    res.json(expenses);
});

app.get("/expenses/:cat/:subCat", (req, res) => {
    const cat = req.params.cat;
    const subCat = req.params.subCat;
    console.log(cat, subCat);
    const filtered = expenses.filter((e) => {
        e.cat == cat && e.subCat == subCat;
    });
    console.log(filtered);
    const total = filtered.reduce((sum, e) => sum + e.amt, 0);
    res.status(201).json({ filtered, total });
});

app.get("/expenses/:cat", (req, res) => {
    const cat = req.params.cat;
    const filtered = expenses.filter((e) => e.cat == cat);
    const total = filtered.reduce((sum, e) => sum + e.amt, 0);
    res.json({ filtered, total });
});

app.get("/expenses/byDate", (req, res) => {
    const { start, end } = req.query;
    const filtered = expenses.filter((e) => e.date <= end && e.date >= start);
    const total = filtered.reduce((sum, e) => {
        sum + e.amt, 0;
    });
    res.json({ filtered, total });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Running on port:${PORT}`);
});
