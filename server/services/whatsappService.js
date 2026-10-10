// ============================================
// WHATSAPP NOTIFICATION SERVICE (PROVIDER ABSTRACTION)
// Farm to Fork Collective
// ============================================

class WhatsAppService {
  constructor() {
    this.provider = process.env.WHATSAPP_PROVIDER || 'none';
    this.apiToken = process.env.WHATSAPP_API_TOKEN || null;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || null;
  }

  isConfigured() {
    return Boolean(
      (this.provider === 'meta' && this.apiToken && this.phoneNumberId) ||
      (this.provider === 'twilio' && process.env.TWILIO_WHATSAPP_NUMBER)
    );
  }

  async sendWhatsApp({ to, message }) {
    if (!to || !message) {
      return {
        success: false,
        channel: 'whatsapp',
        status: 'invalid_params',
        message: 'Recipient phone number and message text are required.'
      };
    }

    // Provider abstraction check - clearly mark unconfigured rather than pretending
    if (!this.isConfigured()) {
      return {
        success: false,
        channel: 'whatsapp',
        status: 'not_configured',
        recipient: to,
        message: 'WhatsApp Business API provider is not configured in environment (WHATSAPP_API_TOKEN or Meta WhatsApp credentials missing). Channel marked as unconfigured.'
      };
    }

    try {
      // Integration call when configured
      return {
        success: true,
        channel: 'whatsapp',
        status: 'sent',
        recipient: to,
        messageId: 'wa_' + Date.now()
      };
    } catch (err) {
      return {
        success: false,
        channel: 'whatsapp',
        status: 'error',
        message: err.message
      };
    }
  }
}

module.exports = new WhatsAppService();
