const upload = document.getElementById('upload');
const resizeBtn = document.getElementById('resizeBtn');
const resetBtn = document.getElementById('resetBtn');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');
const dropZone = document.getElementById('drop_zone');

let originalImage = new Image();

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
    alert('Please enter valid width and height!');
    return;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(originalImage, 0, 0, width, height);

  const resizedImageURL = canvas.toDataURL('image/png');

  output.innerHTML = `
    <h3>Resized Image:</h3>
    <img src="${resizedImageURL}" alt="Resized Image" style="max-width: 100%; display: block; margin: 0 auto 1rem auto;" />
    <a href="${resizedImageURL}" download="resized-image.png">
      <button class="download-btn">Download Image</button>
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

