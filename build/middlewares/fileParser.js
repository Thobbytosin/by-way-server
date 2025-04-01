"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileParser = void 0;
const formidable_1 = __importDefault(require("formidable"));
const fileParser = async (req, res, next) => {
    const form = (0, formidable_1.default)();
    const [fields, files] = await form.parse(req);
    // console.log(fields);
    // console.log(files);
    // for the product name, description ... data
    // example of data coming: {name: ['John'], age: ['24']} turns it to {name: 'John',....}
    for (let key in fields) {
        req.body[key] = fields[key][0];
    }
    if (!req.files)
        req.files = {};
    for (let key in files) {
        const filesNeeded = files[key];
        if (!filesNeeded)
            break;
        if (filesNeeded.length > 1) {
            req.files[key] = filesNeeded;
        }
        else {
            req.files[key] = filesNeeded[0];
        }
    }
    next();
};
exports.fileParser = fileParser;
