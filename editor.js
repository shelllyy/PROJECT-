const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
  uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', ()=>{
  uploadImage(uploadInput, "image")
})

const uploadImage = (uploadFile, uploadType) => {
  const [file] = uploadFile.files;
  if (file && file.type.includes("image")) {
    const formdata = new FormData();
    formdata.append('image', file);

    fetch('/uploads', {
      method: 'post',
      body: formdata,
    }).then((res) => res.json())
      .then((data) => {
        if(uploadType=="image"){
          addImage(data, file.name);
          console.log("Image path:", data);
          console.log("File name:", file.name);
        }
        else{
          bannerPath = `${location.origin}/${data}`;
          banner.style.backgroundImage = `url("${bannerPath}")`;
        }
      });   
  }
  else{
    alert("upload Image only")
  }
};

const addImage = (imagepath, alt)=>{
  let curPos = articleFeild.selectionStart;
  let textToInsert =`\r![${alt}](${imagepath})\r`;
  articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
}


publishBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const title = blogTitleField.value;
  const content = articleFeild.value;

  if (title.trim() === '' || content.trim() === '') {
    alert('Please fill in the title and content.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('image', bannerPath);

  fetch('/publish', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data.message);
      // Clear the form fields or redirect to a success page if needed
    })
    .catch((error) => {
      console.error('Error publishing blog:', error);
    });
});

