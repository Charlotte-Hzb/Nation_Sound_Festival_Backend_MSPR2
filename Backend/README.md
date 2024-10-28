# Festival NationSound 🎵

## Description

Le projet **NationSound Festival** est une application web dynamique permettant de gérer les artistes (date, scène, horaires, type de musique et description), les informations de sécurité et actualités, la localisation des points d'intérêts et les newsletters du festival. Ce projet est construit avec **Node.js**, **Payload CMS**, **MongoDB**, et **MySQL**.

## Prérequis

Avant d'installer et de lancer le projet, assurez-vous d'avoir installé ces éléments :

- **Node.js** (version 14.x ou supérieure)
- **MongoDB** (Atlas ou local)
- **MySQL** (version 8.x ou supérieure)
- **NPM** (Node Package Manager)
- **SendGrid** (pour l'envoi des newsletters)
- **Payload CMS** (pour la gestion du contenu)
- **Git** (pour cloner le dépôt)
- **http-server** (pour servir les fichiers front-end)

## Installation

### 1. Clonez le projet depuis le dépôt GitHub

`git clone https://github.com/tonrepo/festival.git`
`cd festival`

### 2. Installez les dépendances

Après avoir cloné le projet, installez les dépendances requises via NPM.
`npm install`

### 3. Configuration des variables d'environnement

Créez un fichier .env à la racine du projet et configurez-le avec vos propres valeurs :

`MONGODB_URI=your_mongodb_uri`
`PAYLOAD_SECRET=your_payload_secret`
`SENDGRID_API_KEY=your_sendgrid_api_key`
`PORT=8300`

### 4. Démarrage du serveur en mode développement

Une fois la configuration terminée, démarrez l'application en mode développement :

`npm run dev`

L'application sera accessible sur http://localhost:8300/admin.

## Déploiement

### 1. Déploiement local

Pour déployer le projet sur un environnement local, suivez ces étapes :

Assurez-vous que MongoDB et MySQL sont configurés et que les variables d'environnement sont correctement définies.

Démarrer un serveur local qui servira les fichiers front-end, en lançant http-server dans le dossier où se trouvent les fichiers front-end :

`http-server frontend -p 8080`

L'application sera accessible sur http://localhost:8080.

<!--
Avantages d'utiliser deux ports différents pour le frontend et le backend :

+ Séparation claire entre le front-end et le back-end : Chaque partie de l'application (UI et API) est gérée séparément sur des ports différents.
+ Développement simplifié : permet de modifier facilement le code du back-end ou du front-end sans interférer avec l'autre. Le front-end peut faire des requêtes AJAX vers le port 8300 pour obtenir des données du back-end.-->

### 2. Déploiement sur un serveur de production

1. Créez une application Heroku

2. Configurez les variables d'environnement sur Heroku

3. Poussez votre code vers Heroku

## Fonctionnalités principales

- Gestion des artistes et des concerts : Ajoutez, modifiez et supprimez des artistes via l'interface admin de Payload CMS.
- Gestion des points d'intérêt : Affichez et gérez les points d'intérêt (scènes, buvettes, etc.) sur une carte interactive avec Leaflet.js.
- Inscription à la newsletter : Les utilisateurs peuvent s'inscrire à la newsletter pour recevoir des informations sur le festival.
- Envoi de newsletters : Utilisation de SendGrid pour envoyer des newsletters aux abonnés.
- Affichage des actualités : Les dernières nouvelles sont affichées en temps réel avec un système de pagination automatique.

## Architecture du projet

- /dist : Contient les fichiers transpilés lors du build.
- /src : Contient le code source du serveur, les fichiers principaux de l'application ainsi que les dossiers :
  /src/collections : Définitions des collections Payload CMS pour les concerts, les artistes, et les points d'intérêt.
  /src/media : Contient les fichiers médias téléversés.
  /src/views : Contient les fichiers de templates EJS pour les pages HTML rendues côté serveur.

## API Endpoints

### 1. /api/newsletter (POST)

Description : Inscription d'un utilisateur à la newsletter.
Méthode HTTP : POST
Requête :

- URL : api/newsletter
- Données envoyées : `"email": "user@example.com"`
- Réponse :
  200 : Inscription réussie.
  400 : Cet email est déjà inscrit.

### 2. /api/send-newsletter (POST)

Description : ie la dernière newsletter à tous les abonnés inscrits.
Méthode HTTP : POST
Requête :

- URL : api/send-newsletter
- Réponse :
  200 : Newsletter envoyée avec succès !
  500 : Erreur lors de l'envoi de la newsletter.

### 3. /concerts/ (GET)

Description : Récupère et affiche les détails d'un concert spécifique en fonction de son slug.
Méthode HTTP : GET
Requête :

- URL : concerts/:slug
- Paramètre : slug : Le slug unique du concert pour identifier le concert spécifique.
- Réponse :
  200 : Le concert est trouvé et ses détails sont affichés.
  404 : Concert non trouvé.

## Sécurité

- Protection contre les attaques XSS : Utilisation des modèles EJS avec des pratiques de sécurité pour éviter les injections de scripts.
- CORS : Configuration des en-têtes CORS pour limiter les requêtes à des domaines spécifiques.
- Limitation du débit : Utilisation de express-rate-limit pour limiter les requêtes API à 100 requêtes par IP toutes les 15 minutes.
- Content Security Policy (CSP) : Ajout de règles de Content Security Policy pour renforcer la sécurité des contenus embarqués.
- Utilisation de Payload CMS : Sécurisation des opérations d'authentification avec une clé secrète.
