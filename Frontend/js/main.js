// ==========================
// Carousel Initialization
// ==========================

// Initialize carousel logo with Slick
$(document).ready(function () {
    $('.carousel').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        dots: false,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1200, // breakpoint for large screens (desktop)
                settings: {
                    slidesToShow: 6,
                }
            },
            {
                breakpoint: 992, // breakpoint for tablets
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768, // breakpoint for tablets
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480, // breakpoint for mobile
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
});

// ==========================
// Featured Artists Display 
// ==========================

// Shuffle and display random artists
const artists = [
    {
        name: 'Neon Pulse',
        description: 'Ce duo électrisant fusionne des beats envoûtants et des mélodies synthétiques pour offrir un cocktail musical puissant et réconfortant où la pop et le brass band se rencontrent ! [...]',
        image: 'https://nation-sound-festival-project.onrender.com/media/mike-cox-MEAXhjcnHEE-unsplash-side1.jpg',
        url: 'https://nation-sound-festival-project.onrender.com/concerts/artist_neon_pulse.html'
    },
    {
        name: 'Electric Echoes',
        description: 'Mud Deep, co-fondatrice de D.KO Records et génie de la musique électronique, s\'apprête à enflammer la scène. Préparez-vous pour un set aux petits oignons avec cette maestro créative ! [...]',
        image: 'https://nation-sound-festival-project.onrender.com/media/vidar-nordli-mathisen-CTlRgg7Gfmw-unsplash-slide2.jpg',
        url: 'https://nation-sound-festival-project.onrender.com/concerts/artist_electric_echoes.html'
    },
    {
        name: 'Luminous Beats',
        description: 'Orion est connu pour ses collaborations avec les plus grands noms de l\'électro et ses remix audacieux. Il ne cesse de repousser les limites de la créativité musicale avec ses tubes flamboyants. [...]',
        image: 'https://nation-sound-festival-project.onrender.com/media/vidar-nordli-mathisen-IT5-0oM0YH0-unsplash-slide3.jpg',
        url: 'https://nation-sound-festival-project.onrender.com/concerts/artist_luminous_beats.html'
    },
    {
        name: 'Galactic Groove',
        description: 'Galactic Groove est un groupe révolutionnaire qui marie des rythmes électroniques hypnotiques à des mélodies entraînantes. Leur musique est un voyage sonore unique qui transporte l\'auditeur [...]',
        image: 'https://nation-sound-festival-project.onrender.com/media/vidar-nordli-mathisen-szmET3Kja8s-unsplash-slide5.jpg',
        url: 'https://nation-sound-festival-project.onrender.com/concerts/artist_galactic_groove.html'
    },
    {
        name: 'Synthwave Surge',
        description: 'Synthwave Surge, avec sa voix envoûtante et ses mélodies soul fusionnées à des rythmes électroniques, offre une performance riche en émotions. Son style unique capte l\'attention et fait vibrer [...]',
        image: 'https://nation-sound-festival-project.onrender.com/media/2150639041.jpg',
        url: 'https://nation-sound-festival-project.onrender.com/concerts/artist_synthwave_surge.html'
    },
    {
        name: 'PULSE ECHO',
        description: 'Pulse Echo est connue pour ses performances dynamiques et ses rythmes contagieux qui font danser les foules. Sa musique est une fusion innovante de genres qui crée une atmosphère festive [...]',
        image: 'https://nation-sound-festival-project.onrender.com/media/2148325414.jpg',
        url: 'https://nation-sound-festival-project.onrender.com/concerts/artist_pulse_echo.html'
    },
];

// Fonction de mélange des artistes
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Sélection de 3 artistes aléatoires
const randomArtists = shuffle(artists).slice(0, 3);

