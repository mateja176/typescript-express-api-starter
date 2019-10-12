import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
    }
});

/**
 * GET /contact
 * Contact form page.
 */
export const getContact = (req: Request, res: Response) => {
    res.render("contact", {
        title: "Contact"
    });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
export const postContact = (req: Request, res: Response) => {
    check("name", "Name cannot be blank").not().isEmpty();
    check("email", "Email is not valid").isEmail();
    check("message", "Message cannot be blank").not().isEmpty();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.redirect("/contact");
    }

    const mailOptions = {
        to: process.env.CONTACT_EMAIL,
        from: `${req.body.name} <${req.body.email}>`,
        subject: "Contact Form",
        text: req.body.message
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return res.redirect("/contact");
        }
        // Email has been sent successfully!
        res.redirect("/contact");
    });
};
