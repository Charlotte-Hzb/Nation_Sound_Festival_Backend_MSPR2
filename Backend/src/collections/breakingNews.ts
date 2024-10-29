// Imports the CollectionConfig type from the Payload CMS. 
// This type is used to define the structure and configuration of a collection within the Payload CMS.
import { CollectionConfig } from 'payload/types';

const BreakingNews: CollectionConfig = {
  slug: 'breaking-news', 
  labels: {
    // The collection name in the CMS
    singular: 'Breaking News',
    plural: 'Breaking News',
  },
  admin: {
    // Default columns displayed in the admin interface list view for this collection
    defaultColumns: ['title', 'content', 'category', 'priority', 'publishedDate'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Allows everyone to read the concerts
  },
  fields: [
  // The fields that define the content structure of the collection
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Contenu',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Catégorie',
      options: [
        {
          label: 'Information générale',
          value: 'information generale',
        },
        {
          label: 'Sécurité',
          value: 'securite',
        },
        {
          label: 'Programme',
          value: 'programme',
        },
      ],
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priorité',
      options: [
        {
          label: 'Normal',
          value: 'normal',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Date de publication',
      required: true,
    },
  ],
};

export default BreakingNews;
