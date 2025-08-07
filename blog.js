document.addEventListener("DOMContentLoaded", () => {
  const blogList = document.getElementById("blog-list");

  const blogs = [
    {
      title: "Neon Nights Festival 2025: What to Expect",
      date: "February 1, 2025",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      excerpt: "Get ready for an unforgettable night filled with electrifying music, amazing visuals, and vibrant energy. Here's everything you need to know about the upcoming Neon Nights Festival.",
      url: "#",
    },
    {
      title: "Behind the Scenes: Setting Up a Mega Event",
      date: "January 20, 2025",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      excerpt: "Discover the complex logistics and planning that goes into making a large-scale event happen, from stage construction to sound checks.",
      url: "#",
    },
    {
      title: "Top 10 DJs You Can't Miss in 2025",
      date: "January 15, 2025",
      image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80",
      excerpt: "We’ve compiled a list of the hottest DJs coming to events this year, complete with their music style and must-see performances.",
      url: "#",
    },
    {
      title: "Sustainability in Festivals: Our Commitment",
      date: "December 30, 2024",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      excerpt: "Learn how EventPulse is working to minimize environmental impact and promote sustainability at our events.",
      url: "#",
    },
    {
      title: "How to Get the Best Experience at Live Events",
      date: "December 15, 2024",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      excerpt: "Tips and tricks for attendees to make the most out of any live concert or festival, from gear to mindset.",
      url: "#",
    },
    {
      title: "Artist Spotlight: Rising Stars to Watch",
      date: "November 30, 2024",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      excerpt: "Meet the up-and-coming artists who are making waves and will be featured at upcoming EventPulse events.",
      url: "#",
    },
    {
      title: "Virtual Events: The Future of Concerts?",
      date: "November 10, 2024",
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
      excerpt: "Explore how virtual and hybrid events are changing the way we experience live music and what EventPulse is planning next.",
      url: "#",
    },
    {
      title: "Safety Tips for Festival-Goers",
      date: "October 25, 2024",
      image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80",
      excerpt: "Your safety is our priority. Here are some essential tips to stay safe while enjoying your favorite festivals.",
      url: "#",
    },
    {
      title: "EventPulse Community Stories",
      date: "October 10, 2024",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      excerpt: "Hear from the amazing people who make our events memorable — stories from fans, artists, and staff.",
      url: "#",
    },
    {
      title: "Music and Technology: What’s New in 2025",
      date: "September 28, 2024",
      image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80",
      excerpt: "From holograms to AI-generated visuals, check out the latest innovations redefining the concert experience.",
      url: "#",
    },
    {
      title: "How We Choose Event Venues at EventPulse",
      date: "September 1, 2024",
      image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80",
      excerpt: "Choosing the perfect venue is crucial. Here's how our team selects iconic locations that elevate the audience experience.",
      url: "#",
    },
    {
      title: "Exclusive Backstage Access: What It’s Really Like",
      date: "August 18, 2024",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      excerpt: "Go behind the curtain and see what artists and production crews experience before the show begins.",
      url: "#",
    },
  ];

  blogs.forEach((post) => {
    const article = document.createElement("div");
    article.className = "blog-post";
    article.innerHTML = `
      <img src="${post.image}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/800x600?text=Fallback+Image'" />
      <div class="blog-content">
        <div class="blog-title">${post.title}</div>
        <div class="blog-date">${post.date}</div>
        <div class="blog-excerpt">${post.excerpt}</div>
        <a class="read-more" href="${post.url}">Read More</a>
      </div>
    `;
    blogList.appendChild(article);
  });
});