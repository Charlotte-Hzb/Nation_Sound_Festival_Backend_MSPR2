// Imports the CollectionConfig type from the Payload CMS. 
// This type is used to define the structure and configuration of a collection within the Payload CMS.
import { CollectionConfig } from 'payload/types';

const contentNewsletter: CollectionConfig = {
  slug: 'content-newsletter',
  admin: {
    useAsTitle: 'title',
  },
  // The collection name in the CMS
  labels: {
    singular: 'Newsletter', 
    plural: 'Newsletters',    
    },
  fields: [
    // The fields that define the content structure of the collection
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titre de la Newsletter',
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Date de publication',
    },
     // Dynamic list of articles
    {
      name: 'articles',
      type: 'array', // An array field to allow multiple articles to be added within the newsletter.
      label: 'Articles',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titre de l\'article',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media', // Associates this field with the 'media' collection for uploading and selecting an image.
          label: 'Image de l\'article',
          required: false,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Contenu de l\'article',
          required: true,
        },
      ],
    },
  ],
};

export default contentNewsletter;
