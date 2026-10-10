// ============================================
// CENTRALIZED NOTIFICATION SERVICE
// Farm to Fork Collective
// Coordinates SMS, WhatsApp, and Email with User Preferences
// ============================================

const smsService = require('./smsService');
const whatsappService = require('./whatsappService');
const emailService = require('./emailService');
const { readDb, writeDb } = require('../config/db');

class NotificationService {
  constructor() {
    this.sms = smsService;
    this.whatsapp = whatsappService;
    this.email = emailService;
  }

  // Get status of all notification channels
  getChannelsStatus() {
    return {
      adminEmail: this.email.getAdminEmail(),
      sms: {
        channel: 'SMS',
        configured: this.sms.isConfigured(),
        provider: this.sms.provider
      },
      whatsapp: {
        channel: 'WhatsApp',
        configured: this.whatsapp.isConfigured(),
        provider: this.whatsapp.provider
      },
      email: {
        channel: 'Email / Gmail (SMTP)',
        configured: this.email.isConfigured(),
        provider: 'Nodemailer (Gmail SMTP)',
        adminEmail: this.email.getAdminEmail()
      }
    };
  }

  // Dispatches notification according to customer's saved notification preferences
  async notifyUser(user, { title, message, actionUrl, type = 'general', data = {} }) {
    if (!user) return { success: false, message: 'User is required for notification.' };

    const preferences = user.notificationPreferences || { sms: true, whatsapp: true, email: true };
    const results = {};

    // 1. In-App Notification (Always stored)
    const notifRecord = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: user.id,
      title,
      message,
      actionUrl: actionUrl || '/pages/dashboard-customer.html',
      type,
      read: false,
      createdAt: new Date().toISOString()
    };

    try {
      const db = readDb();
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift(notifRecord);
      writeDb(db);
      results.inApp = { success: true, status: 'stored', id: notifRecord.id };
    } catch (e) {
      results.inApp = { success: false, error: e.message };
    }

    // 2. SMS Channel (Dispatched only if preference is enabled)
    if (preferences.sms === true) {
      if (user.phone) {
        results.sms = await this.sms.sendSMS({
          to: user.phone,
          message: `[FTF] ${title}: ${message}`
        });
      } else {
        results.sms = { success: false, channel: 'sms', status: 'missing_phone', message: 'No phone number on profile' };
      }
    } else {
      results.sms = { success: false, channel: 'sms', status: 'disabled_by_user', message: 'SMS channel disabled by user preference' };
    }

    // 3. WhatsApp Channel (Dispatched only if preference is enabled)
    if (preferences.whatsapp === true) {
      if (user.phone) {
        results.whatsapp = await this.whatsapp.sendWhatsApp({
          to: user.phone,
          message: `🌱 *Farm to Fork Collective*\n*${title}*\n${message}\n\n${actionUrl ? 'View: ' + actionUrl : ''}`
        });
      } else {
        results.whatsapp = { success: false, channel: 'whatsapp', status: 'missing_phone', message: 'No phone number on profile' };
      }
    } else {
      results.whatsapp = { success: false, channel: 'whatsapp', status: 'disabled_by_user', message: 'WhatsApp channel disabled by user preference' };
    }

    // 4. Email Channel (Dispatched only if preference is enabled)
    if (preferences.email === true) {
      if (user.email) {
        results.email = await this.email.sendEmail({
          to: user.email,
          subject: `Farm to Fork: ${title}`,
          text: `${title}\n\n${message}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #16a34a; margin-top: 0;">🌱 Farm to Fork Collective</h2>
              <h3 style="color: #1e293b;">${title}</h3>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">${message}</p>
              ${actionUrl ? `<p><a href="${actionUrl}" style="display: inline-block; padding: 10px 20px; background: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">View Details</a></p>` : ''}
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #94a3b8;">You received this because of your notification settings on Farm to Fork Collective.</p>
            </div>
          `
        });
      } else {
        results.email = { success: false, channel: 'email', status: 'missing_email', message: 'No email address on profile' };
      }
    } else {
      results.email = { success: false, channel: 'email', status: 'disabled_by_user', message: 'Email channel disabled by user preference' };
    }

    return {
      success: true,
      notification: notifRecord,
      channels: results
    };
  }

  // Test a single channel respecting user preferences
  async testChannel(user, channel) {
    if (!user) return { success: false, message: 'User profile is required.' };
    const preferences = user.notificationPreferences || { sms: true, whatsapp: true, email: true };

    if (channel === 'sms') {
      if (preferences.sms === false) {
        return { success: false, channel: 'sms', status: 'disabled_by_user', message: 'SMS is disabled in your notification preferences.' };
      }
      return await this.sms.sendSMS({
        to: user.phone || '+91 98765 43210',
        message: `[FTF-ALERTS] Vanakkam ${user.name}! Test SMS notification verified.`
      });
    }

    if (channel === 'whatsapp') {
      if (preferences.whatsapp === false) {
        return { success: false, channel: 'whatsapp', status: 'disabled_by_user', message: 'WhatsApp is disabled in your notification preferences.' };
      }
      return await this.whatsapp.sendWhatsApp({
        to: user.phone || '+91 98765 43210',
        message: `🌱 Vanakkam ${user.name}! WhatsApp alerts verified for Farm to Fork.`
      });
    }

    if (channel === 'email') {
      if (preferences.email === false) {
        return { success: false, channel: 'email', status: 'disabled_by_user', message: 'Email is disabled in your notification preferences.' };
      }
      return await this.email.sendEmail({
        to: user.email || 'customer@example.com',
        subject: 'Farm to Fork Notification Test 🌱',
        text: `Hello ${user.name || 'Valued Member'}, your email notification channel on Farm to Fork Collective is active!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #16a34a; margin-top: 0;">🌱 Farm to Fork Collective</h2>
            <h3 style="color: #0f172a;">Email Notification Channel Verified</h3>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>${user.name || 'Valued Member'}</strong>,</p>
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">Your registered email channel is working and verified. You will receive real-time order updates, seed-to-plate traceability logs, and security alerts directly at this address.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">You can modify your notification preferences at any time in your customer dashboard.</p>
          </div>
        `
      });
    }

    return { success: false, message: `Unknown notification channel: ${channel}` };
  }

  async sendNotification(options) {
    if (options && options.user) {
      return await this.notifyUser(options.user, options);
    }
    return await this.notifyUser(options, options);
  }
}

module.exports = new NotificationService();
