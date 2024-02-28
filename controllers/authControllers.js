const db = require('../Database/mySql');
const { format, getDayOfYear } = require('date-fns');

const test = (req, res) => {
    res.json("Test Working");
}

const getEmployee = (req, res) => {
    let sql = "SELECT * From emp_details";
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);

        })
    } catch (error) {
        console.log(error);
    }
}

// const addEmployee = (req, res) => {
//     const { id, name, dept, desig, dob, gender, salary } = req.body;
//     let sql = "INSERT into emp_details ( id, name, dept, desig, dob, gender, salary ) VALUES (?,?,?,?,?,?,?)";
//     let values = [id, name, dept, desig, dob, gender, salary];
//     console.log(values);
//     try {
//         db.query(sql, values, (err) => {
//             if (err) throw err;
//             res.json("Book added to DB Sucessfully")
//             console.log("Book added to DB sucessfully");
//         })
//     } catch (error) {
//         console.log(error);
//         res.json("Error occured while adding record");
//     }
// }

const addEmployee = (req, res) => {
    const { id, name, dept, desig, dob, gender, salary, notice, days, email, password } = req.body;
    const notificationMessage = `Employee of ID ${id} is added to DB successfully`;
    const currentTime = new Date();
    const formattedTime = format(currentTime, 'dd-MM-yyyy hh:mm:ss aa');
    console.log(formattedTime);
    const status = "unread";
    let empSql = "INSERT INTO emp_details (id, name, dept, desig, dob, gender, salary, notice, days, email, password) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    let empValues = [id, name, dept, desig, dob, gender, salary, notice, days, email, password];

    let notificationSql = "INSERT INTO notifications (alert, time, status) VALUES (?, ?, ?)";
    let notificationValues = [notificationMessage, formattedTime, status];

    try {
        db.beginTransaction(err => {
            if (err) throw err;
            db.query(empSql, empValues, (err, empResult) => {
                if (err) {
                    db.rollback(() => {
                        console.error("Error inserting employee details:", err);
                        res.status(500).json("Error occurred while adding employee");
                    });
                } else {
                    db.query(notificationSql, notificationValues, (err, notificationResult) => {
                        if (err) {
                            db.rollback(() => {
                                console.error("Error inserting notification:", err);
                                res.status(500).json("Error occurred while adding notification");
                            });
                        } else {
                            db.commit((err) => {
                                if (err) {
                                    db.rollback(() => {
                                        console.error("Error committing transaction:", err);
                                        res.status(500).json("Error occurred while committing transaction");
                                    });
                                } else {
                                    res.json("Employee added to DB successfully");
                                    console.log("Employee added to DB successfully");
                                }
                            });
                        }
                    });
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json("Error occurred while adding record");
    }
}


const getid = (req, res) => {
    let sql = 'SELECT MAX(id) as last_id FROM emp_details';
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;
            const lastId = results[0].last_id || 0;
            res.json(lastId + 1);
        });
    } catch (error) {
        console.log(error);
    }
};



const getNotifications = (req, res) => {
    let sql = "SELECT * From notifications";
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        })
    } catch (error) {
        console.log(error);
    }
}

const deleteNotifications = (req, res) => {
    let sql = "DELETE FROM notifications";
    try {
        db.query(sql, (err) => {
            if (err) throw err;
            res.json("Deleted Notifications Successfully");
        })
    } catch (error) {
        console.log(error);
    }
}

const checkEmployee = (req, res) => {
    const id = req.body.id;
    let sql = "SELECT * From emp_details WHERE id = ?";
    try {
        db.query(sql, [id], (err, results) => {
            if (err) throw err;
            res.json(results);
        })
    } catch (error) {
        console.log(error);
    }
}

