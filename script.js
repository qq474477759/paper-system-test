
// Open the modal and load paper data
function openModal(paperId) {
    // Make a request to get the paper data
    fetch(`/paper_info/${paperId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            return response.json();
        })
        .then(data => {
            // Populate modal with data (strictly corresponding to the HTML element IDs)
            document.getElementById('paperTitle').innerText = data.title;
            document.getElementById('paperYear').innerText = data.year || 'Unknown Year';
            document.getElementById('paperCategory').innerText = data.category || 'Unknown Category';
            document.getElementById('paperPreviewImage').src = `/images/${data.preview_image}`;

            // New fields: Journal/Conference Name and DOI
            document.getElementById('journalConferenceName').innerText = data.journal_conference_name || 'Unknown';
            const doiLink = document.getElementById('doiLink');
            if (data.doi) {
                doiLink.href = `https://doi.org/${data.doi}`;
                document.getElementById('doiLinkText').innerText = data.doi;
            } else {
                doiLink.href = '#';
                document.getElementById('doiLinkText').innerText = 'N/A';
            }

            // Features section
            const featuresContainer = document.getElementById('featuresContainer');
            featuresContainer.innerHTML = '';  // Clear previous content

            let displayedCategories = [];
// Iterate through features and group them by category
data.features.forEach(feature => {
    const featureCategory = featureCategoryMap[feature];  // Get the category of the feature

    // If we haven't displayed this category yet, display it
    if (featureCategory && !displayedCategories.includes(featureCategory)) {
        // Create the category header (only once)
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('feature-category');

        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = featureCategory;  // Display the category

        categoryDiv.appendChild(categoryTitle);
        featuresContainer.appendChild(categoryDiv);

        // Add the category to the list of displayed categories
        displayedCategories.push(featureCategory);

        // Add a line break (empty space) after the category title (before listing features)
        featuresContainer.appendChild(document.createElement('br'));  // Empty line between category and features
    }

    // Now add the feature under the respective category
    const featureRow = document.createElement('div');
    featureRow.classList.add('feature-row');

    const label = document.createElement('div');
    label.classList.add('feature-label');
    label.textContent = feature;  // Display the feature

    const value = document.createElement('div');
    value.classList.add('feature-value');
    featureRow.appendChild(label);

    featuresContainer.appendChild(featureRow);
});


            // Show the modal and trigger the animation
            const modal = document.getElementById('paperModal');
            modal.style.display = 'block'; // Ensure it is visible
            // Delay triggering the animation to ensure DOM updates
            setTimeout(() => {
                modal.classList.add('show');
            }, 50);
            // Prevent background scrolling
            document.body.classList.add('modal-open');
        })
        .catch(error => {
            console.error('Failed to load paper:', error);
            alert('Unable to load paper details, please try again later'); // Error message
        });
}


// Close the modal
function closeModal() {
    const modal = document.getElementById('paperModal');
    modal.classList.remove('show'); // Remove the "show" class to trigger exit animation
    // Hide the modal after the animation ends
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Restore scrolling
    }, 400); // Matches CSS transition time
}

// Close the modal by clicking outside the modal
document.getElementById('paperModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('paperModal')) {
        closeModal();
    }
});

// Close the modal by pressing the ESC key
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('paperModal');
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});
