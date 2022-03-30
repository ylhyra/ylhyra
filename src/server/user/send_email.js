"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    return;
    if (!process.env.EMAIL_PASSWORD || !process.env.EMAIL_SMTP_HOST)
        return console.warn("Missing details");
    let transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    let info = yield transporter.sendMail({
        from: '"Ylhýra" <ylhyra@ylhyra.is>',
        to: "egillsigurdur@gmail.com",
        subject: "Hello ✔",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
});
