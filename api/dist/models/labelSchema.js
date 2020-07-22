"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const labelSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        default: "General",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
labelSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "labels",
});
labelSchema.plugin(mongoose_unique_validator_1.default);
exports.default = labelSchema;