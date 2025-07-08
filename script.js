const upload = document.getElementById('upload');
const resizeBtn = document.getElementById('resizeBtn');
const resetBtn = document.getElementById('resetBtn');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const webcamBtn = document.getElementById('webcamBtn');
const webcam = document.getElementById('webcam');
const captureBtn = document.getElementById('captureBtn');

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