// Fonction d'affichage des artistes aléatoires
function displayRandomArtists() {
    const container = document.getElementById('featured-artists');
    if (!container) {
        console.error('Element #featured-artists not found');
        return;
    }

    randomArtists.forEach(artist => {
        const cardHtml = `
            <div class="col-12 col-md-4 mb-3">
              <div class="card">
                <img src="${artist.image}" class="card-img-top img-card-hp" alt="${artist.name}">
                <div>
                  <p class="group-title pt-3">${artist.name}</p>
                  <p class="p-3 text-justify">${artist.description}</p>
                  <div class="d-flex justify-content-center align-items-center mb-4">
                    <a href="${artist.url}"><button type="button" class="btn btn-outline-orange text-uppercase">En savoir +</button></a>
                  </div>
                </div>
              </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

// Lancer l'affichage après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    displayRandomArtists();
});

// ==========================
// Newsletter Subscription 
// ==========================

// Submits email for newsletter subscription
function submitNewsletter() {
    // Selects the input field where the user enters their email address
    const emailField = document.getElementById('newsletterEmail');
    // Retrieves the value entered in the email input field
    const email = emailField.value;

    // Checks if the email field is empty
    if (!email) {
        alert('Veuillez entrer un email valide.');
        // Stops the function from continuing if the email is not provided
        return;
    }

    // Send POST request to the API for newsletter subscription
    // This line sends a POST request to the provided URL with the user's email as the data payload. 
    // This request is intended to add the user’s email to the newsletter subscription list.
    axios.post('https://nation-sound-festival-project.onrender.com/api/newsletter', { email: email })
        // If the request is successful, this .then block is executed and an alert is displayed to the user saying "Subscription successful".  
        .then(response => {
            console.log(response.data.message);
            alert('Inscription réussie');
            emailField.value = ''; // Clear the field
        })
        //  If there is an error during the request, this .catch block is executed.
        .catch(error => {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Une erreur est survenue lors de l\'inscription.');
            }
        });
}

// This function validates whether the provided email address follows the correct format (e.g., contains "@" and a valid domain).
// It uses a regular expression to test the email format.
// This validation is useful to prevent incorrect email submissions before sending data to an API or storing it in a database.
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase()); // The email address to validate. Returns true if the email format is valid, otherwise false.
}

// ==========================
// Breaking News Display 
// ==========================

/// Retrieve breaking news from the Payload API with pagination
const baseURL = 'https://nation-sound-festival-project.onrender.com/api/breaking-news';
let currentPage = 1;
const newsPerPage = 1;

// Fetch breaking news with pagination
async function fetchBreakingNews(page = 1) {
    try {
        const response = await fetch(`${baseURL}?limit=${newsPerPage}&page=${page}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        displayBreakingNews(data.docs || []);
        setupPagination(data.totalPages || 1, page);
    } catch (error) {
        console.error('Erreur lors de la récupération des actualités:', error);
    }
}

// Display breaking news
function displayBreakingNews(newsItems) {
    // Selects the HTML element with the ID breaking-news-banner, which is where the breaking news items will be displayed.
    // The selected element is stored in the "banner" variable.
    const banner = document.getElementById('breaking-news-banner');
    banner.innerHTML = ''; // Clear old news

    // ForEach loop that iterates over each news item in the newsItems array.
    newsItems.forEach(news => {
        //The ${} syntax is used to embed the variable directly into the HTML string.
        const newsItem = `
      <div class="news-item">
        <h3>${news.title}</h3> 
        <p>${news.content}</p>
      </div>
    `;
        // This appends the newly created HTML string (representing the news item) to the innerHTML of the "banner" element, adding the news item to the displayed list.
        banner.innerHTML += newsItem;
    });
}

// Setup pagination with round dots 
function setupPagination(totalPages, currentPage) {
    // Selection of the HTML element with the ID "pagination"
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Reset pagination 

    // For loop that runs from 1 to totalPages.
    // For each iteration, it creates a new pagination dot (representing a page).
    for (let i = 1; i <= totalPages; i++) {
        const pageDot = document.createElement('span'); // Create a span instead of a button. Provides flexibility for styling the pagination.
        pageDot.classList.add('page-dot'); // adds the CSS class page-dot to the newly created <span> element.
        if (i === currentPage) {
            pageDot.classList.add('active'); // Activate the current page dot
        }
        // When a user clicks on a dot, it will call the fetchBreakingNews function, passing the page number (i), to load the corresponding page of news.
        pageDot.addEventListener('click', () => fetchBreakingNews(i));
        paginationContainer.appendChild(pageDot); // Add the dot to the pagination
    }
}

// Automatically slide to the next page every 5 seconds
function startAutoSlide(totalPages) {
    // This method starts a timer that executes the given function repeatedly at a specified interval.
    setInterval(() => {
        currentPage = currentPage < totalPages ? currentPage + 1 : 1; // If the last page is reached, go back to the first one
        // This function fetches the breaking news for the specified page.
        fetchBreakingNews(currentPage);
    }, 5000); // 5000 milliseconds = 5 seconds
}

// Call to fetch breaking news when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    // This function fetches the latest breaking news data from the server. The returned data is then stored in the "data" variable.
    const data = await fetchBreakingNews();
    // Retrieve the total number of pages
    // If totalPages is not available or is undefined, it defaults to 1.
    // This ensures that there is at least one page for the news.
    const totalPages = data.totalPages || 1;
    // Start the automatic slide scrolling every 5 slides
    startAutoSlide(totalPages);
});

