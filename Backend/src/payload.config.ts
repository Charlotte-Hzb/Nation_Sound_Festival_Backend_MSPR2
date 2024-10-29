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


// Configuring the Points of Interest collection to manage location
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
    read: () => true, //Allows public read access
  },
  upload: {
    // Defines the URL path where media files will be publicly accessible
    staticURL: '/media',
    // Specifies the directory where uploaded media files are stored on the server
    staticDir: path.resolve(__dirname, '../media'), 
     // Configures multiple image sizes for responsive design
    imageSizes: [
      {
        // Size name for admin interface or custom usage
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
    // Sets the default image size shown in the admin interface
    adminThumbnail: 'thumbnail',
    // Limits the allowed file types for upload to images only
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
    // Specifies that the Users collection will be used for user authentication
    user: Users.slug,
    // Integrates Webpack for bundling static files in the admin interface
    bundler: webpackBundler(),
  },
  // Configures the rich text editor using Slate
  editor: slateEditor({}),
  // Declares all collections used in the project for Payload CMS
  collections: [Users, Concerts, PointsDInteret, BreakingNews, ContentNewsletter, subscribersNewsletter, Media],
  // TypeScript configuration to generate type definitions for Payload's collections and fields
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  // GraphQL configuration to generate the schema for Payload's collections and fields
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  // Enables the Payload Cloud plugin for cloud-specific functionality
  plugins: [payloadCloud()],
  // Database configuration using MongoDB adapter
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
});
