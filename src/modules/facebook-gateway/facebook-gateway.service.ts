import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookGatewayService {
  private readonly logger = new Logger(FacebookGatewayService.name);

  constructor(private configService: ConfigService) {}

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    const verifyToken = this.configService.get<string>('FACEBOOK_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('FACEBOOK_WEBHOOK_VERIFIED');
      return challenge;
    }
    this.logger.warn('Failed to verify Facebook webhook');
    return null;
  }

  async handleEvent(body: any): Promise<void> {
    this.logger.log(`Received Facebook event: ${JSON.stringify(body)}`);
    if (body.object === 'page') {
      for (const entry of body.entry || []) {
        // Direct Messages
        if (entry.messaging) {
          await this.handleMessagingEvents(entry.messaging);
        }

        // Feeds/Comments
        if (entry.changes) {
          this.handleChangesEvents(entry.changes);
        }
      }
    }
  }

  private async handleMessagingEvents(messaging: any[]): Promise<void> {
    for (const webhookEvent of messaging) {
      const senderId = webhookEvent.sender?.id;
      const messageText = webhookEvent.message?.text;
      const quickReply = webhookEvent.message?.quick_reply;

      if (senderId && messageText) {
        const userInfo = await this.getUserProfileFromPSID(senderId);
        const senderName = userInfo?.name || 'Unknown';
        this.logger.log(
          `[Facebook Messenger] New Message from ${senderName} (PSID: ${senderId}): ${messageText}`,
        );

        // Xử lý trích xuất (Bao gồm Quick Reply payload nếu có)
        let textToParse = messageText;
        if (quickReply && quickReply.payload) {
          textToParse += ' ' + String(quickReply.payload);
        }

        const extracted = this.extractCustomerInfo(textToParse);
        if (
          extracted.phone ||
          extracted.email ||
          extracted.address ||
          extracted.name
        ) {
          this.logger.log(
            `[Extracted Info - Message] ${JSON.stringify(extracted)}`,
          );
        }
      }
    }
  }

  private handleChangesEvents(changes: any[]): void {
    for (const change of changes) {
      if (change.field === 'feed') {
        const value = change.value;
        if (value?.item === 'comment' && value?.verb === 'add') {
          const commentId = value.comment_id;
          const senderId = value.from?.id || value.sender_id;
          const senderName = value.from?.name || 'Unknown';
          const messageText = value.message;
          this.logger.log(
            `[Facebook Comment] New Comment from ${senderName} (ID: ${senderId}, Comment ID: ${commentId}): ${messageText}`,
          );

          const extracted = this.extractCustomerInfo(messageText);
          if (
            extracted.phone ||
            extracted.email ||
            extracted.address ||
            extracted.name
          ) {
            this.logger.log(
              `[Extracted Info - Comment] ${JSON.stringify(extracted)}`,
            );
          }
        }
      }
    }
  }

  private extractCustomerInfo(text: string) {
    if (!text)
      return { phone: null, email: null, address: null, nameFromText: null };

    // 1. Phone number (VN format)
    const phone = this.getPhoneNumberFromString(text);

    // 2. Email format
    const email = this.getEmailFromString(text);

    // 3. Name (Basic parsing after keywords like 'Tên:', 'Name:')
    const name = this.getNameFromString(text);

    // 4. Address (Basic parsing after keywords like 'Đ/c:', 'Địa chỉ:', 'Ship về')
    const address = this.getAddressFromString(text);

    return { phone, email, address, name };
  }

  private getPhoneNumberFromString(text: string): string | null {
    if (!text) return null;
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    const match = text.match(phoneRegex);
    return match ? match[0] : null;
  }

  private getEmailFromString(text: string): string | null {
    if (!text) return null;
    const emailRegex =
      /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }

  private getNameFromString(text: string): string | null {
    if (!text) return null;
    const nameRegex =
      /(?:tên|name|khách hàng)(?:\s*là|:|\-|\s)\s*([A-Za-zÀ-ỹ\s]{2,50})(?:\n|,|\.|sđt|số|địa chỉ|email|-|$)/i;
    const nameMatch = text.match(nameRegex);
    return nameMatch ? nameMatch[1].trim() : null;
  }

  private getAddressFromString(text: string): string | null {
    if (!text) return null;
    const addressRegex =
      /(?:địa chỉ|đ\/c|ship về|ship tới|gửi về|ở)(?:\s*là|:|\-|\s)\s*(.*?)(?:\n|$|sđt|số|email|tên|\.)/i;
    const addressMatch = text.match(addressRegex);
    return addressMatch ? addressMatch[1].trim() : null;
  }

  async getUserProfileFromPSID(psid: string): Promise<any> {
    const pageAccessToken = this.configService.get<string>(
      'FACEBOOK_PAGE_ACCESS_TOKEN',
    );
    if (!pageAccessToken) {
      this.logger.warn('FACEBOOK_PAGE_ACCESS_TOKEN is missing');
      return null;
    }

    const url = `https://graph.facebook.com/v19.0/${psid}?fields=first_name,last_name,profile_pic,name&access_token=${pageAccessToken}`;

    try {
      const response = await fetch(url);
      const userData = await response.json();

      if (userData.error) {
        this.logger.error(`Graph API Error: ${userData.error.message}`);
        return null;
      }

      return userData;
    } catch (error) {
      this.logger.error('Failed to fetch user profile', error);
      return null;
    }
  }
}
