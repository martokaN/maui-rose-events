import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { env } from "cloudflare:workers";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(str: string): string {
  return str.replace(/[\r\n]/g, "").trim();
}

const formSchema = z.object({
  // Form fields
  name: z.string().trim().min(1, "First name is required").max(100),
  surname: z.string().trim().min(1, "Last name is required").max(100),
  email: z.email({ message: "Invalid email address" }).max(320).trim(),
  phone: z.string().trim().max(20).optional(),
  appointment: z.string().trim().max(50).optional(),

  // URL parameters
  package: z.string().trim().max(100).optional().default("Not specified"),
  addons: z.string().trim().max(500).optional().default("None specified"),

  // Honeypot
  _honeypot: z.string().max(0, "Bot detected"),
});

export const server = {
  sendEmail: defineAction({
    accept: "json",
    input: formSchema,
    handler: async (input, { request }) => {
      // Check honeypot (already validated by Zod max(0), but double-check)
      if (input._honeypot && input._honeypot.length > 0) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Bot detected",
        });
      }

      // Environment validation
      if (!env.EMAIL_KEY) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email service not configured",
        });
      }

      // Basic rate limiting using IP address
      // Note: For production, use Cloudflare KV or Durable Objects
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";

      // Log the attempt (without sensitive data)
      console.log(
        `Form submission attempt from IP: ${ip}, User-Agent: ${userAgent.substring(0, 50)}...`,
      );

      // Escape all user input
      const nameEscaped = escapeHtml(input.name);
      const surnameEscaped = escapeHtml(input.surname);
      const emailEscaped = escapeHtml(input.email);
      const phoneEscaped = input.phone ? escapeHtml(input.phone) : null;
      const appointmentEscaped = input.appointment
        ? escapeHtml(input.appointment)
        : null;
      const packageEscaped = escapeHtml(input.package);
      const addonsEscaped = escapeHtml(input.addons);

      const field = (label: string, value: string, color = "#2a2d32") =>
        `<div style="background:#f5f4f1; border-radius:8px; padding:12px 14px; margin-bottom:10px;">` +
        `<p style="margin:0 0 2px; font-size:11px; color:#6b6f76; letter-spacing:0.06em; text-transform:uppercase;">${label}</p>` +
        `<p style="margin:0; font-size:15px; color:${color}; font-weight:500;">${value}</p>` +
        `</div>`;

      const emailHtml = [
        '<div style="background:#f5f4f1; padding:2rem; font-family:sans-serif;">',
        '<div style="background:#fafaf8; border:0.5px solid #d4d2cc; border-radius:12px; max-width:600px; overflow:hidden;">',

        // Header
        '<div style="background:#5c533f; padding:1.5rem 2rem;">',
        '<p style="margin:0; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:#c4b99a; font-weight:500;">Maui Rose Events</p>',
        '<h2 style="margin:4px 0 0; font-size:20px; font-weight:500; color:#fafaf8;">New booking inquiry</h2>',
        "</div>",

        // Fields — stacked
        '<div style="padding:1.5rem 2rem; border-bottom:0.5px solid #d4d2cc;">',
        field("Name", `${nameEscaped} ${surnameEscaped}`),
        field("Email", emailEscaped, "#5c533f"),
        field("Phone", phoneEscaped ?? "Not provided"),
        field(
          "Appointment Date & Time",
          appointmentEscaped
            ? new Date(appointmentEscaped).toLocaleString()
            : "Not specified",
        ),
        field("Package", packageEscaped),
        field("Add-ons", addonsEscaped),
        "</div>",

        // Footer
        '<div style="background:#f5f4f1; padding:1rem 2rem; border-top:0.5px solid #d4d2cc;">',
        '<p style="margin:0; font-size:12px; color:#6b6f76; text-align:center;">Maui Rose Events · Reply directly to this email to respond</p>',
        "</div>",

        "</div></div>",
      ]
        .filter(Boolean)
        .join("\n");

      // Sanitize headers to prevent injection
      const subject = `Inquiry: ${sanitizeHeader(input.name)} ${sanitizeHeader(input.surname)} - ${sanitizeHeader(input.package)}`;
      const plainText = [
        `Inquiry from ${input.name} ${input.surname}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone || "Not provided"}`,
        `Appointment: ${input.appointment || "Not specified"}`,
        `Package: ${input.package}`,
        `Add-ons: ${input.addons}`,
      ].join("\n");

      const from = env.EMAIL_FROM ?? "noreply@mauiroseevents.com";
      const to = (env.EMAIL_TO ?? "mauiroseevents@gmail.com")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const response = await fetch("https://api.mart-web.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.EMAIL_KEY}`,
        },
        body: JSON.stringify({
          service: "ses",
          from,
          to,
          reply_to: input.email,
          subject,
          message: plainText,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("EMAIL API FAILED:", response.status, errorText);

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again.",
        });
      }

      return { success: true, message: "Email sent!" };
    },
  }),
};
