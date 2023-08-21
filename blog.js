document.addEventListener("DOMContentLoaded", function () {
    const blogsContainer = document.getElementById("blogs-container");
  
    fetch("/blogdata")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((blog) => {
          const blogCard = document.createElement("div");
          blogCard.className = "blog-card";
  
          const blogImage = document.createElement("img");
          blogImage.src = blog.image; // Replace with the actual image path
          blogImage.className ='blog-image';
  
          const blogTitle = document.createElement("h1");
          blogTitle.className = "blog-title";
          blogTitle.textContent = blog.title;
  
          const blogOverview = document.createElement("p");
          blogOverview.className = "blog-overview";
          blogOverview.textContent = blog.content;
  
          const readMoreLink = document.createElement("a");
          readMoreLink.href = "#"; // Replace with the actual link
          readMoreLink.className = "btn-dark";
          readMoreLink.textContent = "Read More";
  
          blogCard.appendChild(blogImage);
          blogCard.appendChild(blogTitle);
          blogCard.appendChild(blogOverview);
          blogCard.appendChild(readMoreLink);
  
          blogsContainer.appendChild(blogCard);
        });
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
      });
  });
  