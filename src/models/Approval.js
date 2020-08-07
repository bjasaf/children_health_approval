const mongoose = require("mongoose");
const autoIncrementModelID = require('./counterModel');

const Schema = mongoose.Schema;

let approval = new Schema(
    {
        id: {type: Number},
        child_name: {type: String, required: true},
        child_id: {type: String, required: true},
        group: {type: String, required: true},
        parent_name: {type: String, required: true},
        phone: {type: String, required: true},
        temperature: {type: Number, required: true},
        date: {type: String, required: true}
    },
    {collection: "Approvals", timestamps: true}
);

approval.pre('save', function (next) {
    if (!this.isNew) {
        next();
        return;
    }

    autoIncrementModelID('approvals', this, next);
});


module.exports = mongoose.model("approvals", approval);
