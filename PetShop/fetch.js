const apiUrl = "api.json";

// Updated fetchDataAndCreateCards function to filter by type
async function fetchDataAndCreateCards() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Get the container element
    const cardContainer = document.getElementById("card-container");

    // Get the filter links
    const filterAll = document.getElementById("filter-all");
    const filterDogs = document.getElementById("filter-dogs");
    const filterCats = document.getElementById("filter-cats");
    const filterBird = document.getElementById("filter-bird");
    const filterRodent = document.getElementById("filter-rodent");
    const filterFish = document.getElementById("filter-fish");

    const filterAccessories = document.getElementById("filter-accessories");

    // Function to filter cards based on type
    function filterCardsByType(type) {
      // Clear existing cards
      cardContainer.innerHTML = "";

      // Filter and create cards based on the selected type
      data
        .filter((item) => type === "All" || item.type === type)
        .forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";
          console.log(item);
          const img = document.createElement("img");
          img.src = item.img || "../images/placeholder.png"; // Use a placeholder image if imageUrl is not present
          img.alt = "...";
          img.className = "card-img-top";

          const cardBody = document.createElement("div");
          cardBody.className = "card-body";

          const title = document.createElement("h5");
          title.className = "card-title";
          title.textContent = item.name || "No Title"; // Use a default title if not present

          const text = document.createElement("p");
          text.className = "card-text";
          text.textContent = item.description || "No Description";

          const link = document.createElement("a");
          link.href = item.url || "#";
          link.className = "card-btn";
          link.textContent = "View More";

          // Append elements to the card
          cardBody.appendChild(title);
          cardBody.appendChild(text);
          cardBody.appendChild(link);

          card.appendChild(img);
          card.appendChild(cardBody);

          // Append the card to the container
          cardContainer.appendChild(card);
        });
    }

    function clearFilters(filter, name) {
      const filters = [
        filterAll,
        filterDogs,
        filterCats,
        filterBird,
        filterRodent,
        filterFish,
        filterAccessories,
      ];

      filters.forEach((f) => (f.className = ""));

      filter.className = "active";
      filterCardsByType(name);
    }

    filterAll.addEventListener("click", () => clearFilters(filterAll, "All"));
    filterDogs.addEventListener("click", () => clearFilters(filterDogs, "dog"));
    filterCats.addEventListener("click", () => clearFilters(filterCats, "cat"));
    filterBird.addEventListener("click", () =>
      clearFilters(filterBird, "bird")
    );
    filterRodent.addEventListener("click", () =>
      clearFilters(filterRodent, "rodent")
    );
    filterFish.addEventListener("click", () =>
      clearFilters(filterFish, "fish")
    );
    filterAccessories.addEventListener("click", () =>
      clearFilters(filterAccessories, "accessories")
    );

    filterCardsByType("All");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchDataAndCreateCards();
