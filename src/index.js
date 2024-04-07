let addToy = false;

// Event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // Toggle the display of the toy form container
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block"; // Show the toy form container
    } else {
      toyFormContainer.style.display = "none"; // Hide the toy form container
    }
  });
});

// Another event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");

  // Fetch Andy's Toys
  fetchToys();

  // Add a New Toy
  const toyForm = document.getElementById("toy-form");
  toyForm.addEventListener("submit", event => {
      event.preventDefault();

      const formData = new FormData(toyForm);
      const newToyData = {
          name: formData.get("name"),
          image: formData.get("image"),
          likes: 0
      };

      createNewToy(newToyData);
  });

  // Increase a Toy's Likes
  toyCollection.addEventListener("click", event => {
      if (event.target.classList.contains("like-btn")) {
          const toyId = event.target.dataset.id; // Use data-id attribute to store the toy ID
          const toyCard = event.target.closest(".card");

          updateToyLikes(toyId, toyCard);
      }
  });

  // Function to fetch toys from the API
  function fetchToys() {
      fetch("http://localhost:3000/toys")
          .then(response => response.json())
          .then(toys => {
              toys.forEach(toy => {
                  const card = createToyCard(toy);
                  toyCollection.appendChild(card);
              });
          });
  }

  // Function to create a new toy
  function createNewToy(newToyData) {
      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify(newToyData)
      })
      .then(response => response.json())
      .then(newToy => {
          const card = createToyCard(newToy);
          toyCollection.appendChild(card);
      });
  }

  // Function to update toy likes
  function updateToyLikes(toyId, toyCard) {
      fetch(`http://localhost:3000/toys/${toyId}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({
              likes: parseInt(toyCard.querySelector("p").textContent) + 1
          })
      })
      .then(response => response.json())
      .then(updatedToy => {
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Function to create a card for a toy
  function createToyCard(toy) {
      const card = document.createElement("div");
      card.className = "card";

      const h2 = document.createElement("h2");
      h2.textContent = toy.name;

      const img = document.createElement("img");
      img.src = toy.image;
      img.className = "toy-avatar";

      const p = document.createElement("p");
      p.textContent = `${toy.likes} Likes`;

      const button = document.createElement("button");
      button.className = "like-btn";
      button.dataset.id = toy.id; // Set toy ID as a data attribute
      button.textContent = "Like ❤️";

      card.appendChild(h2);
      card.appendChild(img);
      card.appendChild(p);
      card.appendChild(button);

      return card;
  }
});