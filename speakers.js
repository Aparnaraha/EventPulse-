// speakers.js - Load speaker profiles dynamically with valid Unsplash images

document.addEventListener("DOMContentLoaded", () => {
  loadSpeakers();
});

function loadSpeakers() {
  const speakersContainer = document.getElementById("speakers-list");
  if (!speakersContainer) return;

  const speakers = [
    {
      name: "Emily Johnson",
      bio: "Tech innovator and AI expert with 10+ years in the industry.",
      photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Michael Lee",
      bio: "Renowned music producer and festival curator.",
      photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Sophia Martinez",
      bio: "Entrepreneur and speaker on innovation and startups.",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "David Kim",
      bio: "Award-winning visual artist and multimedia storyteller.",
      photo: "https://images.unsplash.com/photo-1508214751197-8db65184a9e3?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Clear existing content (if any)
  speakersContainer.innerHTML = "";

  speakers.forEach(speaker => {
    const speakerCard = document.createElement("div");
    speakerCard.className = "speaker-card";

    speakerCard.innerHTML = `
      <div class="speaker-photo">
        <img src="${speaker.photo}" alt="Photo of ${speaker.name}" loading="lazy" />
      </div>
      <div class="speaker-info">
        <h3 class="speaker-name">${speaker.name}</h3>
        <p class="speaker-bio">${speaker.bio}</p>
      </div>
    `;

    speakersContainer.appendChild(speakerCard);
  });
}
