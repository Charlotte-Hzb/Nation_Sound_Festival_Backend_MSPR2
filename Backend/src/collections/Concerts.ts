// Imports the CollectionConfig type from the Payload CMS. 
// This type is used to define the structure and configuration of a collection within the Payload CMS.
import { CollectionConfig } from 'payload/types'; 

const Concerts: CollectionConfig = {
  slug: 'concerts',
  access: {
    read: () => true,  // Allows everyone to read the concerts
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nom de l’artiste',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,  // Ensures the slug is unique
      admin: {
        position: 'sidebar',  // Displays the slug field in the sidebar in the admin
      },
      hooks: {
        beforeValidate: [], // Removed custom slug logic, Payload CMS will handle slug generation
      },
      required: true,
      label: 'Slug (généré automatiquement)',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date du concert',
    },
    {
      name: 'time',
      type: 'text',
      required: true,
      label: 'Heure du concert',
    },
    {
      name: 'scene',
      type: 'text',
      required: true,
      label: 'Scène',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Rock', value: 'Rock' },
        { label: 'Électro', value: 'Electro' },
        { label: 'Funk', value: 'Funk' },
        { label: 'Pop', value: 'Pop' },
      ],
      required: true,
      label: 'Type de musique',
    }
  ],
};

export default Concerts;