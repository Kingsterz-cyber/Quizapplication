document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Animate .card-1 on scroll
    const cards = document.querySelectorAll('.card-1');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Show category page
    const startQuizButtons = document.querySelectorAll('.button1');
    const slidingPage = document.getElementById('slidingPage');
    startQuizButtons.forEach(button => {
        button.addEventListener('click', () => {
            slidingPage.classList.add('active');
        });
    });

    // Show subcategories
    const categoryCards = document.querySelectorAll('.card-category-home');
    const subCategoryCards = document.querySelectorAll('.card-category-card');
    const slidingCardsPage = document.getElementById('slidingCardsPage');
    const returnFromCategory = document.getElementById('exitbutton');
    const returnHome = document.getElementById('exitButton');

    categoryCards.forEach(categoryCard => {
        categoryCard.addEventListener('click', () => {
            const selectedCategory = categoryCard.getAttribute('data-category');
            slidingCardsPage.classList.add('active');

            subCategoryCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.classList.toggle('show', cardCategory === selectedCategory);
            });
        });
    });

    returnFromCategory?.addEventListener('click', () => {
        slidingCardsPage.classList.remove('active');
    });

    returnHome?.addEventListener('click', () => {
        slidingPage.classList.remove('active');
    });

    // Quiz logic
    const quizCards = document.querySelectorAll('.card-category-card'); // Select all subcategory cards
    const slidingQuizPage = document.getElementById('slidingQuizPage'); // Quiz page container
    const questionBox = document.getElementById('questionBox'); // Question box
    const optionsContainer = document.getElementById('optionsContainer'); // Options container
    const progressBar = document.getElementById('progressBar'); // Progress bar
    const progressText = document.getElementById('progressText'); // Progress text
    const nextButton = document.getElementById('nextButton'); // Next button
    let score = 0;
    let currentQuestionIndex = 0;
    let currentQuiz = [];
    let currentSubcategory = '';

    let loadCount = 0;
    const MAX_LOADS = 1; // Allow loading 1 time

    const allQuestions = {
             "world-facts": [
  { question: "What is the largest ocean?", options: ["Atlantic", "Pacific", "Indian", "Arctic"], correct: 1 },
  { question: "What is the capital city of Canada?", options: ["Toronto", "Ottawa", "Vancouver", "Montreal"], correct: 1 },
  { question: "Which country is known as the Land of the Rising Sun?", options: ["China", "Japan", "Thailand", "South Korea"], correct: 1 },
  { question: "What is the smallest country in the world?", options: ["Vatican City", "Monaco", "Nauru", "Malta"], correct: 0 },
  { question: "Which continent is known as the Dark Continent?", options: ["Asia", "Africa", "South America", "Australia"], correct: 1 },
  { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
  { question: "Which country has the most natural lakes?", options: ["Canada", "USA", "Russia", "India"], correct: 0 },
  { question: "What is the largest desert in the world?", options: ["Sahara", "Arabian", "Gobi", "Kalahari"], correct: 0 },
  { question: "Which country is home to the kangaroo?", options: ["Australia", "New Zealand", "USA", "Canada"], correct: 0 },
  { question: "What is the capital city of Australia?", options: ["Sydney", "Canberra", "Melbourne", "Brisbane"], correct: 1 },

  // Additional 10 questions
  { question: "Which mountain is the tallest in the world?", options: ["Mount Kilimanjaro", "K2", "Mount Everest", "Denali"], correct: 2 },
  { question: "Which planet is closest to the sun?", options: ["Earth", "Mars", "Mercury", "Venus"], correct: 2 },
  { question: "What is the official language of Brazil?", options: ["Spanish", "Portuguese", "French", "English"], correct: 1 },
  { question: "Which city is known as the City of Love?", options: ["New York", "Rome", "Paris", "Venice"], correct: 2 },
  { question: "Which country has the most people?", options: ["India", "USA", "Indonesia", "China"], correct: 3 },
  { question: "Which country is famous for tulips and windmills?", options: ["Switzerland", "Netherlands", "Denmark", "Belgium"], correct: 1 },
  { question: "Where are the Pyramids of Giza located?", options: ["Mexico", "Iraq", "Greece", "Egypt"], correct: 3 },
  { question: "What is the coldest continent?", options: ["Asia", "Antarctica", "Europe", "North America"], correct: 1 },
  { question: "Which sea lies between Africa and Europe?", options: ["Baltic Sea", "Arabian Sea", "Mediterranean Sea", "Red Sea"], correct: 2 },
  { question: "Which country has the Eiffel Tower?", options: ["France", "Italy", "Germany", "Belgium"], correct: 0 }
]
,
     "movies-series": [
  { question: "Who directed Titanic?", options: ["James Cameron", "Steven Spielberg", "Christopher Nolan", "Michael Bay"], correct: 0 },
  { question: "What is the highest-grossing film of all time?", options: ["Avatar", "Titanic", "Star Wars: The Force Awakens", "Avengers: Endgame"], correct: 0 },
  { question: "Who played the Joker in 'The Dark Knight'?", options: ["Jared Leto", "Heath Ledger", "Joaquin Phoenix", "Jack Nicholson"], correct: 1 },
  { question: "Which actor played Iron Man in the MCU?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 1 },
  { question: "Which of these is NOT a Quentin Tarantino film?", options: ["Pulp Fiction", "The Hateful Eight", "No Country for Old Men", "Kill Bill"], correct: 2 },
  { question: "Who won Best Actor Oscar for 'Joker' (2019)?", options: ["Leonardo DiCaprio", "Joaquin Phoenix", "Adam Driver", "Antonio Banderas"], correct: 1 },
  { question: "Which TV show features the Red Wedding?", options: ["Vikings", "The Witcher", "Game of Thrones", "Outlander"], correct: 2 },
  { question: "What is the highest-grossing animated film of all time?", options: ["Frozen II", "The Lion King (2019)", "Demon Slayer: Mugen Train", "Minions"], correct: 1 },
  { question: "Which director created the 'Dark Universe' series?", options: ["Christopher Nolan", "Guillermo del Toro", "Alex Kurtzman", "David Fincher"], correct: 2 },
  { question: "What was the first Marvel movie in the MCU?", options: ["Spider-Man", "X-Men", "Iron Man", "The Incredible Hulk"], correct: 2 },

  // Additional 10 questions
  { question: "What is Eleven's power in Stranger Things?", options: ["Invisibility", "Time travel", "Telekinesis", "Super speed"], correct: 2 },
  { question: "Who played Jack in Titanic?", options: ["Brad Pitt", "Tom Cruise", "Leonardo DiCaprio", "Matt Damon"], correct: 2 },
  { question: "Which movie features a character named Neo?", options: ["Inception", "Matrix", "Blade Runner", "Interstellar"], correct: 1 },
  { question: "Which film series features Hogwarts School?", options: ["Twilight", "Narnia", "Harry Potter", "Percy Jackson"], correct: 2 },
  { question: "Who voices Woody in Toy Story?", options: ["Tom Hanks", "Tim Allen", "Robin Williams", "Will Smith"], correct: 0 },
  { question: "Which film is about dreams within dreams?", options: ["Memento", "Shutter Island", "Inception", "Tenet"], correct: 2 },
  { question: "Which superhero is known as the 'Caped Crusader'?", options: ["Iron Man", "Batman", "Spider-Man", "Superman"], correct: 1 },
  { question: "In which series is there a character named Walter White?", options: ["Breaking Bad", "The Sopranos", "Narcos", "Better Call Saul"], correct: 0 },
  { question: "Which series features a coffee shop called Central Perk?", options: ["How I Met Your Mother", "Friends", "The Office", "Seinfeld"], correct: 1 },
  { question: "Who played Black Panther in the MCU?", options: ["Anthony Mackie", "Chadwick Boseman", "Michael B. Jordan", "Don Cheadle"], correct: 1 }
]
,"programming-basics": [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"], correct: 0 },
    { question: "Which language is used for styling web pages?", options: ["HTML", "CSS", "JavaScript", "XML"], correct: 1 },
    { question: "Which is not a programming language?", options: ["Python", "Java", "HTML", "C++"], correct: 2 },
    { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Colorful Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], correct: 0 },
    { question: "Which HTML tag is used to define an internal style sheet?", options: ["<style>", "<css>", "<script>", "<link>"], correct: 0 },
    { question: "Which is the correct CSS syntax?", options: ["body {color: black;}", "{body;color:black;}", "{body;color:black;}", "body:color=black;"], correct: 0 },
    { question: "How do you insert a comment in a CSS file?", options: ["// this is a comment", "<!-- this is a comment -->", "/ this is a comment /", "* this is a comment *"], correct: 2 },
    { question: "Which property is used to change the background color?", options: ["bgcolor", "color", "background-color", "background"], correct: 2 },
    { question: "How do you select an element with id 'demo' in CSS?", options: ["#demo", ".demo", "*demo*", "@demo"], correct: 0 },
    { question: "Which HTML attribute is used to define inline styles?", options: ["class", "style", "font", "styles"], correct: 1 },

    
    { question: "Which symbol is used for single-line comments in JavaScript?", options: ["//", "/*", "<!--", "#"], correct: 0 },
    { question: "Which of these is a JavaScript data type?", options: ["number", "decimal", "character", "alphabet"], correct: 0 },
    { question: "Which operator is used to assign a value to a variable?", options: ["=", "==", "===", ":"], correct: 0 },
    { question: "How do you write 'Hello World' in an alert box in JavaScript?", options: ["msg('Hello World')", "alertBox('Hello World')", "alert('Hello World')", "msgBox('Hello World')"], correct: 2 },
    { question: "Which tag is used to include JavaScript in an HTML page?", options: ["<script>", "<js>", "<javascript>", "<code>"], correct: 0 },
    { question: "What is the correct syntax to refer to an external script?", options: ["<script href='app.js'>", "<script name='app.js'>", "<script src='app.js'>", "<script file='app.js'>"], correct: 2 },
    { question: "Which keyword is used to declare a JavaScript variable?", options: ["var", "dim", "int", "string"], correct: 0 },
    { question: "What will `typeof 'hello'` return in JavaScript?", options: ["text", "string", "char", "word"], correct: 1 },
    { question: "Which HTML tag is used to display a checkbox?", options: ["<check>", "<box>", "<input type='checkbox'>", "<checkbox>"], correct: 2 },
    { question: "Which function is used to convert a string to an integer in JavaScript?", options: ["parseInt()", "int()", "stringToInt()", "convert()"], correct: 0 }
]
,
     "History": [
    { question: "Who was the first President of the United States?", options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"], correct: 0 },
    { question: "What year did World War II end?", options: ["1945", "1944", "1946", "1947"], correct: 0 },
    { question: "Who discovered America?", options: ["Christopher Columbus", "Ferdinand Magellan", "Marco Polo", "Leif Erikson"], correct: 0 },
    { question: "What was the ancient name of Egypt?", options: ["Kemet", "Nubia", "Cush", "Pharaoh"], correct: 0 },
    { question: "Who was known as the Iron Lady?", options: ["Margaret Thatcher", "Angela Merkel", "Indira Gandhi", "Golda Meir"], correct: 0 },
    { question: "Which empire was known for its road system?", options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "British Empire"], correct: 0 },
    { question: "What was the main cause of the French Revolution?", options: ["Taxation without representation", "Social inequality", "Monarchy's absolute power", "All of the above"], correct: 3 },
    { question: "Who wrote 'The Art of War'?", options: ["Sun Tzu", "Confucius", "Laozi", "Mencius"], correct: 0 },
    { question: "What was the first civilization in Mesopotamia?", options: ["Sumerians", "Babylonians", "Assyrians", "Akkadians"], correct: 0 },
    { question: "In what year did World War II end?", options: ["1945", "1944", "1946", "1947"], correct: 0 },
    { question: "Who was the first emperor of Rome?", options: ["Julius Caesar", "Augustus", "Nero", "Caligula"], correct: 1 },
    { question: "Which ancient civilization built the Machu Picchu complex?", options: ["Aztecs", "Mayans", "Incas", "Olmecs"], correct: 2 },
    { question: "What was the primary language of the Byzantine Empire?", options: ["Latin", "Greek", "Aramaic", "Hebrew"], correct: 1 },
    { question: "Who was the leader of the Soviet Union during World War II?", options: ["Vladimir Lenin", "Joseph Stalin", "Nikita Khrushchev", "Leon Trotsky"], correct: 1 },
    { question: "Which treaty ended World War I?", options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Ghent", "Treaty of Tordesillas"], correct: 0 },
    { question: "Who was the first female pharaoh of Egypt?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Sobekneferu"], correct: 2 },
    { question: "What was the capital of the Inca Empire?", options: ["Tenochtitlan", "Cusco", "Tikal", "Chichen Itza"], correct: 1 },
    { question: "Who was the commander of the Carthaginian army during the Second Punic War?", options: ["Hannibal", "Scipio Africanus", "Hamilcar Barca", "Hasdrubal"], correct: 0 },
    { question: "Which dynasty built the Great Wall of China?", options: ["Ming Dynasty", "Qing Dynasty", "Han Dynasty", "Tang Dynasty"], correct: 0 },
    { question: "Who was the first European to reach India by sea?", options: ["Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan", "Marco Polo"], correct: 1 }
],

     "famous-people": [
    { question: "Who invented the telephone?", options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"], correct: 0 },
    { question: "Who is known for the theory of relativity?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"], correct: 1 },
    { question: "Who is known as the Father of Modern Physics?", options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"], correct: 1 },
    { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correct: 2 },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: 1 },
    { question: "Who was the first person to walk on the moon?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"], correct: 0 },
    { question: "Who is known as the King of Pop?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"], correct: 1 },
    { question: "Who was the first female Prime Minister of the UK?", options: ["Queen Elizabeth II", "Theresa May", "Margaret Thatcher", "Angela Merkel"], correct: 2 },
    { question: "Who is known for the theory of evolution?", options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Albert Einstein"], correct: 0 },
    { question: "Who wrote 'The Great Gatsby'?", options: ["F. Scott Fitzgerald", "Ernest Hemingway", "Mark Twain", "John Steinbeck"], correct: 0 },
    { question: "Who is known as the 'Father of Computers'?", options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"], correct: 1 },
    { question: "Who was the first woman to win a Nobel Prize?", options: ["Marie Curie", "Mother Teresa", "Rosalind Franklin", "Jane Addams"], correct: 0 },
    { question: "Who is known for painting the ceiling of the Sistine Chapel?", options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"], correct: 2 },
    { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"], correct: 0 },
    { question: "Who is known as the 'Queen of Soul'?", options: ["Diana Ross", "Aretha Franklin", "Whitney Houston", "Tina Turner"], correct: 1 },
    { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], correct: 2 },
    { question: "Who is known for the discovery of penicillin?", options: ["Louis Pasteur", "Alexander Fleming", "Joseph Lister", "Robert Koch"], correct: 1 },
    { question: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"], correct: 1 },
    { question: "Who is known as the 'Father of the American Revolution'?", options: ["Benjamin Franklin", "Thomas Jefferson", "Samuel Adams", "George Washington"], correct: 0 },
    { question: "Who inveted Exams", options: ["Christopher Columbus", "Henry Fischel", "Marco Polo", "Vasco da Gama"], correct: 1 }
]
,
        "Cartoons": [
    { question: "What kind of animal is Puss in Boots?", options: ["Dog", "Cat", "Mouse", "Fox"], correct: 1 },
    { question: "In 'The Lion King', who is Simba's father?", options: ["Scar", "Mufasa", "Rafiki", "Zazu"], correct: 1 },
    { question: "Who leads Baby Corp in Boss Baby?", options: ["Boss Baby", "Mega Baby", "Captain Diaper", "Tom Templeton"], correct: 0 },
    { question: "In 'Toy Story', what is the name of the cowboy doll?", options: ["Buzz Lightyear", "Woody", "Mr. Potato Head", "Rex"], correct: 1 },
    { question: "What is the name of the princess in 'Frozen'?", options: ["Elsa", "Anna", "Ariel", "Belle"], correct: 0 },
    { question: "In 'SpongeBob SquarePants', what is SpongeBob's job?", options: ["Fry Cook", "Lifeguard", "Teacher", "Scientist"], correct: 0 },
    { question: "Which company created the Barbie animated movies?", options: ["Disney", "DreamWorks", "Mattel", "Nickelodeon"], correct: 2 },
    { question: "What energy attack is Goku most famous for in Dragon Ball?", options: ["Kamehameha", "Spirit Bomb", "Final Flash", "Destructo Disc"], correct: 0 },
    { question: "In 'Finding Nemo', what type of fish is Dory?", options: ["Clownfish", "Surgeonfish", "Angelfish", "Pufferfish"], correct: 1 },
    { question: "What is the name of the villain in 'The Little Mermaid'?", options: ["Maleficent", "Ursula", "Jafar", "Scar"], correct: 1 },
    { question: "Which character in 'Mickey Mouse' is known for his laugh?", options: ["Mickey Mouse", "Donald Duck", "Goofy", "Pluto"], correct: 2 },
    { question: "What is the name of the toy store in 'Toy Story 2'?", options: ["Al's Toy Barn", "Andy's Toy Store", "Toy Heaven", "Playtime Toys"], correct: 0 },
    { question: "In 'Beauty and the Beast', what is the name of the enchanted teapot?", options: ["Mrs. Potts", "Chip", "Lumiere", "Cogsworth"], correct: 0 },
    { question: "Which character in 'Shrek' is known for saying 'I'm a believer'?", options: ["Shrek", "Donkey", "Fiona", "Puss in Boots"], correct: 1 },
    { question: "What is the name of the dragon in 'Mulan'?", options: ["Mushu", "Shenron", "Smaug", "Toothless"], correct: 0 },
    { question: "In 'The Incredibles', what is the name of the family's baby?", options: ["Dash", "Violet", "Jack-Jack", "Bob"], correct: 2 },
    { question: "Which character in 'Aladdin' is known for being a fast-talking parrot?", options: ["Jafar", "Genie", "Iago", "Abu"], correct: 2 },
    { question: "What is the name of the kingdom in 'Tangled'?", options: ["Arendelle", "Corona", "Elsa", "Avalon"], correct: 1 },
    { question: "In 'Kung Fu Panda', what is the name of the main character?", options: ["Po", "Shifu", "Tigress", "Mantis"], correct: 0 },
    { question: "In 'Tom and Jerry', what kind of animal is Tom?", options: ["Dog", "Cat", "Mouse", "Bird"], correct: 1 }
]
,
       "Celebrities": [
    { question: "Which Kendrick Lamar album won the Pulitzer Prize?", options: ["DAMN.", "To Pimp a Butterfly", "good kid, m.A.A.d city", "Mr. Morale & The Big Steppers"], correct: 1 },
    { question: "What is Kendrick Lamar's birth name?", options: ["Kendrick Lamar Duckworth", "Kendrick Lamar Jackson", "Kendrick Lamar Carter", "Kendrick Lamar Graham"], correct: 0 },
    { question: "Which celebrity couple was known as 'Bennifer'?", options: ["Brad Pitt & Jennifer Aniston", "Ben Affleck & Jennifer Lopez", "Ben Stiller & Jennifer Lawrence", "Ben Barnes & Jennifer Garner"], correct: 1 },
    { question: "Which artist has the most Grammy wins of all time?", options: ["Beyoncé", "Michael Jackson", "Stevie Wonder", "Taylor Swift"], correct: 0 },
    { question: "Who was the first female artist to headline Coachella?", options: ["Lady Gaga", "Beyoncé", "Rihanna", "Ariana Grande"], correct: 1 },
    { question: "Which celebrity founded the makeup brand Fenty Beauty?", options: ["Kim Kardashian", "Rihanna", "Kylie Jenner", "Selena Gomez"], correct: 1 },
    { question: "What was the name of Taylor Swift's first album?", options: ["Fearless", "Taylor Swift", "Debut", "Speak Now"], correct: 1 },
    { question: "Which rapper is known as 'Drizzy'?", options: ["Kanye West", "Drake", "Travis Scott", "Lil Wayne"], correct: 1 },
    { question: "Which celebrity has the most followers on Instagram?", options: ["Cristiano Ronaldo", "Kylie Jenner", "Lionel Messi", "Selena Gomez"], correct: 0 },
    { question: "What is the name of Kendrick Lamar's record label?", options: ["Top Dawg Entertainment", "Aftermath", "Interscope", "Dreamville"], correct: 0 },
    { question: "Which celebrity is known for the role of Iron Man in the Marvel Cinematic Universe?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 1 },
    { question: "Which artist is known for the hit song 'Blinding Lights'?", options: ["Drake", "The Weeknd", "Post Malone", "Justin Bieber"], correct: 1 },
    { question: "Which celebrity is known for creating the reality TV show 'Keeping Up with the Kardashians'?", options: ["Kim Kardashian", "Kris Jenner", "Kourtney Kardashian", "Khloé Kardashian"], correct: 1 },
    { question: "Which artist released the album '1989'?", options: ["Katy Perry", "Lady Gaga", "Taylor Swift", "Adele"], correct: 2 },
    { question: "Which celebrity is known for the character of Jack Sparrow in the 'Pirates of the Caribbean' series?", options: ["Orlando Bloom", "Johnny Depp", "Javier Bardem", "Geoffrey Rush"], correct: 1 },
    { question: "Which artist is known for the song 'Bad Guy'?", options: ["Ariana Grande", "Dua Lipa", "Billie Eilish", "Doja Cat"], correct: 2 },
    { question: "Which celebrity is known for the role of Hermione Granger in the 'Harry Potter' series?", options: ["Emma Stone", "Emma Watson", "Anne Hathaway", "Jennifer Lawrence"], correct: 1 },
    { question: "Which artist is known for the album 'Lemonade'?", options: ["Rihanna", "Beyoncé", "Adele", "Taylor Swift"], correct: 1 },
    { question: "Which celebrity is known for the role of Tony Stark in the Marvel Cinematic Universe?", options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 1 },
    { question: "Which artist is known for the hit song 'Shape of You'?", options: ["Justin Bieber", "Ed Sheeran", "Bruno Mars", "Shawn Mendes"], correct: 1 }
]
,
        "awards-festivals": [
    { question: "What is the Grammy Award trophy shaped like?", options: ["Gramophone", "Microphone", "Gold record", "Star"], correct: 0 },
    { question: "Which film festival awards the Palme d'Or?", options: ["Venice", "Berlin", "Cannes", "Toronto"], correct: 2 },
    { question: "What color is the carpet at the Met Gala?", options: ["Red", "White", "Black", "Gold"], correct: 0 },
    { question: "What was the first year the BET Awards were held?", options: ["1998", "2001", "2005", "2010"], correct: 1 },
    { question: "Which Grammy category was introduced in 2023 for African music?", options: ["Best Afrobeats", "Best Global Music", "Best African Performance", "Best Amapiano"], correct: 1 },
    { question: "Which artist has won the most BET Hip Hop Awards?", options: ["Kendrick Lamar", "Drake", "Jay-Z", "Kanye West"], correct: 0 },
    { question: "What special Grammy did Michael Jackson win in 1984?", options: ["Legend Award", "Record of the Year", "Album of the Year", "Video Vanguard"], correct: 0 },
    { question: "Which artist won the first-ever BET Award for Best Female R&B?", options: ["Mary J. Blige", "Alicia Keys", "Beyoncé", "Rihanna"], correct: 0 },
    { question: "How many main Grammy categories are there currently?", options: ["84", "65", "94", "102"], correct: 2 },
    { question: "Where is the Sundance Film Festival held annually?", options: ["Colorado", "Utah", "California", "New York"], correct: 1 },
    { question: "Which music festival is known for its pyramid stage?", options: ["Coachella", "Glastonbury", "Lollapalooza", "Bonnaroo"], correct: 1 },
    { question: "Which artist won the most Grammy Awards in history?", options: ["Beyoncé", "Georg Solti", "Stevie Wonder", "Quincy Jones"], correct: 1 },
    { question: "Which film festival is known for awarding the Golden Lion?", options: ["Cannes", "Berlin", "Venice", "Sundance"], correct: 2 },
    { question: "Who was the first woman to win the Album of the Year Grammy as a solo artist?", options: ["Judy Garland", "Joan Baez", "Barbra Streisand", "Taylor Swift"], correct: 0 },
    { question: "Which award show is known for its 'Moonman' trophy?", options: ["Grammy Awards", "BET Awards", "MTV Video Music Awards", "American Music Awards"], correct: 2 },
    { question: "Which artist has won the most American Music Awards?", options: ["Michael Jackson", "Whitney Houston", "Taylor Swift", "Rihanna"], correct: 2 },
    { question: "Which festival is known as the largest arts festival in the world?", options: ["Edinburgh Festival Fringe", "Cannes Film Festival", "SXSW", "Glastonbury"], correct: 0 },
    { question: "Which award is given by the Recording Academy to honor lifetime achievement in the recording arts?", options: ["Grammy Lifetime Achievement Award", "Rock and Roll Hall of Fame", "Kennedy Center Honors", "Polar Music Prize"], correct: 0 },
    { question: "Which artist won the first-ever Grammy Award for Best New Artist?", options: ["The Beatles", "Bobby Darin", "The Swingle Singers", "Carpenters"], correct: 1 },
    { question: "Which film festival is the oldest in the world?", options: ["Venice Film Festival", "Cannes Film Festival", "Berlin International Film Festival", "Toronto International Film Festival"], correct: 0 },
    { question: "Which award is considered the highest honor in the American television industry?", options: ["Golden Globe", "Emmy", "Oscar", "Tony"], correct: 1 }
]
,
       "computers-internet": [
    { question: "What does 'www' stand for in websites?", options: ["World Wide Web", "Web World Wide", "Wide World Web", "World Web Wide"], correct: 0 },
    { question: "Which company created Windows?", options: ["Apple", "Microsoft", "Google", "IBM"], correct: 1 },
    { question: "What is the most popular web browser?", options: ["Safari", "Chrome", "Firefox", "Edge"], correct: 1 },
    { question: "What does 'URL' stand for?", options: ["Uniform Resource Locator", "Universal Reference Link", "Uniform Reference Locator", "Universal Resource Location"], correct: 0 },
    { question: "Which programming language is known for web development?", options: ["Java", "Python", "HTML", "C++"], correct: 2 },
    { question: "What is the main purpose of a firewall?", options: ["Speed up internet", "Block viruses", "Organize files", "Create backups"], correct: 1 },
    { question: "What year was the first iPhone released?", options: ["2005", "2007", "2009", "2011"], correct: 1 },
    { question: "Which protocol secures website connections?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: 2 },
    { question: "What does 'GPU' stand for?", options: ["Graphic Processing Unit", "General Processing Unit", "Global Processing Unit", "Graphical Performance Unit"], correct: 0 },
    { question: "Which company developed the Python language?", options: ["Microsoft", "Google", "Python Software Foundation", "Oracle"], correct: 2 },
    { question: "What does 'CPU' stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Unit", "Control Processing Unit"], correct: 0 },
    { question: "Which of these is an open-source operating system?", options: ["Windows", "macOS", "Linux", "iOS"], correct: 2 },
    { question: "What does 'HTML' stand for?", options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinking Text Management Language"], correct: 1 },
    { question: "Which company developed Java?", options: ["Microsoft", "Sun Microsystems", "IBM", "Apple"], correct: 1 },
    { question: "What is the primary function of RAM in a computer?", options: ["Long-term storage", "Processing data", "Temporary data storage", "Power management"], correct: 2 },
    { question: "Which of these is a cloud computing service?", options: ["Photoshop", "AWS", "Excel", "PowerPoint"], correct: 1 },
    { question: "What does 'AI' stand for in the context of computer science?", options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithm Interface"], correct: 1 },
    { question: "Which of these is a version control system?", options: ["Excel", "Git", "Photoshop", "PowerPoint"], correct: 1 },
    { question: "What does 'IoT' stand for?", options: ["Internet of Things", "Integrated Office Technology", "Intelligent Operating Technology", "Internal Operating Tool"], correct: 0 },
    { question: "Which programming language is primarily used for Android app development?", options: ["Swift", "Java", "C#", "Ruby"], correct: 1 }
]
,
    "inventions": [
    { question: "Who invented the telephone?", options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"], correct: 1 },
    { question: "Who invented the light bulb?", options: ["Thomas Edison", "Nikola Tesla", "Benjamin Franklin", "James Watt"], correct: 0 },
    { question: "What did the Wright brothers invent?", options: ["Automobile", "Telephone", "Airplane", "Radio"], correct: 2 },
    { question: "Who invented the printing press?", options: ["Benjamin Franklin", "Leonardo da Vinci", "Johannes Gutenberg", "Galileo Galilei"], correct: 2 },
    { question: "Which invention is Tim Berners-Lee known for?", options: ["Email", "World Wide Web", "JavaScript", "Linux"], correct: 1 },
    { question: "Who invented the first computer algorithm?", options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "Bill Gates"], correct: 2 },
    { question: "What did Johannes Gutenberg invent?", options: ["Steam Engine", "Printing Press", "Telegraph", "Microscope"], correct: 1 },
    { question: "Who invented the first programmable computer?", options: ["Konrad Zuse", "Charles Babbage", "Alan Turing", "John Atanasoff"], correct: 0 },
    { question: "Which inventor created the first working television?", options: ["Philo Farnsworth", "Thomas Edison", "Guglielmo Marconi", "Alexander Graham Bell"], correct: 0 },
    { question: "Who invented the first successful polio vaccine?", options: ["Marie Curie", "Jonas Salk", "Louis Pasteur", "Alexander Fleming"], correct: 1 },
    { question: "Who invented the steam engine?", options: ["James Watt", "Thomas Newcomen", "George Stephenson", "Richard Trevithick"], correct: 0 },
    { question: "Who is credited with inventing the first practical telephone?", options: ["Elisha Gray", "Alexander Graham Bell", "Antonio Meucci", "Thomas Edison"], correct: 1 },
    { question: "What did Louis Pasteur invent?", options: ["Telephone", "Pasteurization", "Light Bulb", "Radio"], correct: 1 },
    { question: "Who invented the first successful airplane?", options: ["Orville and Wilbur Wright", "Samuel Langley", "Alberto Santos-Dumont", "Otto Lilienthal"], correct: 0 },
    { question: "Who invented the first practical sewing machine?", options: ["Elias Howe", "Isaac Singer", "Walter Hunt", "Barthélemy Thimonnier"], correct: 0 },
    { question: "Who invented the first practical typewriter?", options: ["Christopher Latham Sholes", "Carlos Glidden", "Samuel W. Soule", "Rasmus Malling-Hansen"], correct: 0 },
    { question: "Who invented the first practical incandescent light bulb?", options: ["Thomas Edison", "Joseph Swan", "Humphry Davy", "Heinrich Göbel"], correct: 0 },
    { question: "Who invented the first practical automobile?", options: ["Karl Benz", "Henry Ford", "Gottlieb Daimler", "Nicolas-Joseph Cugnot"], correct: 0 },
    { question: "When was the first iPhone made?", options: ["2005", "2007", "2009", "2010"], correct: 1 },
    { question: "When was the first Samsung Galaxy smartphone made?", options: ["2008", "2009", "2010", "2011"], correct: 2 },
    { question: "When was the first Google Pixel phone made?", options: ["2015", "2016", "2017", "2018"], correct: 1 }
]

,
        "graphic-design":[
          {question:"Which tool is most used in graphic design?",options:["Adobe Photoshop","Microsoft Word","Google Docs","Windows Paint"],correct:0},
          {question:"What does 'RGB' stand for?",options:["Red Green Blue","Royal Gold Bronze","Rich Gradient Blend","Raster Graphic Bit"],correct:0},
          {question:"Which file format supports transparency?",options:["JPG","PNG","BMP","GIF"],correct:1},
          {question:"Which color model is used for digital screens?",options:["CMYK","RGB","HSB","LAB"],correct:1},
          {question:"What is kerning in typography?",options:["Line spacing","Letter spacing","Font weight","Text alignment"],correct:1},
          {question:"Which design principle creates visual hierarchy?",options:["Contrast","Repetition","Alignment","Proximity"],correct:0},
          {question:"What does 'DPI' measure?",options:["Color depth","Image resolution","File size","Aspect ratio"],correct:1},
          {question:"Which color model is used for print design?",options:["RGB","CMYK","HSV","Pantone"],correct:1},
          {question:"What is the golden ratio in design?",options:["1:1.618","3:4","16:9","2:3"],correct:0},
          { question: "Which software is mainly used for creating vector graphics?", options: ["Adobe Illustrator", "Photoshop", "InDesign", "Corel Painter"], correct: 0 },
          { question: "What does 'UX' stand for?", options: ["User Experience", "Ultimate X-factor", "Uniform Execution", "User Extension"], correct: 0 },
          { question: "What is a mockup in design?", options: ["Final product", "Design sketch", "Visual preview", "Client request"], correct: 2 },
          { question: "Which format is best for scalable logos?", options: ["PNG", "JPEG", "SVG", "GIF"], correct: 2 },
          { question: "What are complementary colors?", options: ["Colors next to each other", "Colors opposite on the color wheel", "Colors with the same hue", "Neutral shades"], correct: 1 },
          { question: "What is whitespace in design?", options: ["Empty space between elements", "White background", "Unused file space", "Blank pages"], correct: 0 },
          { question: "Which typography term refers to vertical spacing between lines?", options: ["Kerning", "Tracking", "Leading", "Baseline"], correct: 2 },
          { question: "Which tool is best for laying out books or magazines?", options: ["Photoshop", "InDesign", "Illustrator", "Lightroom"], correct: 1 },
          { question: "What does a style guide define?", options: ["Software settings", "Color themes only", "Design and branding rules", "Image dimensions"], correct: 2 },
          { question: "What is the purpose of a mood board?", options: ["To show final layout", "To inspire and set tone", "To display code structure", "To present analytics"], correct: 1 },

          {question:"Who designed the 'I Love NY' logo?",options:["Paul Rand","Milton Glaser","Saul Bass","Massimo Vignelli"],correct:1}
        ],
        "basketball": [
    { question: "How many points is a three-point shot worth?", options: ["1", "2", "3", "4"], correct: 2 },
    { question: "Which position is typically the tallest player?", options: ["Point Guard", "Shooting Guard", "Small Forward", "Center"], correct: 3 },
    { question: "How many players are on the court per team?", options: ["4", "5", "6", "7"], correct: 1 },
    { question: "Which NBA team has the most championships?", options: ["Lakers", "Celtics", "Bulls", "Warriors"], correct: 1 },
    { question: "Who holds the record for most points in a single game?", options: ["Michael Jordan", "Kobe Bryant", "Wilt Chamberlain", "LeBron James"], correct: 2 },
    { question: "What is the diameter of a basketball hoop in inches?", options: ["12", "15", "18", "24"], correct: 2 },
    { question: "Which player is known as 'The Greek Freak'?", options: ["Luka Dončić", "Giannis Antetokounmpo", "Nikola Jokić", "Joel Embiid"], correct: 1 },
    { question: "Who was the first NBA player to score 100 points in a game?", options: ["Kareem Abdul-Jabbar", "Wilt Chamberlain", "Bill Russell", "Oscar Robertson"], correct: 1 },
    { question: "Which year was the NBA founded?", options: ["1946", "1950", "1960", "1976"], correct: 0 },
    { question: "Which player holds the record for most career assists?", options: ["Magic Johnson", "John Stockton", "Jason Kidd", "Chris Paul"], correct: 1 },
    { question: "Which player is known as 'Air Jordan'?", options: ["LeBron James", "Kobe Bryant", "Michael Jordan", "Shaquille O'Neal"], correct: 2 },
    { question: "Which team won the NBA championship in 2020?", options: ["Los Angeles Lakers", "Miami Heat", "Toronto Raptors", "Golden State Warriors"], correct: 0 },
    { question: "Who is the all-time leading scorer in NBA history?", options: ["Kareem Abdul-Jabbar", "Karl Malone", "Kobe Bryant", "LeBron James"], correct: 0 },
    { question: "Which player is known as 'The Dream'?", options: ["Hakeem Olajuwon", "Magic Johnson", "Larry Bird", "Charles Barkley"], correct: 0 },
    { question: "Which team drafted Kobe Bryant?", options: ["Los Angeles Lakers", "Charlotte Hornets", "Philadelphia 76ers", "Chicago Bulls"], correct: 1 },
    { question: "Who is the youngest player to score 10,000 points in the NBA?", options: ["LeBron James", "Kobe Bryant", "Kevin Durant", "Michael Jordan"], correct: 0 },
    { question: "Which player holds the record for most three-pointers made in NBA history?", options: ["Stephen Curry", "Ray Allen", "Reggie Miller", "Klay Thompson"], correct: 0 },
    { question: "Which player is known as 'The Answer'?", options: ["Allen Iverson", "Vince Carter", "Tracy McGrady", "Paul Pierce"], correct: 0 },
    { question: "Which team won the first NBA championship?", options: ["Boston Celtics", "Philadelphia Warriors", "Minneapolis Lakers", "New York Knicks"], correct: 1 },
    { question: "Who is the only player to win NBA MVP, Coach of the Year, and Executive of the Year?", options: ["Larry Bird", "Magic Johnson", "Michael Jordan", "Bill Russell"], correct: 0 }
]
,
      "digital-safety": [
    { question: "What is the best way to create a strong password?", options: ["Use your pet's name", "Combine random words and numbers", "Use 'password123'", "Write it on a sticky note"], correct: 1 },
    { question: "What does 'HTTPS' in a website URL indicate?", options: ["The site is old", "The connection is secure", "The site is government-run", "The site is free to use"], correct: 1 },
    { question: "What should you do before clicking a link in an email?", options: ["Check the sender's address", "Click immediately if it looks interesting", "Forward it to friends", "Download any attachments"], correct: 0 },
    { question: "Why is two-factor authentication important?", options: ["It makes logging in faster", "It adds an extra layer of security", "It reduces your phone's battery life", "It's required by all websites"], correct: 1 },
    { question: "What is a 'phishing' attack?", options: ["A fishing game app", "A way to catch computer viruses", "A fraudulent attempt to steal information", "A type of computer hardware"], correct: 2 },
    { question: "What should you do if you lose your phone?", options: ["Nothing - it's just a phone", "Use 'Find My Device' to lock or erase it", "Post about it on social media", "Keep trying to call it"], correct: 1 },
    { question: "Why should you avoid public WiFi for banking?", options: ["It's too slow", "Others on the network may intercept your data", "Banks block public WiFi", "It uses too much data"], correct: 1 },
    { question: "What is a 'zero-day' vulnerability?", options: ["A calendar app bug", "A security flaw unknown to the vendor", "A problem that fixes itself in 24 hours", "An issue that only appears at midnight"], correct: 1 },
    { question: "What does 'VPN' stand for?", options: ["Virtual Private Network", "Verified Personal Number", "Visual Protection Notification", "Voltage Power Node"], correct: 0 },
    { question: "What is 'end-to-end encryption'?", options: ["Data scrambled so only sender and receiver can read it", "A way to compress files", "A method to speed up internet", "A type of computer memory"], correct: 0 },
    { question: "What is the purpose of a firewall?", options: ["To speed up your internet connection", "To block unauthorized access to your network", "To increase your computer's performance", "To store your data securely"], correct: 1 },
    { question: "What should you do if you receive a suspicious email?", options: ["Open it immediately", "Delete it without opening", "Forward it to your friends", "Reply to the sender"], correct: 1 },
    { question: "What is 'malware'?", options: ["A type of hardware", "A type of software designed to harm your computer", "A type of network", "A type of encryption"], correct: 1 },
    { question: "What is the best way to protect your personal information online?", options: ["Share it freely", "Use strong, unique passwords and enable two-factor authentication", "Use the same password for all accounts", "Avoid using antivirus software"], correct: 1 },
    { question: "What is 'ransomware'?", options: ["A type of software that helps you organize your files", "A type of malware that encrypts your files and demands payment for their release", "A type of network protocol", "A type of encryption"], correct: 1 },
    { question: "What should you do if you suspect your computer is infected with malware?", options: ["Ignore it", "Run a scan with your antivirus software", "Continue using your computer as usual", "Turn off your computer and never use it again"], correct: 1 },
    { question: "What is 'social engineering'?", options: ["A type of hardware", "A type of software", "A method of tricking people into revealing sensitive information", "A type of network protocol"], correct: 2 },
    { question: "What is the best way to secure your home WiFi network?", options: ["Use the default password", "Change the default password and use strong encryption", "Disable the firewall", "Share the password with everyone"], correct: 1 },
    { question: "What is 'identity theft'?", options: ["A type of hardware", "A type of software", "A crime where someone steals your personal information to commit fraud", "A type of network protocol"], correct: 2 },
    { question: "What should you do if you receive a call from someone claiming to be from tech support?", options: ["Provide them with your personal information", "Hang up and call the company's official support number", "Follow their instructions immediately", "Ignore the call"], correct: 1 }
]
,
        "football":[
        
    { question: "Which player is known as 'The Egyptian King'?", options: ["Sadio Mané", "Mohamed Salah", "Riyad Mahrez", "Pierre-Emerick Aubameyang"], correct: 1 },
{ question: "Which club is known as 'The Red Devils'?", options: ["Liverpool", "Arsenal", "Manchester United", "Chelsea"], correct: 2 },
{ question: "Who won the Golden Boot in the 2018 FIFA World Cup?", options: ["Harry Kane", "Antoine Griezmann", "Romelu Lukaku", "Kylian Mbappé"], correct: 0 },
{ question: "Which country won the UEFA Euro 2020?", options: ["France", "England", "Italy", "Spain"], correct: 2 },
{ question: "Which player holds the record for the most goals in a single Premier League season?", options: ["Alan Shearer", "Thierry Henry", "Mohamed Salah", "Sergio Agüero"], correct: 0 },
{ question: "Which team is known as 'The Blues' in the Premier League?", options: ["Manchester City", "Chelsea", "Everton", "Tottenham Hotspur"], correct: 1 },
{ question: "Who is the all-time top scorer for the Brazilian national team?", options: ["Ronaldo", "Pelé", "Romário", "Neymar"], correct: 3 },
{ question: "Which player has the most assists in Premier League history?", options: ["Cesc Fàbregas", "Ryan Giggs", "Frank Lampard", "Paul Scholes"], correct: 1 },
{ question: "Which stadium is known as 'The Theatre of Dreams'?", options: ["Anfield", "Old Trafford", "Wembley", "Camp Nou"], correct: 1 },
{ question: "Who was the first player to win five Champions League titles?", options: ["Cristiano Ronaldo", "Lionel Messi", "Paolo Maldini", "Francisco Gento"], correct: 3 },
{ question: "Which country won the first UEFA European Championship in 1960?", options: ["Spain", "Germany", "Soviet Union", "Italy"], correct: 2 },
{ question: "Who is the youngest player to score in a FIFA World Cup?", options: ["Pelé", "Lionel Messi", "Kylian Mbappé", "Diego Maradona"], correct: 0 },
{ question: "Which player has won the most Premier League titles?", options: ["Ryan Giggs", "Paul Scholes", "John Terry", "Thierry Henry"], correct: 0 },
{ question: "Which team won the first-ever Premier League season?", options: ["Manchester United", "Arsenal", "Liverpool", "Blackburn Rovers"], correct: 0 },
{ question: "Who is the only goalkeeper to win the Ballon d'Or?", options: ["Gianluigi Buffon", "Iker Casillas", "Lev Yashin", "Manuel Neuer"], correct: 2 },
{ question: "Which player scored the fastest goal in Premier League history?", options: ["Shane Long", "Ledley King", "Alan Shearer", "Sadio Mané"], correct: 0 },
{ question: "Which country has won the most Copa America titles?", options: ["Brazil", "Argentina", "Uruguay", "Chile"], correct: 1 },
{ question: "Who was the first British player to win the Ballon d'Or?", options: ["Bobby Charlton", "George Best", "Kevin Keegan", "Stanley Matthews"], correct: 3 },
{ question: "Which player has the most appearances in the UEFA Champions League?", options: ["Cristiano Ronaldo", "Lionel Messi", "Iker Casillas", "Xavi Hernandez"], correct: 0 },
{ question: "Which team has won the most consecutive Serie A titles?", options: ["Juventus", "AC Milan", "Inter Milan", "Roma"], correct: 0 },
{ question: "Who is the only player to have won the FIFA World Cup, UEFA Champions League, Ballon d'Or, and Copa Libertadores?", options: ["Ronaldo", "Ronaldinho", "Cafu", "Rivaldo"], correct: 2 },
{ question: "Which player holds the record for the most goals scored in a single calendar year?", options: ["Lionel Messi", "Cristiano Ronaldo", "Gerd Müller", "Pelé"], correct: 0 },
{ question: "Which country won the first-ever FIFA Women's World Cup in 1991?", options: ["Germany", "Norway", "United States", "Brazil"], correct: 2 },
{ question: "Who is the only player to have scored in two different UEFA European Championship finals?", options: ["Cristiano Ronaldo", "Michel Platini", "Thierry Henry", "Fernando Torres"], correct: 3 },
{ question: "Which player has the most assists in La Liga history?", options: ["Lionel Messi", "Xavi Hernandez", "Andrés Iniesta", "Luis Suárez"], correct: 0 }

        
        ],
       "sports-rules": [
    { question: "In basketball, how many fouls result in a player being fouled out?", options: ["3", "4", "5", "6"], correct: 2 },
    { question: "In tennis, what is the score called when both players have 40 points?", options: ["Deuce", "Advantage", "Tie", "Match point"], correct: 0 },
    { question: "In football (soccer), what color card indicates a serious foul?", options: ["Yellow", "Red", "Blue", "Black"], correct: 1 },
    { question: "In baseball, how many strikes make an out?", options: ["1", "2", "3", "4"], correct: 2 },
    { question: "In volleyball, how many touches are allowed before returning the ball?", options: ["2", "3", "4", "5"], correct: 1 },
    { question: "In cricket, how many balls are in one over?", options: ["4", "5", "6", "7"], correct: 2 },
    { question: "In American football, how many points is a safety worth?", options: ["1", "2", "3", "6"], correct: 1 },
    { question: "In rugby union, how many points is a try worth?", options: ["3", "5", "7", "10"], correct: 1 },
    { question: "In badminton, what is the winning score in a standard singles game?", options: ["15", "21", "25", "30"], correct: 1 },
    { question: "In curling, what is the name of the target area?", options: ["House", "Circle", "Target", "Goal"], correct: 0 },
    { question: "In golf, what is the term for completing a hole in one stroke under par?", options: ["Birdie", "Eagle", "Bogey", "Albatross"], correct: 1 },
    { question: "In table tennis, how many points are needed to win a game?", options: ["9", "11", "15", "21"], correct: 1 },
    { question: "In ice hockey, how many players from each team are on the ice at one time?", options: ["4", "5", "6", "7"], correct: 2 },
    { question: "In handball, how many steps can a player take without dribbling?", options: ["1", "2", "3", "4"], correct: 2 },
    { question: "In archery, what is the center of the target called?", options: ["Bullseye", "Center", "Core", "Middle"], correct: 0 },
    { question: "In football (soccer), what is the name of the area where the goalkeeper can handle the ball?", options: ["Penalty area", "Goal area", "Safe zone", "Keeper's box"], correct: 0 },
    { question: "In basketball, how many points is a shot worth from beyond the three-point line?", options: ["2", "3", "4", "5"], correct: 1 },
    { question: "In football (soccer), which player is allowed to use their hands within the penalty area?", options: ["Defender", "Midfielder", "Forward", "Goalkeeper"], correct: 3 },
    { question: "In basketball, what is the term for a shot that misses the rim and backboard entirely?", options: ["Airball", "Brick", "Clank", "Miss"], correct: 0 },
    { question: "In football (soccer), how many players from each team are on the field during a match?", options: ["9", "10", "11", "12"], correct: 2 }
]
,
       "continents-oceans": [
    { question: "Which is the largest continent?", options: ["Africa", "Asia", "North America", "Antarctica"], correct: 1 },
    { question: "What is the smallest continent?", options: ["Australia", "Europe", "South America", "Antarctica"], correct: 0 },
    { question: "Which ocean is the largest?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], correct: 3 },
    { question: "Which continent is known as the 'Dark Continent'?", options: ["Asia", "Africa", "South America", "Australia"], correct: 1 },
    { question: "Which ocean is the smallest?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Southern Ocean"], correct: 2 },
    { question: "Which continent has the most countries?", options: ["Africa", "Asia", "Europe", "North America"], correct: 0 },
    { question: "What is the capital of Australia?", options: ["Sydney", "Canberra", "Melbourne", "Brisbane"], correct: 1 },
    { question: "Which continent is home to the Amazon rainforest?", options: ["Africa", "Asia", "South America", "North America"], correct: 2 },
    { question: "Which ocean separates Africa from South America?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: 0 },
    { question: "What is the longest river in Asia?", options: ["Yangtze River", "Ganges River", "Mekong River", "Indus River"], correct: 0 },
    { question: "Which continent is known as the 'Land Down Under'?", options: ["Africa", "Asia", "Australia", "South America"], correct: 2 },
    { question: "Which ocean is the second largest?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Southern Ocean"], correct: 0 },
    { question: "Which continent is home to the Sahara Desert?", options: ["Asia", "Africa", "South America", "Australia"], correct: 1 },
    { question: "Which ocean is located to the east of Africa?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: 1 },
    { question: "Which continent is known as the 'Land of the Midnight Sun'?", options: ["Asia", "Europe", "North America", "Antarctica"], correct: 2 },
    { question: "Which ocean is the warmest?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: 1 },
    { question: "Which continent is home to the Andes Mountains?", options: ["North America", "South America", "Asia", "Europe"], correct: 1 },
    { question: "Which ocean is the deepest?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: 2 },
    { question: "Which continent is known as the 'Cradle of Civilization'?", options: ["Asia", "Africa", "Europe", "South America"], correct: 0 },
    { question: "Which ocean is the saltiest?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: 0 },
    { question: "Which continent is home to the Great Barrier Reef?", options: ["Africa", "Asia", "Australia", "South America"], correct: 2 }
]
,
        "countries-capitals":[
    { question: "What is the capital city of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
    { question: "What is the capital city of Japan?", options: ["Tokyo", "Seoul", "Beijing", "Bangkok"], correct: 0 },
    { question: "What is the capital city of Canada?", options: ["Toronto", "Ottawa", "Vancouver", "Montreal"], correct: 1 },
    { question: "What is the capital city of Australia?", options: ["Sydney", "Canberra", "Melbourne", "Brisbane"], correct: 1 },
    { question: "What is the capital city of Italy?", options: ["Rome", "Venice", "Florence", "Milan"], correct: 0 },
    { question: "What is the capital city of Germany?", options: ["Berlin", "Munich", "Frankfurt", "Hamburg"], correct: 0 },
    { question: "What is the capital city of Brazil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: 2 },
    { question: "What is the capital city of India?", options: ["Mumbai", "Delhi", "Bangalore", "Chennai"], correct: 1 },
    { question: "What is the capital city of Russia?", options: ["Moscow", "St. Petersburg", "Kazan", "Novosibirsk"], correct: 0 },
    { question: "What is the capital city of Egypt?", options: ["Cairo", "Alexandria", "Giza", "Luxor"], correct: 0 },
    { question: "What is the capital city of China?", options: ["Shanghai", "Beijing", "Hong Kong", "Shenzhen"], correct: 1 },
    { question: "What is the capital city of South Africa?", options: ["Cape Town", "Pretoria", "Johannesburg", "Durban"], correct: 1 },
    { question: "What is the capital city of Argentina?", options: ["Buenos Aires", "Cordoba", "Rosario", "Mendoza"], correct: 0 },
    { question: "What is the capital city of Mexico?", options: ["Mexico City", "Guadalajara", "Monterrey", "Tijuana"], correct: 0 },
    { question: "What is the capital city of Spain?", options: ["Madrid", "Barcelona", "Seville", "Valencia"], correct: 0 },
    { question: "What is the capital city of Turkey?", options: ["Istanbul", "Ankara", "Izmir", "Antalya"], correct: 1 },
    { question: "What is the capital city of Norway?", options: ["Bergen", "Oslo", "Trondheim", "Stavanger"], correct: 1 },
    { question: "What is the capital city of Kenya?", options: ["Mombasa", "Nairobi", "Kisumu", "Nakuru"], correct: 1 },
    { question: "What is the capital city of Sweden?", options: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"], correct: 0 },
    { question: "What is the capital city of Thailand?", options: ["Phuket", "Chiang Mai", "Bangkok", "Pattaya"], correct: 2 }
],
    "artificial-intelligence": [
    { question: "What does AI stand for?", options: ["Automatic Input", "Artificial Intelligence", "Advanced Integration", "Auto Intelligence"], correct: 1 },
    { question: "Which of these is a voice-based AI assistant?", options: ["Photoshop", "Siri", "Excel", "Chrome"], correct: 1 },
    { question: "What is AI mostly used for?", options: ["Baking", "Driving", "Smart Tasks", "Farming"], correct: 2 },
    { question: "When was the first AI program created?", options: ["1943", "1956", "1969", "1980"], correct: 1 },
    { question: "Which famous test is used to check a machine's intelligence?", options: ["IQ Test", "Turing Test", "Machine Test", "Logic Test"], correct: 1 },
    { question: "Which of the following is a field of AI?", options: ["Cooking", "Machine Learning", "Astrology", "Sports"], correct: 1 },
    { question: "Who is known as the father of AI?", options: ["Alan Turing", "John McCarthy", "Bill Gates", "Elon Musk"], correct: 1 },
    { question: "What is deep learning based on?", options: ["Neural Networks", "Decision Trees", "Spreadsheets", "Web Browsers"], correct: 0 },
    { question: "Which AI defeated world chess champion Garry Kasparov?", options: ["AlphaZero", "Deep Blue", "Watson", "GPT"], correct: 1 },
    { question: "Which AI model can generate human-like text?", options: ["Alexa", "AlphaGo", "GPT", "Cortana"], correct: 2 },
    { question: "What is the primary goal of AI?", options: ["To create machines that can perform tasks that typically require human intelligence", "To build faster computers", "To improve internet speed", "To develop better video games"], correct: 0 },
    { question: "Which of the following is an example of a narrow AI?", options: ["A self-driving car", "A general-purpose robot", "A superintelligent AI", "A conscious AI"], correct: 0 },
    { question: "What is the name of the AI developed by IBM that competed on the quiz show Jeopardy?", options: ["Deep Blue", "Watson", "AlphaGo", "Siri"], correct: 1 },
    { question: "Which of the following is a type of machine learning?", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "All of the above"], correct: 3 },
    { question: "What is the name of the AI developed by Google that can make phone calls to schedule appointments?", options: ["Google Assistant", "Google Duplex", "Google Home", "Google AI"], correct: 1 },
    { question: "Which of the following is a challenge in AI?", options: ["Ethical concerns", "Data privacy", "Bias in algorithms", "All of the above"], correct: 3 },
    { question: "What is the name of the AI developed by OpenAI that can generate human-like text?", options: ["GPT-3", "AlphaGo", "Watson", "Deep Blue"], correct: 0 },
    { question: "Which of the following is an application of AI in healthcare?", options: ["Diagnosing diseases", "Predicting patient outcomes", "Personalizing treatment plans", "All of the above"], correct: 3 },
    { question: "What is the name of the AI developed by DeepMind that can play multiple video games?", options: ["AlphaGo", "AlphaZero", "Deep Blue", "Watson"], correct: 1 },
    { question: "Which of the following is a benefit of AI?", options: ["Automating repetitive tasks", "Improving accuracy and precision", "Enhancing decision-making", "All of the above"], correct: 3 }
],

   "famous-athletes": [
    { question: "Which soccer player is known as 'LM10'?", options: ["Lionel Messi", "Cristiano Ronaldo", "Neymar Jr.", "Kylian Mbappé"], correct: 1 },
    { question: "Who holds the record for the most Olympic gold medals (23)?", options: ["Usain Bolt", "Carl Lewis", "Michael Phelps", "Simone Biles"], correct: 2 },
    { question: "Which basketball player is nicknamed 'King James'?", options: ["Kobe Bryant", "Stephen Curry", "LeBron James", "Kevin Durant"], correct: 2 },
    { question: "Which female tennis player has won the most Grand Slam singles titles (23)?", options: ["Serena Williams", "Margaret Court", "Steffi Graf", "Martina Navratilova"], correct: 1 },
    { question: "Who was the first African player to win the FIFA Ballon d'Or?", options: ["Didier Drogba", "Samuel Eto'o", "George Weah", "Yaya Touré"], correct: 2 },
    { question: "Which footballer is known as 'The GOAT'?", options: ["Ronaldo", "Messi", "Pelé", "Maradona"], correct: 1 },
    { question: "Which sprinter holds the world record in the 100m (9.58 seconds)?", options: ["Usain Bolt", "Tyson Gay", "Justin Gatlin", "Asafa Powell"], correct: 0 },
    { question: "Which athlete won gold in both the Summer (bobsleigh) and Winter (athletics) Olympics?", options: ["Carl Lewis", "Michael Johnson", "Lauryn Williams", "Allyson Felix"], correct: 2 },
    { question: "Who was the first NBA player to score 100 points in a single game?", options: ["Kareem Abdul-Jabbar", "Wilt Chamberlain", "Bill Russell", "Oscar Robertson"], correct: 1 },
    { question: "Which female athlete has won the most Grand Slam titles in tennis (including doubles)?", options: ["Serena Williams", "Martina Navratilova", "Margaret Court", "Steffi Graf"], correct: 2 },
    { question: "Which athlete is known as 'The Flying Sikh'?", options: ["Milkha Singh", "P.T. Usha", "Dutee Chand", "Hima Das"], correct: 0 },
    { question: "Who is the most decorated Olympian of all time?", options: ["Michael Phelps", "Larisa Latynina", "Paavo Nurmi", "Mark Spitz"], correct: 0 },
    { question: "Which athlete holds the record for the most goals scored in FIFA World Cup history?", options: ["Pelé", "Miroslav Klose", "Ronaldo", "Gerd Müller"], correct: 1 },
    { question: "Who was the first woman to win an Olympic gold medal in boxing?", options: ["Claressa Shields", "Nicola Adams", "Katie Taylor", "Mary Kom"], correct: 1 },
    { question: "Which athlete is known as 'The Black Mamba'?", options: ["LeBron James", "Kobe Bryant", "Michael Jordan", "Magic Johnson"], correct: 1 },
    { question: "Who holds the record for the most home runs in Major League Baseball history?", options: ["Babe Ruth", "Hank Aaron", "Barry Bonds", "Alex Rodriguez"], correct: 2 },
    { question: "Which athlete is known as 'The Queen of the Track'?", options: ["Florence Griffith-Joyner", "Allyson Felix", "Shelly-Ann Fraser-Pryce", "Jackie Joyner-Kersee"], correct: 0 },
    { question: "Who was the first female gymnast to score a perfect 10 in the Olympics?", options: ["Nadia Comăneci", "Olga Korbut", "Mary Lou Retton", "Simone Biles"], correct: 0 },
    { question: "Which athlete holds the record for the most career touchdowns in the NFL?", options: ["Jerry Rice", "Emmitt Smith", "LaDainian Tomlinson", "Randy Moss"], correct: 0 },
    { question: "Who is known as 'The Lightning Bolt'?", options: ["Usain Bolt", "Carl Lewis", "Michael Johnson", "Justin Gatlin"], correct: 0 }
],
      "maps-landmarks": [
    { question: "What is the tallest building in the world?", options: ["Burj Khalifa", "Shanghai Tower", "One World Trade Center", "Taipei 101"], correct: 0 },
    { question: "Which city is known as the 'Big Apple'?", options: ["Los Angeles", "Chicago", "New York City", "Miami"], correct: 2 },
    { question: "Where is the Eiffel Tower located?", options: ["London", "Paris", "Rome", "Berlin"], correct: 1 },
    { question: "Which country is home to the Great Pyramid of Giza?", options: ["Greece", "Egypt", "Mexico", "India"], correct: 1 },
    { question: "What country is home to the Great Wall?", options: ["India", "Japan", "China", "Thailand"], correct: 2 },
    { question: "Which city is known for its canals and gondolas?", options: ["Amsterdam", "Venice", "Paris", "Prague"], correct: 1 },
    { question: "The Statue of Liberty was a gift from which country?", options: ["Germany", "Italy", "France", "Spain"], correct: 2 },
    { question: "Which landmark is located in Paris, France?", options: ["Eiffel Tower", "Statue of Liberty", "Colosseum", "Taj Mahal"], correct: 0 },
    { question: "Christ the Redeemer statue is located in which city?", options: ["Lisbon", "Rio de Janeiro", "Buenos Aires", "Santiago"], correct: 1 },
    { question: "Which country is home to the Sydney Opera House?", options: ["New Zealand", "South Africa", "Australia", "Canada"], correct: 2 },
    { question: "Which landmark is located in Agra, India?", options: ["Great Wall of China", "Statue of Liberty", "Taj Mahal", "Colosseum"], correct: 2 },
    { question: "Where is the Colosseum located?", options: ["Athens", "Rome", "Paris", "Madrid"], correct: 1 },
    { question: "Which city is home to the Sagrada Familia?", options: ["Madrid", "Barcelona", "Seville", "Valencia"], correct: 1 },
    { question: "The Leaning Tower of Pisa is located in which country?", options: ["France", "Spain", "Italy", "Greece"], correct: 2 },
    { question: "Which landmark is located in Athens, Greece?", options: ["Parthenon", "Colosseum", "Eiffel Tower", "Statue of Liberty"], correct: 0 },
    { question: "Where is the Great Barrier Reef located?", options: ["Australia", "Brazil", "South Africa", "India"], correct: 0 },
    { question: "Which city is home to the Golden Gate Bridge?", options: ["Los Angeles", "San Francisco", "New York City", "Chicago"], correct: 1 },
    { question: "The Petronas Towers are located in which city?", options: ["Bangkok", "Singapore", "Kuala Lumpur", "Jakarta"], correct: 2 },
    { question: "Which landmark is located in Cairo, Egypt?", options: ["Great Pyramid of Giza", "Eiffel Tower", "Statue of Liberty", "Colosseum"], correct: 0 },
    { question: "Where is the Acropolis located?", options: ["Rome", "Athens", "Paris", "Madrid"], correct: 1 }
],

       "mountains-rivers": [
    { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
    { question: "Which mountain range separates Europe and Asia?", options: ["Andes", "Rockies", "Himalayas", "Ural"], correct: 3 },
    { question: "What is the highest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], correct: 2 },
    { question: "Which river flows through Egypt?", options: ["Amazon", "Nile", "Yangtze", "Ganges"], correct: 1 },
    { question: "Which mountain is known as the 'Roof of the World'?", options: ["Himalayas", "Andes", "Rockies", "Alps"], correct: 0 },
    { question: "What is the longest river in North America?", options: ["Missouri River", "Mississippi River", "Colorado River", "Rio Grande"], correct: 1 },
    { question: "Which mountain range is known for its high peaks and trekking routes?", options: ["Appalachians", "Rockies", "Andes", "Himalayas"], correct: 3 },
    { question: "What is the largest river in South America?", options: ["Amazon River", "Orinoco River", "Paraná River", "São Francisco River"], correct: 0 },
    { question: "Which mountain is located in Africa?", options: ["Mount Kilimanjaro", "Mount Fuji", "Mount Elbrus", "Mount Denali"], correct: 0 },
    { question: "What river runs through London?", options: ["Thames River", "Seine River", "Danube River", "Rhine River"], correct: 0 },
    { question: "Which is the second highest mountain in the world?", options: ["K2", "Kangchenjunga", "Lhotse", "Makalu"], correct: 0 },
    { question: "Which river is the longest in Europe?", options: ["Danube", "Volga", "Rhine", "Elbe"], correct: 1 },
    { question: "Which mountain range is located in South America?", options: ["Rockies", "Andes", "Alps", "Himalayas"], correct: 1 },
    { question: "What is the highest mountain in Africa?", options: ["Mount Kilimanjaro", "Mount Kenya", "Mount Stanley", "Mount Meru"], correct: 0 },
    { question: "Which river forms part of the boundary between the United States and Mexico?", options: ["Colorado River", "Rio Grande", "Mississippi River", "Columbia River"], correct: 1 },
    { question: "Which mountain range is located in the western United States?", options: ["Appalachians", "Rockies", "Andes", "Alps"], correct: 1 },
    { question: "What is the longest river in Australia?", options: ["Murray River", "Darling River", "Murrumbidgee River", "Cooper Creek"], correct: 0 },
    { question: "Which mountain is the highest peak in North America?", options: ["Mount McKinley (Denali)", "Mount Logan", "Mount Saint Elias", "Mount Foraker"], correct: 0 },
    { question: "Which river is known as the lifeline of India?", options: ["Ganges", "Yamuna", "Brahmaputra", "Godavari"], correct: 0 },
    { question: "Which mountain range is located in New Zealand?", options: ["Southern Alps", "Rockies", "Andes", "Alps"], correct: 0 }
]
    };

    // Function to display a question
    function displayQuestion() {
        const questionData = currentQuiz[currentQuestionIndex];
        questionBox.textContent = questionData.question;

        // Clear previous options
        optionsContainer.innerHTML = "";

        // Add options
        questionData.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('option');
            optionEl.textContent = option;

            const circle = document.createElement('span');
            circle.classList.add('circle');
            optionEl.appendChild(circle);

            optionEl.addEventListener('click', () => {
                const allOptions = optionsContainer.querySelectorAll('.option');
                allOptions.forEach(opt => opt.classList.add('disabled')); // Disable all options after selection

                if (index === questionData.correct) {
                    optionEl.classList.add('correct');
                    circle.textContent = '✔';
                    score++;
                } else {
                    optionEl.classList.add('wrong');
                    circle.textContent = '✖';

                    // Highlight the correct answer
                    allOptions[questionData.correct].classList.add('correct');
                    allOptions[questionData.correct].querySelector('.circle').textContent = '✔';
                }

                updateProgress();
            });

            optionsContainer.appendChild(optionEl);
        });

        // Reset and start the timer
        resetTimer();
        startTimer();
    }

    // Function to update the progress bar
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${currentQuestionIndex + 1}/${currentQuiz.length}`; // Update progress text
    }

    function showFinalScore() {
        const finalScoreCard = document.getElementById('king');
        const scorePercentage = document.getElementById('scorePercentage');
        const slidingFinalScorePage = document.getElementById('slidingFinalScorePage');
        const scoreDetails = document.getElementById('scoreDetails');
        const circularProgress = document.querySelector('.circular-progress');

        if (!finalScoreCard || !scorePercentage || !circularProgress) {
            console.error("Final score card elements are missing in the DOM.");
            return;
        }

        // Calculate the percentage score
        const percentageScore = Math.round((score / currentQuiz.length) * 100);
        let currentPercentage = 0;
        const interval = setInterval(() => {
            if (currentPercentage >= percentageScore) {
                clearInterval(interval); // Stop the animation when the target is reached
            } else {
                currentPercentage++;
                scorePercentage.textContent = `${currentPercentage}%`;
                circularProgress.style.background = `conic-gradient(#000 ${currentPercentage * 3.6}deg, #F0F0F0 0deg)`;
            }
        }, 20);

        // Update the score percentage in the HTML
        scorePercentage.textContent = `${percentageScore}%`;
        scoreDetails.textContent = `${score} out of ${currentQuiz.length}`;

        // Show the final score card
        finalScoreCard.classList.remove('hidden');
        slidingFinalScorePage.classList.add('visible');

        // Trigger animations if score is between 8 and 10
        if (score >= 8 && score <= 10) {
            triggerAnimations();
        }
    }

    
    document.getElementById('restartQuiz').addEventListener('click', () => {
        const slidingFinalScorePage = document.getElementById('slidingFinalScorePage');

        // Hide the sliding final score page
        slidingFinalScorePage.classList.remove('visible');

        // Reset the quiz
        score = 0;
        currentQuestionIndex = 0;
        document.getElementById('slidingQuizPage').classList.remove('hidden'); // Show the quiz page
        displayQuestion(); // Restart the quiz

        // Remove the "No more questions" message if it exists
        const noMoreQuestionsMessage = document.querySelector('.no-more-questions');
        if (noMoreQuestionsMessage) {
            noMoreQuestionsMessage.remove();
        }

        // Re-enable the "Load More Questions" button
        const loadMoreButton = document.getElementById('loadMoreQuestions');
        loadMoreButton.disabled = false;
    });

    // Handle the "Next" button
    nextButton.addEventListener('click', () => {
        const allOptions = optionsContainer.querySelectorAll('.option');
        const isAnswered = Array.from(allOptions).some(option =>
            option.classList.contains('correct') || option.classList.contains('wrong')
        );

        if (!isAnswered) {
            alert("Please choose an answer before proceeding to the next question.");
            return; // Stop execution if no answer is selected
        }

        if (currentQuestionIndex < currentQuiz.length - 1) {
            currentQuestionIndex++;
            displayQuestion(); // Display the next question
        } else {
            showFinalScore(); // Call the function to show the final score
        }
    });

    const closeButton = document.getElementById('closeQuiz'); // Select the close button
    closeButton.addEventListener('click', () => {
        slidingQuizPage.classList.remove('active'); // Hide the quiz page
    });

    // Add click event listeners to subcategory cards
    quizCards.forEach(card => {
        card.addEventListener('click', () => {
            const subcategory = card.getAttribute('data-subcategory'); // Get the subcategory
            currentSubcategory = subcategory; // Store the current subcategory
            currentQuiz = allQuestions[subcategory].slice(0, 10); // Load the first 10 questions for the selected subcategory

            if (currentQuiz.length === 0) {
                alert("No questions for this subcategory yet.");
                return;
            }

            currentQuestionIndex = 0; // Reset to the first question
            score = 0; // Reset the score
            loadCount = 0; // Reset load count when starting new subcategory
            document.getElementById('loadMoreQuestions').disabled = false;
            slidingQuizPage.classList.add('active'); // Show the quiz page
            displayQuestion(); // Display the first question
            updateProgress(); // Reset the progress bar
        });
    });

    // Modified loadMoreQuestions function
    document.getElementById('loadMoreQuestions').addEventListener('click', () => {
        const subcategory = currentSubcategory;
        const allSubcategoryQuestions = allQuestions[subcategory] || [];

        // Increment load count
        loadCount++;

        // Check if we've reached max loads
        if (loadCount > MAX_LOADS) {
            showNoMoreQuestionsMessage();
            return;
        }

        // Calculate next set of questions
        const questionsLoaded = (loadCount * 10); // 10, 20, 30
        const nextSetOfQuestions = allSubcategoryQuestions.slice(questionsLoaded, questionsLoaded + 10);

        // Check if there are actually questions to load
        if (nextSetOfQuestions.length === 0) {
            showNoMoreQuestionsMessage();
            return;
        }

        // Set current quiz to ONLY the new questions
        currentQuiz = nextSetOfQuestions;

        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;

        // Update UI
        updateProgress();
        displayQuestion();

        // Hide final score page if visible
        document.getElementById('slidingFinalScorePage')?.classList.remove('visible');
    });

    // Helper function to show no more questions message
    function showNoMoreQuestionsMessage() {
        // Remove any existing message first
        const existingMessage = document.querySelector('.no-more-questions');
        if (existingMessage) existingMessage.remove();

        // Create and show new message
        const message = document.createElement('div');
        message.className = 'no-more-questions';
        message.textContent = "No more questions available in this subcategory.";
        message.style.color = "#fff";
        message.style.backgroundColor = "#ff0000";
        message.style.padding = "10px";
        message.style.borderRadius = "5px";
        message.style.marginTop = "20px";
        message.style.textAlign = "center";
        message.style.zIndex = "10000";

        // Insert after the next button
        nextButton.insertAdjacentElement('afterend', message);

        // Disable the load more button
        document.getElementById('loadMoreQuestions').disabled = true;
    }

    // Timer functionality
    let timer;
    let timeLeft = 20; // Initial time for the timer

    function startTimer() {
        const timerText = document.getElementById('timerText');
        const timerCircle = document.getElementById('timerCircle');

        timer = setInterval(() => {
            timeLeft--;
            timerText.textContent = timeLeft;

            // Update the conic gradient to reflect the time left
            const progress = (timeLeft / 10) * 100;
            timerCircle.style.background = `conic-gradient(#29b6f6 ${progress * 3.6}deg, transparent 0deg)`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                // Handle timeout (e.g., move to next question or show answer)
                const allOptions = optionsContainer.querySelectorAll('.option');
                allOptions.forEach(opt => opt.classList.add('disabled')); // Disable all options after timeout

                // Highlight the correct answer
                const questionData = currentQuiz[currentQuestionIndex];
                allOptions[questionData.correct].classList.add('correct');
                allOptions[questionData.correct].querySelector('.circle').textContent = '✔';

                // Move to the next question after a delay
                setTimeout(() => {
                    if (currentQuestionIndex < currentQuiz.length - 1) {
                        currentQuestionIndex++;
                        displayQuestion(); // Display the next question
                    } else {
                        showFinalScore(); // Call the function to show the final score
                    }
                }, 1000);
            }
        }, 1000); // Update every second
    }

    function resetTimer() {
        clearInterval(timer);
        timeLeft = 20; // Reset the timer
        document.getElementById('timerText').textContent = timeLeft;
        document.getElementById('timerCircle').style.background = `conic-gradient(#29b6f6 360deg, transparent 0deg)`;
    }
});
