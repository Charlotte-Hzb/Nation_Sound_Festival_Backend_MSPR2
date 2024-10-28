// Imports the CollectionConfig type from the Payload CMS. 
// This type is used to define the structure and configuration of a collection within the Payload CMS.
import { CollectionConfig } from 'payload/types';

const PointsDInteret: CollectionConfig = {
  // The collection name in the CMS
  slug: 'points-d-interet',
  fields: [
    // The fields that define the content structure of the collection
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'lat',
      type: 'number',
      required: true,
    },
    {
      name: 'lng',
      type: 'number',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Accueil', value: 'Accueil' },
        { label: 'WC', value: 'WC' },
        { label: 'Scène', value: 'Scène' },
        { label: 'Buvette', value: 'Buvette' },
        { label: 'Shop', value: 'Shop' },
      ],
      required: true,
    },
  ],
};

export default PointsDInteret;