const changeNotice = (req, res) => {
    const { id, days } = req.body;
    const sql = `UPDATE emp_details SET notice = 'yes', days = ?, notice_day = ? WHERE id = ?`;
    const notificationMessage = `Notice Period for Employee of ID ${id} Assigned Successfully`;
    const status = "unread";
    const currentTime = new Date();
    const formattedTime = format(currentTime, 'dd-MM-yyyy hh:mm:ss aa');
    const formatteddate = format(currentTime, 'dd-MM-yyyy')
    let notificationSql = "INSERT INTO notifications (alert, time, status) VALUES (?, ?, ?)";
    let notificationValues = [notificationMessage, formattedTime, status];
    db.beginTransaction(err => {
        if (err) {
            console.error("Error beginning transaction:", err);
            res.status(500).send('An error occurred while updating employee status');
            return;
        }
        db.query(sql, [days, formatteddate, id], (err) => {
            if (err) {
                db.rollback(() => {
                    console.error("Error updating employee status:", err);
                    res.status(500).send('An error occurred while updating employee status');
                });
                return;
            }
            db.query(notificationSql, notificationValues, (err) => {
                if (err) {
                    db.rollback(() => {
                        console.error("Error inserting notification:", err);
                        res.status(500).send('An error occurred while adding notification');
                    });
                    return;
                }
                db.commit((err) => {
                    if (err) {
                        db.rollback(() => {
                            console.error("Error committing transaction:", err);
                            res.status(500).send('An error occurred while committing transaction');
                        });
                        return;
                    }
                    console.log('Employee status updated successfully');
                    res.status(200).send('Employee status updated successfully');
                });
            });
        });
    });
};

const removeEmployee = (req, res) => {
    const id = req.body.id;
    const sql = `DELETE FROM emp_details WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while removing employee');
        } else {
            console.log('Employee removed successfully');
            res.status(200).send('Employee removed successfully');
        }
    });
};

const getNotice = (req,res) => {
    let sql = "SELECT * From emp_details WHERE notice = 'yes'";
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results);
        })
    } catch (error) {
        console.log(error);
    }
}

// const addCard = (req, res) => {
//     const { card_no, name, email, contact, aadhar_no, dom } = req.body;
//     console.log(dom,"iii");
//     let sql = "INSERT into library_cards ( card_no, name, email, contact, aadhar_no, dom ) VALUES (?,?,?,?,?,?)";
//     let values = [card_no, name, email, contact, aadhar_no, dom];
//     console.log(values);
//     try {
//         db.query(sql, values, (err) => {
//             if (err) throw err;
//             res.json("Book added to DB Sucessfully")
//             console.log("Book added to DB sucessfully");
//         })
//     } catch (error) {
//         console.log(error);
//         res.json("Error occured while adding record");
//     }
// }

// const checkUniqueness = (req, res) => {
//     const card_no = req.body.card_no;
//     let sql = "SELECT * FROM library_cards WHERE card_no = ?"
//     db.query(sql, [card_no], (error, results, fields) => {
//         if (error) {
//             console.error('Error executing MySQL query:', error);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         if (results.length > 0) {
//             return res.json("not-unique");
//         }
//         return res.json("unique");
//     });

// }

// const getCardMembers = (req, res) => {
//     let sql = "SELECT * From library_cards";
//     try {
//         db.query(sql, (err, results) => {
//             if (err) throw err;
//             res.json(results);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// const books = (req,res) => {
//     let sql = "SELECT title From books";
//     try {
//         db.query(sql, (err, results) => {
//             if (err) throw err;
//             res.json(results);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// const addRent = (req, res) => {
//     const { card_no, name, email, contact, aadhar_no, book, date } = req.body;
//     let sql = "INSERT into rentals ( card_no, name, email, contact, aadhar_no, book_name, date ) VALUES (?,?,?,?,?,?,?)";
//     let values = [card_no, name, email, contact, aadhar_no, book, date];
//     try {
//         db.query(sql, values, (err) => {
//             if (err) throw err;
//             res.json("Book added to DB Sucessfully")
//             console.log("Book added to DB sucessfully");
//         })
//     } catch (error) {
//         console.log(error);
//         res.json("Error occured while adding record");
//     }
// }



module.exports = {
    test,
    getEmployee,
    addEmployee,
    getid,
    getNotifications,
    deleteNotifications,
    checkEmployee,
    changeNotice,
    removeEmployee,
    getNotice
    // addCard,
    // checkUniqueness,
    // getCardMembers,
    // books,
    // addRent,
    // getRentals
}
