// schedules.js - Handles dynamic loading of event schedules

document.addEventListener("DOMContentLoaded", function () {
  loadSchedules();
});

function loadSchedules() {
  const scheduleList = document.getElementById("schedule-list");
  if (!scheduleList) return;

  // Example schedule data (replace with real data or fetch from API)
  const schedules = [
    {
      title: "Neon Nights Festival 2025",
      date: "March 15, 2025, 6:00 PM",
      location: "Miami Beach",
      description:
        "The ultimate electronic music experience with world-class DJs and immersive visual effects.",
    },
    {
      title: "Tech Innovation Summit",
      date: "February 28, 2025, 9:00 AM",
      location: "San Francisco",
      description:
        "Discover the future of technology with industry leaders and innovative startups.",
    },
    {
      title: "Summer Music Carnival",
      date: "June 21, 2025, 4:00 PM",
      location: "Los Angeles",
      description:
        "A celebration of music, art, and culture under the summer sun.",
    },
  ];

  schedules.forEach((event) => {
    const item = document.createElement("div");
    item.className = "schedule-item";
    item.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-date"><i class="fas fa-calendar"></i> ${event.date}</div>
            <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
            <div class="event-description">${event.description}</div>
        `;
    scheduleList.appendChild(item);
  });
}
