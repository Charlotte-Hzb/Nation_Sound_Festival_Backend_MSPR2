import { CollectionConfig } from 'payload/types';

const subscribersNewsletter: CollectionConfig = {
  slug: 'subscribers-newsletters',
  // The collection name in the CMS
  labels: {
    singular: 'Subscriber Newsletter',
    plural: 'Subscribers Newsletter',
  },
  access: {
    read: () => true, // Allows everyone to read the concerts
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email',
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Date d\'inscription',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

export default subscribersNewsletter;
