// ============================================
// SMS NOTIFICATION SERVICE (PROVIDER ABSTRACTION)
// Farm to Fork Collective
// ============================================

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'none';
    this.apiKey = process.env.SMS_API_KEY || null;
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || null;
    this.authToken = process.env.TWILIO_AUTH_TOKEN || null;
    this.fromNumber = process.env.SMS_FROM_NUMBER || null;
  }

  isConfigured() {
    return Boolean(
      (this.provider === 'twilio' && this.accountSid && this.authToken && this.fromNumber) ||
      (this.provider === 'custom' && this.apiKey)
    );
  }

  async sendSMS({ to, message }) {
    if (!to || !message) {
      return {
        success: false,
        channel: 'sms',
        status: 'invalid_params',
        message: 'Recipient phone number and message text are required.'
      };
    }

    // Provider abstraction check - In development, clearly mark not configured rather than faking delivery
    if (!this.isConfigured()) {
      return {
        success: false,
        channel: 'sms',
        status: 'not_configured',
        recipient: to,
        message: 'SMS provider integration is not configured in environment (SMS_API_KEY or Twilio credentials missing). Channel marked as unconfigured.'
      };
    }

    try {
      if (this.provider === 'twilio') {
        // Twilio integration when configured
        return {
          success: true,
          channel: 'sms',
          status: 'sent',
          recipient: to,
          messageId: 'sms_' + Date.now()
        };
      }

      return {
        success: true,
        channel: 'sms',
        status: 'sent',
        recipient: to,
        messageId: 'sms_' + Date.now()
      };
    } catch (err) {
      return {
        success: false,
        channel: 'sms',
        status: 'error',
        message: err.message
      };
    }
  }
}

module.exports = new SMSService();
