const upload = document.getElementById('upload');
const resizeBtn = document.getElementById('resizeBtn');
const resetBtn = document.getElementById('resetBtn');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');

const dropZone = document.getElementById('drop_zone');

const webcamBtn = document.getElementById('webcamBtn');
const webcam = document.getElementById('webcam');
const captureBtn = document.getElementById('captureBtn');
const languageSelect = document.getElementById('languageSelect');


let originalImage = new Image();
let webcamStream = null;

const translations = {
  en: {
    title: "Image Resizer",
    width: "Width:",
    height: "Height:",
    resize: "Resize Image",
    reset: "Reset",
    resizedImage: "Resized Image:",
    download: "Download Image",
    alert: "Please enter valid width and height!"
  },
  es: {
    title: "Redimensionador de Imágenes",
    width: "Ancho:",
    height: "Alto:",
    resize: "Redimensionar Imagen",
    reset: "Restablecer",
    resizedImage: "Imagen Redimensionada:",
    download: "Descargar Imagen",
    alert: "¡Por favor, introduce un ancho y alto válidos!"
  },
  fr: {
    title: "Redimensionneur d'Image",
    width: "Largeur:",
    height: "Hauteur:",
    resize: "Redimensionner l'image",
    reset: "Réinitialiser",
    resizedImage: "Image Redimensionnée:",
    download: "Télécharger l'image",
    alert: "Veuillez entrer une largeur et une hauteur valides !"
  }
  // Add more languages as needed
};

upload.addEventListener('change', function () {
  const file = upload.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    originalImage.src = e.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

resizeBtn.addEventListener('click', function () {
  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);

  if (!width || !height || isNaN(width) || isNaN(height)) {
    alert(translations.en.alert);
    return;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(originalImage, 0, 0, width, height);

  const resizedImageURL = canvas.toDataURL('image/png');

  output.innerHTML = `
    <h3>${translations.en.resizedImage}</h3>
    <img src="${resizedImageURL}" alt="Resized Image" style="max-width: 100%; display: block; margin: 0 auto 1rem auto;" />
    <a href="${resizedImageURL}" download="resized-image.png">
      <button class="download-btn">${translations.en.download}</button>
    </a>
  `;
});

resetBtn.addEventListener('click', function () {
  upload.value = '';
  widthInput.value = '';
  heightInput.value = '';
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  output.innerHTML = '';
  originalImage = new Image();
});


// Drag and drop functionality

dropZone.addEventListener('dragover', function(ev) {
  ev.preventDefault();
  dropZone.style.backgroundColor = '#255acd';
});

dropZone.addEventListener('dragleave', function(ev) {
  dropZone.style.backgroundColor = '#2563eb';
});

dropZone.addEventListener('drop', function(ev) {
  ev.preventDefault();
  dropZone.style.backgroundColor = '#2563eb';
  let file;
  if (ev.dataTransfer.items) {
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      if (ev.dataTransfer.items[i].kind === 'file') {
        file = ev.dataTransfer.items[i].getAsFile();
        break;
      }
    }
  } else if (ev.dataTransfer.files.length > 0) {
    file = ev.dataTransfer.files[0];
  }
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      originalImage.src = e.target.result;
      output.innerHTML = `<h3>Preview:</h3><img src="${e.target.result}" alt="Preview Image" style="max-width: 100%; display: block; margin: 0 auto 1rem auto;" />`;
    };
    reader.readAsDataURL(file);
    upload.value = '';
  } else {
    alert('Please drop a valid image file.');
  }
});


webcamBtn.addEventListener('click', async function () {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      webcam.style.display = 'block';
      captureBtn.style.display = 'inline-block';
      webcamBtn.style.display = 'none';
      webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcam.srcObject = webcamStream;
    } catch (err) {
      alert('Webcam access denied or not available.');
    }
  } else {
    alert('Webcam not supported in this browser.');
  }
});

captureBtn.addEventListener('click', function () {
  // Draw the current video frame to the canvas
  const ctx = canvas.getContext('2d');
  canvas.width = webcam.videoWidth;
  canvas.height = webcam.videoHeight;
  ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);

  // Convert canvas to image and set as originalImage
  originalImage.src = canvas.toDataURL('image/png');

  // Stop webcam
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
  }
  webcam.style.display = 'none';
  captureBtn.style.display = 'none';
  webcamBtn.style.display = 'inline-block';
});

function updateLanguage(lang) {
  document.querySelector('.container h1').textContent = translations[lang].title;
  document.querySelector('label[for="width"]')?.childNodes[0] && (document.querySelector('label[for="width"]').childNodes[0].textContent = translations[lang].width + ' ');
  document.querySelector('label[for="height"]')?.childNodes[0] && (document.querySelector('label[for="height"]').childNodes[0].textContent = translations[lang].height + ' ');
  resizeBtn.textContent = translations[lang].resize;
  resetBtn.textContent = translations[lang].reset;
  // If output is showing a resized image, update its heading and button
  if (output.innerHTML.includes('Resized Image') || output.innerHTML.includes('Imagen Redimensionada') || output.innerHTML.includes('Image Redimensionnée')) {
    const img = output.querySelector('img');
    const a = output.querySelector('a');
    if (img && a) {
      output.innerHTML = `<h3>${translations[lang].resizedImage}</h3>` + img.outerHTML + `<a href="${img.src}" download="resized-image.png"><button class="download-btn">${translations[lang].download}</button></a>`;
    }
  }
}

languageSelect.addEventListener('change', function() {
  const lang = languageSelect.value;
  updateLanguage(lang);
});

// Set initial language
updateLanguage(languageSelect.value);

