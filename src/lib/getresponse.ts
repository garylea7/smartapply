import axios from 'axios';

const GETRESPONSE_API_KEY = process.env.GETRESPONSE_API_KEY;
const GETRESPONSE_API_BASE = 'https://api.getresponse.com/v3';

export interface GetResponseContact {
  email: string;
  name?: string;
  campaign?: {
    campaignId: string;
  };
  tags?: string[];
  customFields?: Array<{
    customFieldId: string;
    value: string[];
  }>;
}

export interface GetResponseCampaign {
  campaignId: string;
  name: string;
  description?: string;
  fromField?: {
    fromFieldId: string;
    name: string;
    email: string;
  };
}

class GetResponseService {
  private headers = {
    'X-Auth-Token': `api-key ${GETRESPONSE_API_KEY}`,
    'Content-Type': 'application/json',
  };

  async getCampaigns(): Promise<GetResponseCampaign[]> {
    try {
      const response = await axios.get(`${GETRESPONSE_API_BASE}/campaigns`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching GetResponse campaigns:', error);
      return [];
    }
  }

  async addContact(contact: GetResponseContact, campaignId?: string): Promise<boolean> {
    try {
      // If campaign ID is provided, add it to the contact data
      const contactData = {
        ...contact,
        ...(campaignId && {
          campaign: {
            campaignId,
          },
        }),
      };

      const response = await axios.post(
        `${GETRESPONSE_API_BASE}/contacts`,
        contactData,
        { headers: this.headers }
      );

      // Add tags to the contact
      if (contact.tags && contact.tags.length > 0) {
        await this.addTags(response.data.contactId, contact.tags);
      }

      return true;
    } catch (error) {
      console.error('Error adding GetResponse contact:', error);
      return false;
    }
  }

  async addTags(contactId: string, tags: string[]): Promise<boolean> {
    try {
      await axios.post(
        `${GETRESPONSE_API_BASE}/contacts/${contactId}/tags`,
        { tags },
        { headers: this.headers }
      );
      return true;
    } catch (error) {
      console.error('Error adding GetResponse tags:', error);
      return false;
    }
  }

  async getContactByEmail(email: string): Promise<any> {
    try {
      const response = await axios.get(
        `${GETRESPONSE_API_BASE}/contacts`,
        {
          headers: this.headers,
          params: { query: { email } },
        }
      );
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching GetResponse contact:', error);
      return null;
    }
  }

  async createWebhook(): Promise<boolean> {
    try {
      const webhookData = {
        events: ['contact_created', 'contact_updated'],
        url: `${process.env.APP_URL || 'http://localhost:3000'}/api/webhooks/getresponse`,
      };

      await axios.post(
        `${GETRESPONSE_API_BASE}/webhooks`,
        webhookData,
        { headers: this.headers }
      );
      return true;
    } catch (error) {
      console.error('Error creating GetResponse webhook:', error);
      return false;
    }
  }
}

export const getResponseService = new GetResponseService();