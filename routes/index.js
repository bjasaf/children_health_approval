const express = require('express');
const { middleware } = require("../src/auth0");
const ApprovalModel = require("../src/models/Approval");
const stringify = require('csv-stringify');
const xlsx = require('xlsx');
const moment = require('moment');
const router = express.Router();

router.use(middleware);

router.get('/', function(req, res, next) {
  res.render('index', { teams: process.env.TEAMS.split(","), name: process.env.KINDERGARTEN_NAME });
});

router.post('/submit', async (req, res) => {
  const { child_name, child_id, group, parent_name, phone, temperature, date } = req.body;
  const approval = await ApprovalModel.create({ child_name, child_id, group, parent_name, phone, temperature, date });
  res.render('recieved', approval);
});

const users = process.env.ADMINS.split(",");
router.get('/children',async (req, res, next) => {
  if (!req.openid.user) return next({message: "עליכם להתחבר כדי לגשת לעמוד זה"});

  let email = req.openid.user.email;
  if (!users.includes(email)) {
    return next({message: "אינך מורשה להתחבר לעמוד זה"});
  }

  const approvals = await ApprovalModel.find({});
  res.render('children', { approvals, teams: process.env.TEAMS.split(",") });
});

router.get('/children-download',async (req, res, next) => {
  if (!req.openid.user) return next({message: "עליכם להתחבר כדי לגשת לעמוד זה"});

  let email = req.openid.user.email;
  if (!users.includes(email)) {
    return next({message: "אינך מורשה להתחבר לעמוד זה"});
  }

  const approvals = (await ApprovalModel.find({}))
      .map(x => x.toObject())
      .filter(x => x.id > 10000)
      .map(({id, child_name, child_id, temperature, group, parent_name, phone, date}) => ({
        "תז הילד/ה": `${child_id}`,
        "הילד/ה": `${child_name}`,
        "חום": `${temperature}`,
        "קבוצה": group,
        "ההורה": `${parent_name}`,
        "טלפון": `${phone}`,
        "תאריך": date,
        "מס׳ אישור": id
      }));

    const wb = xlsx.utils.book_new();
    var ws = xlsx.utils.json_to_sheet(approvals);
    xlsx.utils.book_append_sheet(wb, ws, "main");
    const wopts = {bookType: 'xlsx', bookSST: false, type: 'base64'};
    const buffer = xlsx.write(wb, wopts);
    res.set('Content-disposition', `attachment; filename="${moment().format("DD_MM_YYYY_hh_mm")}.xlsx"`);
    res.writeHead(200, [['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end(new Buffer(buffer, 'base64'));
});

module.exports = router;
