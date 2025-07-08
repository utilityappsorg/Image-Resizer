const upload = document.getElementById('upload');
const resizeBtn = document.getElementById('resizeBtn');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const canvas = document.getElementById('canvas');
const output = document.getElementById('output');

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
    <img src="${resizedImageURL}" alt="Resized Image" style="max-width: 100%;" />
    <a href="${resizedImageURL}" download="resized-image.png">
      <button>Download Image</button>
    </a>
  `;
});