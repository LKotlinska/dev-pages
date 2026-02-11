document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".formContainerFilter form");
  const accordionItems = document.querySelectorAll(".accordion-item");

  // Prevent form submission and filter instead in the case that a user clicks enter key in form
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    filterProfiles();
  });

  form.addEventListener("change", filterProfiles);
  form.addEventListener("input", filterProfiles);

  function getFieldText(container, label) {
    const strongs = container.querySelectorAll("strong");
    for (const strong of strongs) {
      if (strong.textContent.trim().startsWith(label)) {
        // If the strong is inside a <p>, return that <p>'s full text
        const parentP = strong.closest("p");
        if (parentP) {
          return parentP.textContent.toLowerCase();
        }
        // If the strong is a standalone element (e.g. strong.card-title),
        // grab the next sibling <p>
        let next = strong.nextElementSibling;
        if (next && next.tagName === "P") {
          return next.textContent.toLowerCase();
        }
      }
    }
    return "";
  }

  function filterProfiles() {
    const minYears =
      parseInt(document.getElementById("yearsExperienceFilter").value) || 0;
    const selectedLanguages = Array.from(
      document.querySelectorAll('input[name="languagesFilter"]:checked'),
    ).map((cb) => cb.value);
    const selectedFrameworks = Array.from(
      document.querySelectorAll(
        'input[name="frameworksAndLibrariesFilter"]:checked',
      ),
    ).map((cb) => cb.value);
    const selectedPreferences = Array.from(
      document.querySelectorAll('input[name="preferences"]:checked'),
    ).map((cb) => cb.value);

    accordionItems.forEach((item) => {
      const button = item.querySelector(".accordion-button");
      const body = item.querySelector(".accordion-body");
      const buttonText = button.textContent;

      // Extract years experience from button text
      const yearsMatch = buttonText.match(/(\d+)\s+years Experience/);
      const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;

      // Extract preferences from button text (after the last |)
      const preferencesText = buttonText.split("|").pop().trim().toLowerCase();

      // Extract languages from accordion body (using the "Languages:" label)
      const languagesText = getFieldText(body, "Languages");

      // Extract frameworks from accordion body (using the "Frameworks" label)
      const frameworksText = getFieldText(body, "Frameworks");

      // Check if item matches filters
      let matches = true;

      // Years experience check
      if (minYears > 0 && years < minYears) {
        matches = false;
      }

      // Languages check (must have ALL selected languages)
      if (selectedLanguages.length > 0) {
        const hasAllLanguages = selectedLanguages.every((lang) =>
          languagesText.includes(lang.toLowerCase()),
        );
        if (!hasAllLanguages) matches = false;
      }

      // Frameworks check (must have at least ONE selected framework)
      if (selectedFrameworks.length > 0) {
        const hasAllFrameworks = selectedFrameworks.every((fw) =>
          frameworksText.includes(fw.toLowerCase()),
        );
        if (!hasAllFrameworks) matches = false;
      }

      // Preferences check (must have at least ONE selected preference)
      if (selectedPreferences.length > 0) {
        const hasAnyPref = selectedPreferences.some((pref) =>
          preferencesText.includes(pref.toLowerCase()),
        );
        if (!hasAnyPref) matches = false;
      }

      // Show or hide the item
      item.style.display = matches ? "" : "none";
    });

    // REMOVE classes from ALL items first - for border radius control and overriding bs styling
    accordionItems.forEach((item) => {
      item.classList.remove("first-visible", "last-visible");
    });

    // Update border radius class after filtration that styling stays consistent with accordion after hiding children
    const visibleItems = Array.from(accordionItems).filter(
      (item) => item.style.display !== "none",
    );

    // ADD classes only to first and last visible items - for border radius control and overriding bs styling
    if (visibleItems.length > 0) {
      visibleItems[0].classList.add("first-visible");
      visibleItems[visibleItems.length - 1].classList.add("last-visible");
    }

    // Show "no results" message if no items are visible
    const noResultsMessage = document.querySelector(".no-results-message");
    if (noResultsMessage) {
      noResultsMessage.style.display =
        visibleItems.length === 0 ? "block" : "none";
    }
  }

  // Run on page load to set initial border classes
  filterProfiles();

  document
    .getElementById("resetFilters")
    ?.addEventListener("click", function () {
      form.reset();
      filterProfiles();
    });
});
