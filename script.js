
// Open the modal and load paper data
function openModal(paperId) {
    // 使用后端完整 URL 来请求数据
    fetch(`http://8.215.43.250:5000/paper_info/${paperId}`)
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
            document.getElementById('paperPreviewImage').src = `http://8.215.43.250:5000/images/${data.preview_image}`;

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
            data.features.forEach(feature => {
                const featureCategory = featureCategoryMap[feature];  // Get the category of the feature

                if (featureCategory && !displayedCategories.includes(featureCategory)) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('feature-category');

                    const categoryTitle = document.createElement('h4');
                    categoryTitle.textContent = featureCategory;  // Display the category

                    categoryDiv.appendChild(categoryTitle);
                    featuresContainer.appendChild(categoryDiv);

                    displayedCategories.push(featureCategory);

                    featuresContainer.appendChild(document.createElement('br'));  // Empty line between category and features
                }

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

            const modal = document.getElementById('paperModal');
            modal.style.display = 'block'; // Ensure it is visible
            setTimeout(() => {
                modal.classList.add('show');
            }, 50);
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
