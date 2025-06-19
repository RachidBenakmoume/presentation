let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function showSlide(n) {
  slides.forEach((slide) => slide.classList.remove("active"));
  if (n >= totalSlides) currentSlide = 0;
  if (n < 0) currentSlide = totalSlides - 1;
  slides[currentSlide].classList.add("active");
  document.getElementById("slideCounter").textContent = `${
    currentSlide + 1
  } / ${totalSlides}`;
  document.getElementById("prevBtn").disabled = currentSlide === 0;
  document.getElementById("nextBtn").disabled =
    currentSlide === totalSlides - 1;
}

function changeSlide(direction) {
  currentSlide += direction;
  showSlide(currentSlide);
}

// Navigation au clavier
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowRight":
    case " ":
    case "Enter":
      if (currentSlide < totalSlides - 1) changeSlide(1);
      break;
    case "ArrowLeft":
      if (currentSlide > 0) changeSlide(-1);
      break;
    case "Home":
      currentSlide = 0;
      showSlide(currentSlide);
      break;
    case "End":
      currentSlide = totalSlides - 1;
      showSlide(currentSlide);
      break;
  }
});

// Fonctions pour les compétences avant/après
function showAvant() {
  const container = document.getElementById("skillsContainer");
  if (container) {
    container.style.setProperty("--clip-position", "90%");
  }
}

function showApres() {
  const container = document.getElementById("skillsContainer");
  if (container) {
    container.style.setProperty("--clip-position", "10%");
  }
}

// Navigation tactile pour mobile/tablette
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', function(event) {
  startX = event.touches[0].clientX;
});

document.addEventListener('touchend', function(event) {
  endX = event.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const threshold = 50; // Distance minimale pour déclencher le swipe
  const deltaX = endX - startX;
  
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0 && currentSlide > 0) {
      // Swipe vers la droite - slide précédent
      changeSlide(-1);
    } else if (deltaX < 0 && currentSlide < totalSlides - 1) {
      // Swipe vers la gauche - slide suivant
      changeSlide(1);
    }
  }
}

// Navigation avec la molette de la souris
document.addEventListener('wheel', function(event) {
  event.preventDefault();
  
  const delta = event.deltaY;
  const threshold = 50;
  
  if (Math.abs(delta) > threshold) {
    if (delta > 0 && currentSlide < totalSlides - 1) {
      // Scroll vers le bas - slide suivant
      changeSlide(1);
    } else if (delta < 0 && currentSlide > 0) {
      // Scroll vers le haut - slide précédent
      changeSlide(-1);
    }
  }
}, { passive: false });

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
  // Réajuster les éléments si nécessaire
  showSlide(currentSlide);
});



// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    showSlide(0);
    initModal(); // Ajouter cette ligne
    
    // Position par défaut des compétences après un court délai
    setTimeout(() => {
      const container = document.getElementById("skillsContainer");
      if (container) {
        container.style.setProperty("--clip-position", "90%");
      }
    }, 100);
  });

// Gestion des raccourcis clavier supplémentaires
document.addEventListener("keydown", function (event) {
  // Ctrl+Home : Aller à la première slide
  if (event.ctrlKey && event.key === "Home") {
    event.preventDefault();
    currentSlide = 0;
    showSlide(currentSlide);
  }
  
  // Ctrl+End : Aller à la dernière slide
  if (event.ctrlKey && event.key === "End") {
    event.preventDefault();
    currentSlide = totalSlides - 1;
    showSlide(currentSlide);
  }
  
  // F5 : Recharger la présentation
  if (event.key === "F5") {
    event.preventDefault();
    location.reload();
  }
  
  // Escape : Mode plein écran (si supporté)
  if (event.key === "Escape") {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }
  
  // F11 : Basculer en mode plein écran
  if (event.key === "F11") {
    event.preventDefault();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
});

// Fonctions utilitaires pour la navigation
function goToSlide(slideNumber) {
  if (slideNumber >= 0 && slideNumber < totalSlides) {
    currentSlide = slideNumber;
    showSlide(currentSlide);
  }
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    changeSlide(1);
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    changeSlide(-1);
  }
}

function firstSlide() {
  currentSlide = 0;
  showSlide(currentSlide);
}

function lastSlide() {
  currentSlide = totalSlides - 1;
  showSlide(currentSlide);
}


let currentModalIndex = 0;
let modalImages = [];

// Initialisation du modal
function initModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  
  // Collecter toutes les images cliquables
  modalImages = Array.from(document.querySelectorAll('.content-image'));
  
  // Ajouter les event listeners pour chaque image
  modalImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      openModal(index);
    });
  });
  
  // Fermer le modal
  closeBtn.addEventListener('click', closeModal);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  
  // Fermer en cliquant à l'extérieur de l'image
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Navigation clavier dans le modal (sans conflit avec la présentation)
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'block') {
      e.stopPropagation(); // Empêcher les conflits avec la navigation de slides
      switch(e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
      }
    }
  });
}

// Ouvrir le modal avec une image spécifique
function openModal(index) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  
  currentModalIndex = index;
  const img = modalImages[index];
  
  modal.style.display = 'block';
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  
  // Chercher la légende associée
  const container = img.closest('.image-container');
  const legend = container ? container.querySelector('.image-legend') : null;
  modalCaption.textContent = legend ? legend.textContent : img.alt;
  
  // Gestion de l'affichage des boutons de navigation
  updateModalNavigation();
  
  // Empêcher le scroll de la page
  document.body.style.overflow = 'hidden';
}

// Fermer le modal
function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Image précédente
function showPrevImage() {
  if (currentModalIndex > 0) {
    openModal(currentModalIndex - 1);
  }
}

// Image suivante
function showNextImage() {
  if (currentModalIndex < modalImages.length - 1) {
    openModal(currentModalIndex + 1);
  }
}

// Mettre à jour la navigation du modal
function updateModalNavigation() {
  const prevBtn = document.querySelector('.modal-prev');
  const nextBtn = document.querySelector('.modal-next');
  
  prevBtn.style.display = currentModalIndex > 0 ? 'flex' : 'none';
  nextBtn.style.display = currentModalIndex < modalImages.length - 1 ? 'flex' : 'none';
}

// Exposer les fonctions globalement
window.openModal = openModal;
window.closeModal = closeModal;

// Exposer les fonctions globalement pour pouvoir les utiliser depuis l'HTML
window.showAvant = showAvant;
window.showApres = showApres;
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.firstSlide = firstSlide;
window.lastSlide = lastSlide;