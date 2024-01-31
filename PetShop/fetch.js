const apiUrl = "http://localhost:3000/data";

// Updated fetchDataAndCreateCards function to filter by type
async function fetchDataAndCreateCards() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);

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
          card.className = `card `;
          console.log(item);
          const img = document.createElement("img");
          img.src = item.img || "../images/placeholder.png"; // Use a placeholder image if imageUrl is not present
          img.alt = "...";
          img.className = "card-img-top";

          const cardBody = document.createElement("div");
          cardBody.className = `card-body`;

          const title = document.createElement("h5");
          title.className = "card-title";
          title.textContent = item.name || "No Title"; // Use a default title if not present

          const text = document.createElement("p");
          text.className = "card-text";
          text.textContent = item.description || "No Description";

          const link = document.createElement("button");
          link.addEventListener("click", () => deleteItem(item._id)); // Assuming there's an 'id' property in your data
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
    async function deleteItem(itemId) {
      try {
        // Make a DELETE request to the server's delete endpoint
        const response = await fetch(`http://localhost:3000/data/${itemId}`, {
          method: "DELETE",
        });

        // Check if the deletion was successful
        if (response.ok) {
          // Refresh data and recreate cards
          await fetchDataAndCreateCards();

          console.log(`Item with ID ${itemId} deleted successfully.`);
        } else {
          // Handle the case where the deletion was not successful
          console.error("Failed to delete item:", response.statusText);
        }
      } catch (error) {
        // Handle any network or unexpected errors
        console.error("Error deleting item:", error.message);
      }
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

// Add this function to your client-side JavaScript code
async function submitForm() {
  try {
    // Get form inputs
    const productName = document.getElementById("productName").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const description = document.getElementById("description").value;
    const itemType = document.getElementById("itemType").value;

    // Create a data object with form values
    const formData = {
      name: productName,
      img: imageUrl,
      description: description,
      type: itemType,
    };

    // Make a POST request to the server's create endpoint
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Check if the POST request was successful
    if (response.ok) {
      // Refresh data and recreate cards
      await fetchDataAndCreateCards();
      console.log("Item added successfully.");
    } else {
      // Handle the case where the POST request was not successful
      console.error("Failed to add item:", response.statusText);
    }
  } catch (error) {
    // Handle any network or unexpected errors
    console.error("Error adding item:", error.message);
  }
}

function toggleAddItem() {
  const toggleBtn = document.getElementById("toggleCreate");
  console.log("asdasdasd");
  const addContainer = document.querySelector(".createItem");
  if (addContainer.style.display !== "flex") {
    addContainer.style.display = "flex";
    toggleBtn.innerHTML = "Add More";
  } else {
    addContainer.style.display = "none";
    toggleBtn.innerHTML = "Close";
  }
}
