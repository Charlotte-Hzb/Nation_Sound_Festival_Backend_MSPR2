const Media = {
  // Defines the unique identifier (slug) for the "media" collection. 
    slug: 'media',
    upload: {
      // Specifies the URL where the uploaded media files will be accessible.
      staticURL: '/media',
      // Specifies the directory where uploaded media files will be stored on the server.
      staticDir: 'media',
      // Restricts the types of files that can be uploaded to only image files. The wildcard '*' means any image file type (e.g., jpg, png, gif, etc.) is allowed.
      mimeTypes: ['image/*'],
    },
  };
  
  module.exports = Media;
  