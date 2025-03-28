"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const answerSchema = new mongoose_1.Schema({
    user: Object,
    answer: String,
}, { timestamps: true });
const replyReviewSchema = new mongoose_1.Schema({
    user: Object,
    reply: String,
}, { timestamps: true });
const reviewSChema = new mongoose_1.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [replyReviewSchema],
}, { timestamps: true });
const linkSchema = new mongoose_1.Schema({
    title: String,
    url: String,
});
const objectiveSchema = new mongoose_1.Schema({
    title: String,
});
const commentSchema = new mongoose_1.Schema({
    user: Object,
    question: String,
    questionReplies: [answerSchema],
}, { timestamps: true });
const courseDataSchema = new mongoose_1.Schema({
    videoUrl: String,
    title: String,
    videoDuration: Number,
    videoDescription: String,
    videoSection: String,
    videoPlayer: String,
    links: [linkSchema],
    objectives: [objectiveSchema],
    suggestion: String,
    questions: [commentSchema],
});
const courseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
    },
    category: { type: String, required: true },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSChema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchase: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const Course = mongoose_1.default.model("Course", courseSchema);
exports.default = Course;
