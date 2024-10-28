// Imports the CollectionConfig type from the Payload CMS. 
// This type is used to define the structure and configuration of a collection within the Payload CMS.
import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,  // Enables authentication for this collection
  admin: {
    useAsTitle: 'email',  // Displays the email in the admin interface
  },
  access: {
    read: ({ req }) => Boolean(req.user),  // Only authenticated users can read
    update: ({ req }) => Boolean(req.user && (req.user.role === 'admin' || req.user.id === req.params.id)),  // Admin or the user themselves
    delete: ({ req }) => Boolean(req.user && req.user.role === 'admin'),  // Only an admin can delete users
  },
  fields: [
    {
      name: 'email',
      type: 'email',  // Correct field type for email
      required: true,
    },
    {
      name: 'password',
      type: 'text',  // Use 'text' field type for now if 'password' causes issues
      required: true,
      admin: {
        hidden: true,  // Use 'hidden' to hide the field in the admin panel
      }
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      required: true,
      defaultValue: 'user',  // By default, new accounts are normal users
    },
  ],
};

export default Users;
