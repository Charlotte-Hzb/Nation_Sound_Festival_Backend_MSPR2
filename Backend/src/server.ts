// Imports the necessary modules for the server
import express, { Request, Response } from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import sgMail from '@sendgrid/mail';
import { MongoClient } from 'mongodb';

// ==========================
// Basic Configuration
// ==========================

// Loads environment variables
dotenv.config();

const app = express();

// Configures SendGrid with the API key to send emails
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Configures CORS to allow requests from specific origins
app.use(
  cors({
    origin: [
      'http://localhost:8080',
      'https://nation-sound-festival-project-fr2p.vercel.app',
      'https://nation-sound-festival-project.onrender.com',
    ],
    // Defines the allowed HTTP methods for cross-origin requests, such as GET, POST, PUT, and DELETE
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Sets EJS as the template engine to generate dynamic HTML pages
app.set('view engine', 'ejs');
// Define the directory where the template views are stored
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse HTTP requests with a JSON body 
app.use(bodyParser.json());
// Middleware to parse URL-encoded data (e.g., form submissions) with extended option allowing rich objects and arrays
app.use(bodyParser.urlencoded({ extended: true }));

// Limits each IP to 100 requests per 15 minutes to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
// Apply the rate limiter only to requests hitting the /api/newsletter route
app.use('/api/newsletter', limiter);

// ==========================
// Connecting to Payload CMS
// ==========================

// Checks if the MongoDB URI is set in environment variables
const MONGODB_URI: string = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  // Throws an error if the MongoDB URI is not defined
  throw new Error('MongoDB URI non défini dans le fichier .env');
}

// Function to start Payload and connect to MongoDB
const startPayload = async () => {
  try {
    await payload.init({
      // Use the Payload secret key from the environment variables or an empty string if not found
      secret: process.env.PAYLOAD_SECRET || '',
      express: app,
      onInit: () => {
        // When Payload is initialized, log the admin URL to the console
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });

    const port = process.env.PORT || 8300;
    app.listen(port, () => {
      // Message when the server starts
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    // Error message if Payload fails to start
    console.error('Erreur lors du démarrage de Payload:', err);
    // Stops the process on failure
    process.exit(1);
  }
};

// Starts the Payload server
startPayload();

// Redirects to the Payload admin interface
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// ==========================
// Fetching and Storing Emails
// ==========================

// Route to handle POST requests to subscribe users to the newsletter
app.post('/api/newsletter', async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log("Email reçu pour inscription:", email);  // Ajoutez cette ligne pour voir si l'email est bien reçu

  // Check if the email is provided. If not, return a 400 error with a message
  if (!email) {
    return res.status(400).json({ message: 'Email requis' });
  }

  try {
    const subscriberExists = await payload.find({
      collection: 'subscribers-newsletters',
      where: { email: { equals: email } },
    });

     // If the email is already found, return a 400 error indicating it's already subscribed
    if (subscriberExists.docs.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà inscrit' });
    }

    // Create a new entry in the 'subscribers-newsletters' collection with the provided email
    await payload.create({
      collection: 'subscribers-newsletters',
      data: { email },
    });
    // Log the registered email to the console for tracking
    console.log(`Email enregistré dans MongoDB: ${email}`);

    // Respond with a 200 status and success message for successful subscription
    return res.status(200).json({ message: 'Inscription réussie' });
  } catch (err) {
    // Log any errors encountered during the subscription process
    console.error("Erreur lors de l'inscription:", err);
    // Return a 500 status and an error message indicating a server error
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// ==========================
// Fetch Subscribers' Emails
// ==========================

// Initialize the MongoDB client using the URI from environment variables or an empty string as a fallback
const client = new MongoClient(process.env.MONGODB_URI || '');
const dbName = 'test';
const collectionName = 'subscribers-newsletters';

// Asynchronous function to retrieve subscriber emails
async function getSubscribersEmails(): Promise<string[]> {
  try {
    // Connect to the MongoDB client
    await client.connect();
    // Access the 'test' database
    const db = client.db('test');
    // Access the 'subscribers-newsletters' collection within the database
    const collection = db.collection('subscribers-newsletters');

     // Retrieve all documents from the collection and convert them into an array
    const subscribers = await collection.find().toArray();
    // Extract only the email field from each subscriber document
    const emailList = subscribers.map((subscriber) => {
      const { email } = subscriber as unknown as { email: string };
      return email;
    });

    // Log the retrieved emails to the console for verification
    console.log("Emails récupérés:", emailList); 

    // Return the list of emails
    return emailList;
  } catch (error) {
    // Log any errors encountered during the email retrieval process
    console.error('Erreur lors de la récupération des emails des abonnés:', error);
     // Throw a new error for further handling in calling functions
    throw new Error('Erreur lors de la récupération des abonnés');
  } finally {
    // Close the MongoDB client to free up resources, regardless of success or failure
    await client.close();
  }
}

// ==========================
// Handling Newsletters with Payload CMS
// ==========================

// Define the Article interface representing the structure of each article in the newsletter
interface Article {
  title: string;
  image: {
    url: string; // URL of the article's image
    alt: string; // Alt text for the image, for accessibility and SEO
  };
  content: {
    children: {
      text: string; // Text content within the article
    }[];
  }[];
}

// Define the Newsletter interface representing the structure of the newsletter
interface Newsletter {
  title: string; // Title of the newsletter
  articles: Article[]; // Array of articles included in the newsletter
}

// Asynchronous function to retrieve the latest newsletter
async function getLatestNewsletter(): Promise<Newsletter> {
  try {
    // Retrieve the most recent document from the 'content-newsletter' collection
    const latestNewsletter = await payload.find({
      collection: 'content-newsletter',
      limit: 1, // Limit the query to one document
      sort: '-publishedDate', // Sort by 'publishedDate' in descending order to get the latest
    });

    // If no newsletters are found, throw an error
    if (latestNewsletter.docs.length === 0) {
      throw new Error('Aucune newsletter trouvée');
    }

    // Cast the retrieved document to the Newsletter type for TypeScript type safety
    const newsletter = latestNewsletter.docs[0] as unknown as Newsletter;

    // Validate the structure of the newsletter object to ensure required fields are present
    if (!newsletter.title || !newsletter.articles) {
      throw new Error('Le format de la newsletter est incorrect');
    }

    // Return the newsletter if all checks are passed
    return newsletter;
  } catch (error) {
    // Log any error encountered during the newsletter retrieval process
    console.error('Erreur lors de la récupération de la newsletter:', error);
    // Throw a new error to be handled by the calling function
    throw new Error('Impossible de récupérer la newsletter');
  }
}

// ==========================
// Sending the Newsletter via SendGrid
// ==========================

// Asynchronous function to send the newsletter email to a list of recipients
async function sendNewsletter(newsletter: Newsletter, recipientEmails: string[]): Promise<void> {
  // Check if there are any subscribers to send the newsletter to; log a message and exit if none
  if (recipientEmails.length === 0) {
    console.log('Aucun abonné pour envoyer la newsletter.');
    return;
  }

  // URLs for assets such as the logo and social media icons to be used in the email content
  const logoURL = 'https://nation-sound-festival-project.onrender.com/media/logoNS.png';
  const facebookIcon = 'https://nation-sound-festival-project.onrender.com/media/facebook.png';
  const twitterIcon = 'https://nation-sound-festival-project.onrender.com/media/twitter.png';
  const instagramIcon = 'https://nation-sound-festival-project.onrender.com/media/instagram.png';
  const snapchatIcon = 'https://nation-sound-festival-project.onrender.com/media/snap.png';
  const linkedinIcon = 'https://nation-sound-festival-project.onrender.com/media/linkedin.png';
  const youtubeIcon = 'https://nation-sound-festival-project.onrender.com/media/youtube.png';

   // Initialize the HTML content of the email with header and newsletter title
  let emailContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #000000; padding: 20px; text-align: center;">
        <a href="https://nation-sound-festival-project-fr2p.vercel.app" style="display: inline-block;">
          <img src="${logoURL}" alt="Festival NationSound Logo" style="width: 100%; max-width: 200px; height: auto; margin-bottom: 10px;">
        </a>
      </div>
      <div style="padding: 20px; background-color: #ffffff;">
        <h1 style="color: #333333;">${newsletter.title}</h1>
  `;
  // Loop through each article in the newsletter to build its HTML content
  newsletter.articles.forEach((article: Article) => {
    const imageUrl = `https://nation-sound-festival-project.onrender.com${article.image.url}`;
    emailContent += `
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="${imageUrl}" alt="${article.image.alt}" style="max-width: 250px; margin-right: 20px;">
        <div>
          <h2 style="color: #333333;">${article.title}</h2>
          <p style="color: #555555;">${article.content[0].children[0].text}</p>
        </div>
      </div>
    `;
  });

  // Add footer with social media links to the email content
  emailContent += `
      </div>
      <div style="background-color: #000000; padding: 20px; text-align: center; color: #ffffff;">
        <p>Suivez-nous sur nos réseaux sociaux :</p>
        <a href="https://facebook.com" target="_blank">
          <img src="${facebookIcon}" alt="Facebook" style="width: 30px; margin: 0 10px;">
        </a>
        <a href="https://twitter.com" target="_blank">
          <img src="${twitterIcon}" alt="Twitter" style="width: 30px; margin: 0 10px;">
        </a>
        <a href="https://instagram.com" target="_blank">
          <img src="${instagramIcon}" alt="Instagram" style="width: 30px; margin: 0 10px;">
        </a>
        <a href="https://snapchat.com" target="_blank">
          <img src="${snapchatIcon}" alt="Snapchat" style="width: 30px; margin: 0 10px;">
        </a>
        <a href="https://youtube.com" target="_blank">
          <img src="${youtubeIcon}" alt="Youtube" style="width: 30px; margin: 0 10px;">
        </a>
        <a href="https://linkedin.com" target="_blank">
          <img src="${linkedinIcon}" alt="LinkedIn" style="width: 30px; margin: 0 10px;">
        </a>
      </div>
    </div>
  `;

  // Define the email message with the recipients, subject, and HTML content
  const msg = {
    to: recipientEmails, // List of email addresses to send the newsletter to
    from: 'c.ledallhazebrouck@ecoles-epsi.net', // Sender's email address
    subject: newsletter.title, // Newsletter title as the email subject
    html: emailContent, // HTML content of the email
  };

  // Log email details for debugging purposes
  console.log("Préparation de l'envoi de l'email avec les détails suivants :");
  console.log("Destinataires :", recipientEmails);
  console.log("Sujet :", newsletter.title);

  try {
    // Attempt to send the newsletter to multiple recipients
    console.log("Envoi de la newsletter à :", recipientEmails);  // Log pour voir les emails
    await sgMail.sendMultiple(msg);
    console.log('Newsletter envoyée avec succès');
  } catch (error) {
    // Log any errors encountered during the email sending process
    console.error("Erreur lors de l'envoi de la newsletter:", error);
  }
}

// ==========================
// Full Process for Sending the Newsletter
// ==========================

// Asynchronous function to retrieve the latest newsletter, get subscriber emails, and send the newsletter
async function processAndSendNewsletter() {
  try {
    // Retrieve the latest newsletter data
    const newsletter = await getLatestNewsletter();
    // Retrieve the list of subscriber emails
    const recipientEmails = await getSubscribersEmails();
    // Log the recipient emails for verification
    console.log("Emails destinataires pour envoi:", recipientEmails); // Ajouter ce log

    // Check if there are any subscribers; if none, log a message and exit the function
    if (recipientEmails.length === 0) {
      console.log("Aucun email d'abonnés pour envoyer la newsletter.");
      return;
    }
    // Send the newsletter to the list of recipient emails
    await sendNewsletter(newsletter, recipientEmails);
  } catch (error) {
    // Log any errors encountered during the newsletter processing and sending process
    console.error("Erreur lors de l'envoi de la newsletter:", error);
  }
}

// Define an endpoint to trigger the sending of the newsletter
app.post('/api/send-newsletter', async (req: Request, res: Response) => {
  try {
    // Call the processAndSendNewsletter function to retrieve and send the latest newsletter
    await processAndSendNewsletter();
    // If successful, respond with a 200 status and success message
    res.status(200).json({ message: 'Newsletter envoyée avec succès !' });
  } catch (error) {
    // If an error occurs, respond with a 500 status and error message
    res.status(500).json({ message: "Erreur lors de l'envoi de la newsletter." });
  }
});

// ==========================
// Handling Concert Pages (slugs)
// ==========================

// Define a GET route to serve artist concert pages based on a given slug
app.get('/concerts/:slug.html', async (req: Request, res: Response) => {
  // Extract the slug parameter from the request URL
  const { slug } = req.params;
  console.log(`Received request for artist slug: ${slug}`); // Log pour vérifier le slug reçu
  try {
    // Query the 'concerts' collection in Payload CMS to find a concert matching the slug
    const concert = await payload.find({
      collection: 'concerts',
      where: { slug: { equals: slug } },
    });

    // If a matching concert is found, retrieve the artist data and render the artist template
    if (concert && concert.docs.length > 0) {
      const artist = concert.docs[0];
      console.log("Données de l'artiste récupérées :", artist); // Log complete artist data
      res.render('artist_template', { artist }); // Render artist template with retrieved data
    } else {
      // If no concert is found, send a 404 status with a "Concert not found" message
      res.status(404).send('Concert non trouvé');
    }
  } catch (error) {
    // Log any errors encountered while retrieving data from Payload CMS
    console.error('Erreur lors de la récupération des données de Payload CMS:', error);
    // Send a 500 status indicating a server error
    res.status(500).send('Erreur serveur');
  }
});

// ==========================
// Points of interest
// ==========================

// Endpoint to fetch points of interest
app.get('/api/points-of-interest', async (req: Request, res: Response) => {
  // Parse the 'limit' query parameter to control the number of results, defaulting to 30 if not provided
  const limit = parseInt(req.query.limit as string, 10) || 30;
  try {
    // Query the 'points-of-interest' collection in Payload CMS with the specified limit and depth
    const pointOfInterest = await payload.find({
      collection: 'points-of-interest', // The collection name in Payload CMS
      limit: limit, // Limit the number of results returned
      depth: 1, // Set depth to 1 to fetch shallow data
    });
    // Respond with the points of interest data as JSON
    res.json(pointOfInterest);
  } catch (error) {
    // Log any errors that occur during the data retrieval process
    console.error("Erreur lors de la récupération des points d'intérêt:", error);
    // Send a 500 status with an error message indicating an issue in fetching the data
    res.status(500).json({ message: "Erreur lors de la récupération des points d'intérêt" });
  }
});

// ==========================
// Handling Media Files
// ==========================

// Define the path to the local 'media' folder
const mediaPath = path.resolve(__dirname, '../media');
console.log('Serving media from: ', mediaPath); // Log the media path for verification

// Serve static files from the 'media' folder for dynamic images
app.use('/media', express.static(mediaPath));

// Serve static files for the frontend
app.use(express.static(path.resolve(__dirname, '../../Frontend')));

// Main route to serve the 'index.html' file for the frontend
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Frontend/index.html'));
});
