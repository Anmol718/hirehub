const nodemailer = require("nodemailer");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseTemplate = (headerBg, badgeText, badgeColor, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:${headerBg};padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1px;">HireHub</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">Your Career, Our Priority</p>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td align="center" style="padding:28px 40px 0;">
              <span style="display:inline-block;background-color:${badgeColor};color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.5px;padding:6px 18px;border-radius:20px;">
                ${badgeText}
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 40px 36px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#aaaaaa;font-size:12px;">This is an automated message from HireHub. Please do not reply to this email.</p>
              <p style="margin:8px 0 0;color:#aaaaaa;font-size:12px;">© 2026 HireHub. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports.sendApplicationStatusEmail = async (application, job) => {
  const isAccepted = application.status === "Accepted";

  const subject = isAccepted
    ? `Congratulations! Your application for "${job.title}" has been accepted`
    : `Update on your application for "${job.title}"`;

  const acceptedBody = `
    <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">Congratulations, ${application.fullName}! 🎉</h2>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 16px;">
      We are thrilled to inform you that your application for the position of
      <strong style="color:#1a1a1a;">${job.title}</strong> has been
      <strong style="color:#2e7d32;">accepted</strong>.
    </p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 24px;">
      The employer will be reaching out to you shortly with further details about the next steps in the hiring process.
    </p>
    <table cellpadding="0" cellspacing="0" style="background-color:#f0f7f0;border-left:4px solid #2e7d32;border-radius:4px;width:100%;margin-bottom:28px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;color:#555;font-size:14px;"><strong>Position:</strong> ${job.title}</p>
          <p style="margin:8px 0 0;color:#555;font-size:14px;"><strong>Applicant:</strong> ${application.fullName}</p>
          <p style="margin:8px 0 0;color:#555;font-size:14px;"><strong>Status:</strong> <span style="color:#2e7d32;font-weight:600;">Accepted</span></p>
        </td>
      </tr>
    </table>
    <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;">
      Best regards,<br/>
      <strong style="color:#1a1a1a;">The HireHub Team</strong>
    </p>
  `;

  const rejectedBody = `
    <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;">Application Update</h2>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 16px;">Dear <strong>${application.fullName}</strong>,</p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Thank you for taking the time to apply for the position of
      <strong style="color:#1a1a1a;">${job.title}</strong> and for your interest in this opportunity.
    </p>
    <p style="color:#444444;font-size:15px;line-height:1.7;margin:0 0 24px;">
      After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We encourage you not to be discouraged — there are many more opportunities waiting for you on HireHub.
    </p>
    <table cellpadding="0" cellspacing="0" style="background-color:#fdf4f4;border-left:4px solid #c62828;border-radius:4px;width:100%;margin-bottom:28px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;color:#555;font-size:14px;"><strong>Position:</strong> ${job.title}</p>
          <p style="margin:8px 0 0;color:#555;font-size:14px;"><strong>Applicant:</strong> ${application.fullName}</p>
          <p style="margin:8px 0 0;color:#555;font-size:14px;"><strong>Status:</strong> <span style="color:#c62828;font-weight:600;">Not Selected</span></p>
        </td>
      </tr>
    </table>
    <p style="color:#666666;font-size:14px;line-height:1.6;margin:0;">
      We wish you all the best in your job search.<br/><br/>
      Best regards,<br/>
      <strong style="color:#1a1a1a;">The HireHub Team</strong>
    </p>
  `;

  const html = isAccepted
    ? baseTemplate("#2e7d32", "APPLICATION ACCEPTED", "#2e7d32", acceptedBody)
    : baseTemplate("#1a1a2e", "APPLICATION UPDATE", "#c62828", rejectedBody);

  await transporter.sendMail({
    from: `"HireHub" <${process.env.EMAIL_USER}>`,
    to: application.email,
    subject,
    html,
  });
};