// ==========================
// Vue.js Integration for Artists and Map
// ==========================

// Vue.js will handle reactivity for any changes in the data and update the DOM accordingly.
new Vue({
    el: '#app',
    data: {
        artists: [],
        filteredArtists: [],
        activeFilter: '',
        uniqueDates: [],
        uniqueTypes: [],
        uniqueScenes: [],
        map: null,
        markers: [],
        userMarker: null
    },
    methods: {
        // The fetchArtists method retrieves data from an API using axios and stores the data in the "artists" array.
        // This method also initializes filters and sorts the concerts by ascending date.
        fetchArtists() {
            axios.get('https://nation-sound-festival-project.onrender.com/api/concerts?limit=15')
                .then(response => {
                    console.log("Données reçues :", response.data.docs);
                    this.artists = response.data.docs;

                    // Sort the concerts by ascending date
                    this.artists.sort((a, b) => new Date(a.date) - new Date(b.date));

                    // Extraction of unique dates from the list of concerts and storing in the uniqueDates array.
                    // It uses the Set object to filter out duplicate dates.
                    this.uniqueDates = [...new Set(this.artists.map(artist => new Date(artist.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })))];

                    this.uniqueTypes = [...new Set(this.artists.map(artist => artist.type.charAt(0).toUpperCase() + artist.type.slice(1)))];
                    this.uniqueScenes = [...new Set(this.artists.map(artist => artist.scene))];

                    // Update the filtered artists with the complete data
                    this.filteredArtists = this.artists;

                    // This loop formats the concert dates for display in a human-readable format.
                    this.filteredArtists.forEach(artist => {
                        const eventDate = new Date(artist.date);
                        artist.formattedDate = eventDate.toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    });
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des artistes:', error);
                });
        },

        // Show filter options
        // It takes a filter parameter, which is the filter type (e.g., date, genre, scene) that the user is trying to toggle.
        showFilterOptions(filter) {
            this.activeFilter = this.activeFilter === filter ? '' : filter;
        },

        // Filter artists by criteria
        filterBy(filter, value = '') {
            if (filter === 'all') {
                // No filter, all artists displayed
                this.filteredArtists = this.artists;
            } else {
                // Otherwise, the method applies the specified filter
                this.filteredArtists = this.artists.filter(artist => artist[filter] === value);
            }
            // After applying the filter, it resets activeFilter to an empty string, which hides the filter options in the UI.
            this.activeFilter = '';
        },

        // Retrieve image URL
        getImageURL(image) {
            console.log('Fetching image URL for:', image);
            // This function checks if the image object exists, and if it has a sizes property with a card size defined.
            // If so, it constructs the URL based on the card size (image.sizes.card.url).
            if (image && image.sizes && image.sizes.card) {
                return `https://nation-sound-festival-project.onrender.com${image.sizes.card.url}`;
                // If no card size is found but the image object contains a general url, it falls back to this URL.
            } else if (image && image.url) {
                return `https://nation-sound-festival-project.onrender.com${image.url}`;
            }
            // If the image is undefined or neither sizes.card nor url is present, it returns a default image URL.
            return 'https://nation-sound-festival-project.onrender.com/media/mike-cox-MEAXhjcnHEE-unsplash-side1-2.jpg';
        },

        // Retrieve concert URL with slug or name.
        // This function ensures that each artist has a unique and consistent URL based on their name or slug, making it easy to link to specific concert pages.
        getConcertUrl(artist) {
            const artistSlug = artist.slug.replace('.html', '');
            return `https://nation-sound-festival-project.onrender.com/concerts/${artist.slug}.html`;
        },

        // Fetch locations and points of interest
        fetchLocations() {
            // Sending a GET request to the Payload API to retrieve points of interest, limited to 30 items.
            axios.get('https://nation-sound-festival-project.onrender.com/api/points-d-interet?limit=30')
                .then(response => {
                    // Extracting the data (points of interest) from the API response.
                    const locations = response.data.docs;
                    // Passing the retrieved points of interest to the addMarkers method to place them on the map.
                    this.addMarkers(locations);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des points d\'intérêt:', error);
                });
        },

        // Add map markers
        addMarkers(locations) {
            // Define icons for different types of points of interest (Accueil, WC, Scene, etc.) using Leaflet's icon method.
            const icons = {
                Accueil: L.icon({
                    iconUrl: '/assets/images/807853_file.png',
                    iconSize: [32, 32]
                }),
                WC: L.icon({
                    iconUrl: '/assets/images/34710029_8209081.png',
                    iconSize: [32, 32]
                }),
                Scène: L.icon({
                    iconUrl: '/assets/images/35581312_012843528523.png',
                    iconSize: [32, 32]
                }),
                Buvette: L.icon({
                    iconUrl: '/assets/images/1010199_OIUFKV1.png',
                    iconSize: [32, 32]
                }),
                Shop: L.icon({
                    iconUrl: '/assets/images/10608601_43160.png',
                    iconSize: [32, 32]
                })
            };

            locations.forEach(point => {
                // For each location (point), create a marker using Leaflet's L.marker method, passing the latitude and longitude of the point.
                const marker = L.marker([point.lat, point.lng], { icon: icons[point.type] }).addTo(this.map)
                    //Create a marker at the point's latitude and longitude, with the corresponding icon. Add the marker to the map.
                    .bindPopup(`<b>${point.name}</b><br>${point.type}`);
                // Bind a popup to the marker, showing the point's name and type when clicked.
                this.markers.push(marker);
                // Add the newly created marker to the markers array for potential future reference or manipulation.
            });
        },

        // Filter map markers by type
        filterMarkers(type) {
            // Loop through each marker stored in the markers array.
            this.markers.forEach(marker => {
                const popupContent = marker.getPopup().getContent();
                // Get the content of the popup associated with the current marker.
                if (type === 'all' || popupContent.includes(type)) {
                    marker.addTo(this.map);
                    // If the filter is "all" or if the popup content includes the selected type, add the marker to the map.
                } else {
                    this.map.removeLayer(marker);
                    // Otherwise, remove the marker from the map.
                }
            });
        },

        // Initialize map
        initializeMap() {
            // Initializes the Leaflet map with a view centered on the coordinates of the Parc Floral.
            this.map = L.map('map').setView([48.838398, 2.443060], 17);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
            // Adds the map from OpenStreetMap and gives credit to OpenStreetMap contributors.

            L.control.fullscreen().addTo(this.map);
            // Adds a fullscreen control to the map, allowing users to view the map in fullscreen mode.

            this.fetchLocations();
            // Calls the function to fetch points of interest from the API and display them on the map.
        },

        // Locate user
        locateUser() {
            // Checks if the browser supports geolocation. If not, it displays an alert and exits the function.
            if (!navigator.geolocation) {
                alert('Géolocalisation non supportée par votre navigateur');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                    // Retrieves the user's current position (latitude and longitude) and stores it in the variable `userLatLng`.
                    const { latitude, longitude } = position.coords;
                    const userLatLng = [latitude, longitude];

                    // If a marker for the user's position already exists on the map, remove it.
                    if (this.userMarker) {
                        this.map.removeLayer(this.userMarker);
                    }

                    // Adds a marker at the user's current position with a popup displaying "You are here" and opens the popup.
                    this.userMarker = L.marker(userLatLng).addTo(this.map)
                        .bindPopup('<b>Vous êtes ici</b>')
                        .openPopup();

                    // Adjusts the map view to center on the user's current location with a zoom level of 17.
                    this.map.setView(userLatLng, 17);
                },
                () => {
                    // If there's an error in obtaining the user's position, an alert is displayed.
                    alert('Impossible de récupérer votre position');
                }
            );
        }
    },
    created() {
        this.fetchArtists();
    },
    mounted() {
        // Initialize the map when the page loads
        this.initializeMap();
    }
});
