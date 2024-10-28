// Imports the CollectionConfig type from the Payload CMS. 
// This type is used to define the structure and configuration of a collection within the Payload CMS.
import { CollectionConfig } from 'payload/types';

const BreakingNews: CollectionConfig = {
  // The collection name in the CMS
  slug: 'breaking-news', 
  labels: {
    // Singular and plural labels for this collection in the admin interface
    singular: 'Breaking News',
    plural: 'Breaking News',
  },
  admin: {
    // Default columns displayed in the admin interface list view for this collection
    defaultColumns: ['title', 'content', 'category', 'priority', 'publishedDate'],
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Permet l'accès public en lecture
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
