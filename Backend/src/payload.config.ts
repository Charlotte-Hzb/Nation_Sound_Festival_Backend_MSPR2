import path from 'path';

// Importing plugins and adapters for Payload CMS (cloud, MongoDB, Webpack, Slate Editor)
import { payloadCloud } from '@payloadcms/plugin-cloud';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';

// Importing the application's collections
import Users from './collections/Users';
import Concerts from './collections/Concerts';
import BreakingNews from './collections/breakingNews';
import { CollectionConfig } from 'payload/types';
import ContentNewsletter from './collections/contentNewsletter';
import subscribersNewsletter from './collections/subscribersNewsletter';

// Configuring the PointsDInteret collection to manage location
const PointsDInteret: CollectionConfig = {
  slug: 'points-d-interet',
  labels: {
    singular: 'Point d\'Intérêt',
    plural: 'Points d\'Intérêt',
  },
  access: {
    read: () => true,
  },
  fields: [
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
      type: 'text',
      required: true,
    },
  ],
};

// Configuring the Media collection to manage media files
const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Autorise l'accès public en lecture
  },
  upload: {
    staticURL: '/media',
    staticDir: path.resolve(__dirname, '../media'), // Adjust path for absolute reference
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'center',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description alternative',
    },
  ],
};

// Main Payload CMS configuration
export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, Concerts, PointsDInteret, BreakingNews, ContentNewsletter, subscribersNewsletter, Media],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
});
