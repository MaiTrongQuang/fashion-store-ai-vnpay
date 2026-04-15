import { Resend } from "resend";
import { SITE_NAME } from "@/lib/constants";

let _resend: Resend | null = null;
function getResend(): Resend {
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY || "");
    }
    return _resend;
}

const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type OtpPurpose = "register" | "reset_password";

const PURPOSE_LABELS: Record<OtpPurpose, { title: string; action: string }> = {
    register: {
        title: "Xác thực tài khoản",
        action: "đăng ký tài khoản",
    },
    reset_password: {
        title: "Đặt lại mật khẩu",
        action: "đặt lại mật khẩu",
    },
};

function buildOtpHtml(code: string, purpose: OtpPurpose): string {
    const { title, action } = PURPOSE_LABELS[purpose];
    return `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="420" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.08);overflow:hidden">
        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 20px;text-align:center;border-bottom:1px solid #e4e4e7">
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#d97706">${SITE_NAME}</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#71717a">${title}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;line-height:1.6">
              Xin chào, bạn vừa yêu cầu ${action} tại <strong>${SITE_NAME}</strong>. Vui lòng sử dụng mã OTP bên dưới:
            </p>
            <div style="margin:24px 0;text-align:center">
              <span style="display:inline-block;padding:16px 32px;font-size:32px;font-weight:700;letter-spacing:8px;background:#fef3c7;color:#92400e;border-radius:12px;border:2px dashed #f59e0b">
                ${code}
              </span>
            </div>
            <p style="margin:0 0 8px;font-size:13px;color:#71717a;text-align:center">
              Mã có hiệu lực trong <strong>5 phút</strong>.
            </p>
            <p style="margin:16px 0 0;font-size:13px;color:#a1a1aa;text-align:center">
              Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;text-align:center;background:#fafafa;border-top:1px solid #e4e4e7">
            <p style="margin:0;font-size:12px;color:#a1a1aa">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function sendOtpEmail(
    email: string,
    code: string,
    purpose: OtpPurpose,
): Promise<{ success: boolean; error?: string }> {
    const { title } = PURPOSE_LABELS[purpose];

    try {
        const { error } = await getResend().emails.send({
            from: `${SITE_NAME} <${FROM_EMAIL}>`,
            to: email,
            subject: `[${SITE_NAME}] ${title} — Mã OTP: ${code}`,
            html: buildOtpHtml(code, purpose),
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error("Email send error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
        };
    }
}

/** Generate a cryptographically-adequate 6-digit OTP */
export function generateOtp(): string {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return String(array[0] % 1000000).padStart(6, "0");
}
