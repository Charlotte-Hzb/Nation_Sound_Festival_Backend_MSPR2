import { CollectionConfig } from 'payload/types';

const subscribersNewsletter: CollectionConfig = {
  slug: 'subscribers-newsletters',
  labels: {
    singular: 'Subscriber Newsletter',
    plural: 'Subscribers Newsletter',
  },
  access: {
    read: () => true, // Permet la lecture publique (à ajuster si besoin)
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
