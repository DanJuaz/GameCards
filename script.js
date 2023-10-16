let gameStarted = false;
let flippedCardCount = 0; 
let paircardCount = 0; 
let pairOddCount = 0; 
let cardslist = [];
let cardsDicc = {};
const mainUrl = 'assets/img';
let selectedCard = null;
let selectedCardPosicion = null
let clickCount = 0;
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const win_short = document.getElementById("win-short");
let volumen = true;
let tiempoTotalJuego = 0;

// Empezar game
function startGame() {
  //Reiniciar values
  flippedCardCount = 0;
  paircardCount = 0;
  pairOddCount = 0;
  cardslist = [];
  selectedCard = null;
  selectedCardPosicion = null;
  clickCount = 0;
  tiempoTotalJuego = 0;

  document.getElementById('content-container').style.display = 'block';
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('end-screen').style.display = 'none';
  const cardContainer = document.getElementById('cardcontainer');
  cardContainer.innerHTML = '';
  gameStarted = true;
  showcards();
}
function endGame() {
  tiempoTotalJuego = tiempoTotal;
  document.getElementById('content-container').style.display = 'none';
  document.getElementById('end-screen').style.display = 'flex';
  const tiempoTotalFormatted = formatTiempo(tiempoTotalJuego);
  document.getElementById('tiempo-total').innerText = tiempoTotalFormatted;
  let turned = paircardCount + pairOddCount;
  document.getElementById('turn').innerText = turned;
  gameStarted = false;
}

// Mostrar lista de cartas
function showcards() {
  if(!gameStarted) return;
  //Cambia span play -> pause
    playButtonIcon.innerText = 'pause_circle';
    startStop();
    const volume_up = document.getElementById('volumen-up');
    const volume_off = document.getElementById('volumen-off');
    const isDisplayBlock = window.getComputedStyle(volume_up).display;
    const isDisplayOffBlock = window.getComputedStyle(volume_off).display;
    volume_up.addEventListener('click',function() {
      if( isDisplayBlock === 'block'){
        volume_off.style.display = 'block';
        volume_up.style.display = 'none';
        volumen = false;
      } 
    });
    volume_off.addEventListener('click',function() {
      if( isDisplayOffBlock === 'none'){
        volume_up.style.display = 'block';
        volume_off.style.display = 'none';
        volumen = true;
      }
    });
    const cardContainer = document.getElementById('cardcontainer');
    while (cardslist.length < 8) {
        const numRandom = getRandom();

        // Verifica si el número ya está en la lista
        if (!cardslist.includes(numRandom)) {
            cardslist.push(numRandom);
            cardslist.push(numRandom);
        }
    }

    // Mezclar la list
    cardslist = shuffle(cardslist);


    for (let i = 0; i < cardslist.length; i++) {
      const numRandom = cardslist[i];
      const imageUrlFront = `${mainUrl}/0${numRandom}.webp`;
      const [card, cardFront, cardBack, imageFront, imageBack] = createFlipCard(imageUrlFront);
      
      cardFront.appendChild(imageFront);
      cardBack.appendChild(imageBack);
      card.appendChild(cardBack);
      card.appendChild(cardFront);
      cardContainer.appendChild(card);
  
      // Event -> Click -> Mostrar imagen front
      card.addEventListener('click', function () {
        if (clickCount >= 2) {
          clickCount = 0;
          return;
      }
  
      clickCount++;
        
        // Card alredy matched Do Nothing
        if(card.classList.contains('matched')) {
        return;
        }
        // Cambiar class -> Flipped
        card.classList.toggle('is-flipped');
        const clickedImageUrl = imageFront.src;
        
        if (selectedCard === null) {
          selectedCardPosicion = i;
          selectedCard = clickedImageUrl;
          selectedCardElement = card;
        } else {
          // Coincidir TRUE
          if (selectedCard === clickedImageUrl) {
            if (selectedCardPosicion !== i) {
              playWinshortSound(volumen);
              paircardCount += 1;
              setTimeout(() => {
                card.classList.add('matched', 'selected');
                selectedCardElement.classList.add('matched', 'selected');
                selectedCard = null;
              }, 780);
              if (paircardCount === cardslist.length/2) {
                endGame();
                playWinSound(volumen);

              }
            }

          // Coincidir FALSE
          } else {
            playLoseSound(volumen);
            pairOddCount += 1;
            console.log('¡Las cartas son diferentes!'); 
            console.log(selectedCard);
            console.log(clickedImageUrl); 
            setTimeout(() => {
              card.classList.toggle('is-flipped');
              selectedCardElement.classList.toggle('is-flipped');
              selectedCard = null;
            }, 780);
          }
        }
      }); 
      
    }
    
}



// Get random number between 1 and 8
function getRandom() {
  return Math.floor(Math.random() * 8) + 1;
}
// Funcion mezclar
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }

  return array;
}

//  TIME
let tiempoTotal = 0;  
let intervalo;  

function startStop() {
  tiempoTotal = 0;
  detenerContador();  
  intervalo = setInterval(actualizarContador, 10);
}

function detenerContador() {
  clearInterval(intervalo);
  intervalo = null;
}

function actualizarContador() {
  tiempoTotal += 10;

  const minutos = Math.floor(tiempoTotal / (1000 * 60));
  const segundos = Math.floor((tiempoTotal % (1000 * 60)) / 1000);
  const milisegundos = tiempoTotal % 1000;

  const tiempoFormateado = `${agregarCeros(minutos)}:${agregarCeros(segundos)}:${agregarCerosMilisegundos(milisegundos)}`;

  document.getElementById('contador').innerText = tiempoFormateado;
}

function agregarCeros(valor) {
  return valor < 10 ? `0${valor}` : valor;
}

function agregarCerosMilisegundos(valor) {
  if (valor < 10) {
    return `00${valor}`;
  } else if (valor < 100) {
    return `0${valor}`;
  }
  return valor;
}
function formatTiempo(tiempo) {
  const minutos = Math.floor(tiempo / (1000 * 60));
  const segundos = Math.floor((tiempo % (1000 * 60)) / 1000);
  const milisegundos = tiempo % 1000;
  return `${agregarCeros(minutos)}:${agregarCeros(segundos)}:${agregarCerosMilisegundos(milisegundos)}`;
}

// Function Create HTML
function createFlipCard(imageUrlFront){
  const card = document.createElement('div');
  card.className = 'card is-flipped';

  const cardFront = document.createElement('div');
  cardFront.className = 'card__face card__face--front';
  
  const cardBack = document.createElement('div');
  cardBack.className = 'card__face card__face--back';
  
  const imageFront = document.createElement('img');
  imageFront.src = imageUrlFront;
  
  // Image for the back (00.webp)
  const imageBack = document.createElement('img');
  imageBack.src = `${mainUrl}/00.webp`;
  return [card, cardFront, cardBack, imageFront, imageBack];
}
// Play sound
function playWinSound() {
  if (volumen) {
    winSound.play();
  }
}

function playLoseSound() {
  if (volumen) {
    loseSound.play();
  }
}
function playWinshortSound() {
  if (volumen) {
    win_short.play();
  }
}

