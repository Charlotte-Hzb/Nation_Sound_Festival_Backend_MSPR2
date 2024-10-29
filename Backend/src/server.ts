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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Sets EJS as the template engine to generate dynamic HTML pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse HTTP requests with a JSON body and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Limits each IP to 100 requests per 15 minutes to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/newsletter', limiter);

// ==========================
// Connecting to Payload CMS
// ==========================

const MONGODB_URI: string = process.env.MONGODB_URI || '';
if (!MONGODB_URI) {
  throw new Error('MongoDB URI non défini dans le fichier .env');
}

const startPayload = async () => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || '',
      express: app,
      onInit: () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });

    const port = process.env.PORT || 8300;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Erreur lors du démarrage de Payload:', err);
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

app.post('/api/newsletter', async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log("Email reçu pour inscription:", email);  // Ajoutez cette ligne pour voir si l'email est bien reçu

  if (!email) {
    return res.status(400).json({ message: 'Email requis' });
  }

  try {
    const subscriberExists = await payload.find({
      collection: 'subscribers-newsletters',
      where: { email: { equals: email } },
    });

    if (subscriberExists.docs.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà inscrit' });
    }

    await payload.create({
      collection: 'subscribers-newsletters',
      data: { email },
    });
    console.log(`Email enregistré dans MongoDB: ${email}`);

    return res.status(200).json({ message: 'Inscription réussie' });
  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// ==========================
// Fetch Subscribers' Emails
// ==========================
// Connexion à MongoDB
const client = new MongoClient(process.env.MONGODB_URI || '');
const dbName = 'test';
const collectionName = 'subscribers-newsletters';

async function getSubscribersEmails(): Promise<string[]> {
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('subscribers-newsletters');

    const subscribers = await collection.find().toArray();
    const emailList = subscribers.map((subscriber) => {
      const { email } = subscriber as unknown as { email: string };
      return email;
    });

    console.log("Emails récupérés:", emailList);  // Vérifiez les emails récupérés

    return emailList;
  } catch (error) {
    console.error('Erreur lors de la récupération des emails des abonnés:', error);
    throw new Error('Erreur lors de la récupération des abonnés');
  } finally {
    await client.close();
  }
}

// ==========================
// Handling Newsletters with Payload CMS
// ==========================

interface Article {
  title: string;
  image: {
    url: string;
    alt: string;
  };
  content: {
    children: {
      text: string;
    }[];
  }[];
}

interface Newsletter {
  title: string;
  articles: Article[];
}

async function getLatestNewsletter(): Promise<Newsletter> {
  try {
    const latestNewsletter = await payload.find({
      collection: 'content-newsletter',
      limit: 1,
      sort: '-publishedDate',
    });

    if (latestNewsletter.docs.length === 0) {
      throw new Error('Aucune newsletter trouvée');
    }

    const newsletter = latestNewsletter.docs[0] as unknown as Newsletter;

    if (!newsletter.title || !newsletter.articles) {
      throw new Error('Le format de la newsletter est incorrect');
    }

    return newsletter;
  } catch (error) {
    console.error('Erreur lors de la récupération de la newsletter:', error);
    throw new Error('Impossible de récupérer la newsletter');
  }
}

// ==========================
// Sending the Newsletter via SendGrid
// ==========================

async function sendNewsletter(newsletter: Newsletter, recipientEmails: string[]): Promise<void> {
  if (recipientEmails.length === 0) {
    console.log('Aucun abonné pour envoyer la newsletter.');
    return;
  }

  const logoURL = 'https://nation-sound-festival-project.onrender.com/media/logoNS.png';
  const facebookIcon = 'https://nation-sound-festival-project.onrender.com/media/facebook.png';
  const twitterIcon = 'https://nation-sound-festival-project.onrender.com/media/twitter.png';
  const instagramIcon = 'https://nation-sound-festival-project.onrender.com/media/instagram.png';
  const snapchatIcon = 'https://nation-sound-festival-project.onrender.com/media/snap.png';
  const linkedinIcon = 'https://nation-sound-festival-project.onrender.com/media/linkedin.png';
  const youtubeIcon = 'https://nation-sound-festival-project.onrender.com/media/youtube.png';

  let emailContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #000000; padding: 20px; text-align: center;">
        <a href="https://nation-sound-festival-project-fr2p-jqnwvymdb.vercel.app" style="display: inline-block;">
          <img src="${logoURL}" alt="Festival NationSound Logo" style="width: 100%; max-width: 200px; height: auto; margin-bottom: 10px;">
        </a>
      </div>
      <div style="padding: 20px; background-color: #ffffff;">
        <h1 style="color: #333333;">${newsletter.title}</h1>
  `;

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

  const msg = {
    to: recipientEmails,
    from: 'c.ledallhazebrouck@ecoles-epsi.net',
    subject: newsletter.title,
    html: emailContent,
  };

  console.log("Préparation de l'envoi de l'email avec les détails suivants :");
  console.log("Destinataires :", recipientEmails);
  console.log("Sujet :", newsletter.title);

  try {
    console.log("Envoi de la newsletter à :", recipientEmails);  // Log pour voir les emails
    await sgMail.sendMultiple(msg);
    console.log('Newsletter envoyée avec succès');
  } catch (error) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
  }
}

// ==========================
// Full Process for Sending the Newsletter
// ==========================
async function processAndSendNewsletter() {
  try {
    const newsletter = await getLatestNewsletter();
    const recipientEmails = await getSubscribersEmails();
    console.log("Emails destinataires pour envoi:", recipientEmails); // Ajouter ce log

    if (recipientEmails.length === 0) {
      console.log("Aucun email d'abonnés pour envoyer la newsletter.");
      return;
    }
    await sendNewsletter(newsletter, recipientEmails);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
  }
}

// API to send the newsletter
app.post('/api/send-newsletter', async (req: Request, res: Response) => {
  try {
    await processAndSendNewsletter();
    res.status(200).json({ message: 'Newsletter envoyée avec succès !' });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi de la newsletter." });
  }
});

// ==========================
// Handling Concert Pages (slugs)
// ==========================
app.get('/concerts/:slug.html', async (req: Request, res: Response) => {
  const { slug } = req.params;
  console.log(`Received request for artist slug: ${slug}`); // Log pour vérifier le slug reçu
  try {
    const concert = await payload.find({
      collection: 'concerts',
      where: { slug: { equals: slug } },
    });

    if (concert && concert.docs.length > 0) {
      const artist = concert.docs[0];
      console.log("Données de l'artiste récupérées :", artist); // Log complet de l'artiste
      res.render('artist_template', { artist });
    } else {
      res.status(404).send('Concert non trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données de Payload CMS:', error);
    res.status(500).send('Erreur serveur');
  }
});

// ==========================
// Points of interest
// ==========================

// Endpoint to fetch points of interest
app.get('/api/points-d-interet', async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 30;
  try {
    const pointsDInteret = await payload.find({
      collection: 'points-d-interet',
      limit: limit,
      depth: 1,
    });
    res.json(pointsDInteret);
  } catch (error) {
    console.error("Erreur lors de la récupération des points d'intérêt:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des points d'intérêt" });
  }
});

// ==========================
// Handling Media Files
// ==========================

// Définir le chemin vers le dossier 'media' local
const mediaPath = path.resolve(__dirname, '../media');
console.log('Serving media from: ', mediaPath);

// Servir les fichiers du dossier media pour les images dynamiques
app.use('/media', express.static(mediaPath));

// Servir les fichiers statiques de votre frontend
app.use(express.static(path.resolve(__dirname, '../../Frontend')));

// Route principale pour le fichier index.html de votre frontend
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Frontend/index.html'));
});
