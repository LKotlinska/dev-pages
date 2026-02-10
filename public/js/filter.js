document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.formContainerFilter form');
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Prevent form submission and filter instead in the case that a user clicks enter key in form
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        filterProfiles();
    });
    
    form.addEventListener('change', filterProfiles);
    form.addEventListener('input', filterProfiles);
    
    function filterProfiles() {
        const minYears = parseInt(document.getElementById('yearsExperienceFilter').value) || 0;
        const selectedLanguages = Array.from(document.querySelectorAll('input[name="languagesFilter"]:checked'))
            .map(cb => cb.value);
        const selectedFrameworks = Array.from(document.querySelectorAll('input[name="frameworksAndLibrariesFilter"]:checked'))
            .map(cb => cb.value);
        const selectedPreferences = Array.from(document.querySelectorAll('input[name="preferences"]:checked'))
            .map(cb => cb.value);
        
        accordionItems.forEach(item => {
            const button = item.querySelector('.accordion-button');
            const body = item.querySelector('.accordion-body');
            const buttonText = button.textContent;
            
            // Extract years experience from button text - using regex because the data is being pulled from the button on the page
            const yearsMatch = buttonText.match(/(\d+)\s+years Experience/);
            const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
            
            // Extract languages from button text (after the last |) - using regex because the data is being pulled from the button on the page
            const languagesText = buttonText.split('|').pop().trim().toLowerCase();
            
            // Extract frameworks from accordion body
            const frameworksText = body.querySelector('p:nth-of-type(2)')?.textContent.toLowerCase() || '';
            
            // Extract preferences from accordion body
            const preferencesText = body.querySelector('p:nth-of-type(3)')?.textContent.toLowerCase() || '';
            
            // Check if item matches filters
            let matches = true;
            
            // Years experience check
            if (minYears > 0 && years < minYears) {
                matches = false;
            }
            
            // Languages check (must have ALL selected languages)
            if (selectedLanguages.length > 0) {
                const hasAllLanguages = selectedLanguages.every(lang => 
                    languagesText.includes(lang.toLowerCase())
                );
                if (!hasAllLanguages) matches = false;
            }
            
            // Frameworks check (must have at least ONE selected framework)
            if (selectedFrameworks.length > 0) {
                const hasAnyFramework = selectedFrameworks.some(fw => 
                    frameworksText.includes(fw.toLowerCase())
                );
                if (!hasAnyFramework) matches = false;
            }
            
            // Preferences check (must have at least ONE selected preference)
            if (selectedPreferences.length > 0) {
                const prefMap = {
                    'frontendFilter': 'frontend',
                    'backendFilter': 'backend',
                    'full-stackFilter': 'full-stack'
                };
                const hasAnyPref = selectedPreferences.some(pref => 
                    preferencesText.includes(prefMap[pref])
                );
                if (!hasAnyPref) matches = false;
            }
            
            // Show or hide the item
            item.style.display = matches ? '' : 'none';
        });

        // REMOVE classes from ALL items first - for border radius control and overriding bs styling
        accordionItems.forEach(item => {
            item.classList.remove('first-visible', 'last-visible');
        });

        // Update border radius class after filtration that styling stays consistent with accordion after hiding children
        const visibleItems = Array.from(accordionItems).filter(item => item.style.display !== 'none');

        // ADD classes only to first and last visible items - for border radius control and overriding bs styling
        if (visibleItems.length > 0) {
            visibleItems[0].classList.add('first-visible');
            visibleItems[visibleItems.length - 1].classList.add('last-visible');
        }

        // Show "no results" message if no items are visible
        const noResultsMessage = document.querySelector('.no-results-message');
        if (noResultsMessage) {
            noResultsMessage.style.display = visibleItems.length === 0 ? 'block' : 'none';
        }
    }
    
    // Run on page load to set initial border classes
    filterProfiles();
    
    document.getElementById('resetFilters')?.addEventListener('click', function() {
        form.reset();
        filterProfiles();
    });
});