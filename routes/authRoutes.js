const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, addCard, checkUniqueness, getCardMembers, checkUser, books, addRent, getRentals, getEmployee, addEmp, addEmployee, getid, getNotifications, deleteNotifications, checkEmployee, changeNotice, removeEmployee, getNotice } = require('../controllers/authControllers');

router.use(
    cors({
        credentials : true,
        origin : 'http://localhost:3000'
    })
);

router.get('/',test);
router.get('/getEmployee',getEmployee);
router.get('/getid',getid);
router.get('/getNotice',getNotice);
router.get('/getNotifications',getNotifications);
router.post('/deleteNotifications', deleteNotifications);
router.post('/checkEmployee',checkEmployee);
router.post('/changeNotice',changeNotice);
router.post('/removeEmployee',removeEmployee);
// router.get('/getCardMembers',getCardMembers);
// router.get('/books',books);
// router.get('/getRentals',getRentals);
router.post('/addEmployee',addEmployee);
// router.post('/addCard',addCard);
// router.post('/checkUniqueness',checkUniqueness);
// router.post('/addRent',addRent);


module.exports = router;
