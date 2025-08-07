// gallery.js - Dynamically loads gallery images

document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
});

function loadGallery() {
  const galleryGrid = document.getElementById("gallery-grid");
  if (!galleryGrid) return;

  const images = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1515165562835-c4068c3ea6c6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80"
  ];

  galleryGrid.innerHTML = ""; // Clear existing

  images.forEach((imgUrl) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "gallery-item";

    imgWrapper.innerHTML = `
      <img src="${imgUrl}" alt="Event photo" loading="lazy" />
    `;

    galleryGrid.appendChild(imgWrapper);
  });
}
