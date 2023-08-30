const uploadForm = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');
const fileContent = document.getElementById('fileContent');
const imageOrVideo = document.getElementById('imageOrVideo');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(uploadForm);
  
  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      console.log('File uploaded successfully');
      fetchFileList(); // Refresh the file list
      uploadForm.reset(); // Clear the input field
    } else {
      console.error('Upload failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

async function fetchFileList() {
  fileList.innerHTML = '';
  
  try {
    const response = await fetch('/list');
    const data = await response.json();
    
    data.forEach((file) => {
      const listItem = document.createElement('li');
      const downloadLink = document.createElement('a');
      const viewLink = document.createElement('a');

      downloadLink.href = `/download/${file}`;
      downloadLink.textContent = 'Download';

      viewLink.href = `#`;
      viewLink.textContent = 'View';
      viewLink.addEventListener('click', () => viewFile(file));

      listItem.textContent = file; // Display the filename
      listItem.appendChild(document.createTextNode(' '));
      listItem.appendChild(downloadLink);
      listItem.appendChild(document.createTextNode(' | '));
      listItem.appendChild(viewLink);

      fileList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function viewFile(filename) {
  try {
    const response = await fetch(`/view/${filename}`);
    const data = await response.text();

    if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
      // Display image
      imageOrVideo.innerHTML = `<img src="data:image/png;base64,${data}" alt="${filename}" />`;
    } else if (filename.match(/\.(mp4)$/i)) {
      // Display video
      imageOrVideo.innerHTML = `<video controls>
                                  <source src="data:video/mp4;base64,${data}" type="video/mp4">
                                Your browser does not support the video tag.
                                </video>`;
    } else {
      // Display other file types
      fileContent.textContent = data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchFileList();
