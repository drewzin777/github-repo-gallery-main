// Select the div with a class of "overview" where profile info will appear
const overviewDiv = document.querySelector(".overview");
// Your GitHub username
const username = "drewzin777";
// Select the ul where repos will be displayed
const repoList = document.querySelector('.repo-list');
const reposSection = document.querySelector(".repos");
const repoDataSection = document.querySelector(".repo-data");
const backToRepoGalleryButton = document.querySelector('.back-to-repo-gallery-button');
const filterInput = document.querySelector('input[placeholder="Search by name"]');

// Async function to fetch GitHub profile
async function getGitHubProfile() {
    const url = `https://api.github.com/users/${username}`;

    try {
        const response = await fetch(url); // Fetch data from GitHub API
        const data = await response.json(); // Resolve the JSON response
        console.log(data); // See profile info in console
        displayUserInfo(data);
    } catch (error) {
        console.error("Error fetching GitHub profile:", error); // Error handling during fetch
    }
}

// Function to display fetched profile data
function displayUserInfo(data) {
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user-info");

    userInfoDiv.innerHTML = `
        <figure>
            <img alt="user avatar" src="${data.avatar_url}" />
        </figure>
        <div>
        <p><strong>Name:</strong> ${data.name ? data.name : 'No name available'}</p>
        <p><strong>Bio:</strong> ${data.bio ? data.bio : 'No bio available'}</p>
        <p><strong>Location:</strong> ${data.location ? data.location : 'No location available'}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>`;

    // Append the new div to the overview element
    overviewDiv.appendChild(userInfoDiv);

    // Call the function to fetch repos
    fetchRepos();
}

// Async function to fetch GitHub repos
async function fetchRepos() {
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

    try {
        const response = await fetch(apiUrl);

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const repos = await response.json(); // Return JSON response
        displayRepos(repos); // Call function to display repos

    } catch (error) {
        console.error('Failed to fetch repos:', error);
    }
}

// Function to display repo list
function displayRepos(repos) {
    //Show the filter input at the top of the function
    filterInput.classList.remove("hide");

    repoList.innerHTML = ''; // Clear previous repo list

    //Loop through the repos and create list items
    repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.classList.add('repo');

        const repoName = document.createElement('h3');
        repoName.textContent = repo.name;

        listItem.appendChild(repoName);
        repoList.appendChild(listItem);
    });
}

// Call the function to fetch profile info
getGitHubProfile();

// Add event listener for repo clicks
repoList.addEventListener("click", function (e) {
    // Check if the clicked element is an <h3> tag
    if (e.target.tagName === "H3") {
        const repoName = e.target.innerText;
        getRepoInfo(repoName);
        console.log(repoName);
    }
});

// Async function to get specific repo information
async function getRepoInfo(repoName) {
    try {
        const endpoint = `https://api.github.com/repos/${username}/${repoName}`;
        const response = await fetch(endpoint);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error fetching repo info: ${response.statusText}`);
        }

        // Resolve and save the JSON response
        const repoInfo = await response.json();

        // Fetch the languages used in the repo
        const fetchLanguages = await fetch(repoInfo.languages_url);

        // Save the JSON response for languages
        const languageData = await fetchLanguages.json();

        // Log the language data to the console
        console.log(languageData);

        // Create an empty array to store the languages
        const languages = [];

        // Loop through the languageData object and push keys into the array
        for (let language in languageData) {
            languages.push(language);
        }

        // Display the repo info along with languages
        displayRepoInfo(repoInfo, languages);

    } catch (error) {
        console.error('Error fetching repository information:', error);
    }
}

// Function to display repo info
function displayRepoInfo(repoInfo, languages) {
    repoDataSection.innerHTML = ''; // Clear previous content

    const repoDiv = document.createElement('div');
    repoDiv.classList.add('repo-details');

    repoDiv.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description ? repoInfo.description : 'No description available'}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.length ? languages.join(", ") : 'No languages available'}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;

    // Append the new div element to the "repo-data" section
    repoDataSection.appendChild(repoDiv);

    // Unhide the repo-data section and hide the repos section
    repoDataSection.classList.remove('hide');
    reposSection.classList.add('hide');

    //Unhide the "Back to repo gallery" button
    backToRepoGalleryButton.classList.remove('hide');
}

//Event listener for back to repo gallery button
backToRepoGalleryButton.addEventListener('click', function () {
    document.querySelector(".repos").classList.remove("hide");

    //Hide the section with individual repo data
    document.querySelector(".repo-data").classList.add("hide");

    //Hide the back to repo gallery button 
    backToRepoGalleryButton.classList.add("hide");
});

//Add event listener to filter Input
filterInput.addEventListener("input", function (e) {
    const searchValue = e.target.value;
    console.log(searchValue); // Log search value to make sure its captured

    //create a variable to select all repos
    const repos = document.querySelectorAll(".repo");

    //convert the search to lowercase
    const lowerCaseSearchValue = searchValue.toLowerCase();

    //Loop through each repo
    repos.forEach(repo => {
        //convert the innerTest of each repo to lowercase
        const repoText = repo.querySelector("h3").innerText.toLowerCase();

        //Check if repo containse the search value
        if (repoText.includes(lowerCaseSearchValue)) {
            repo.style.display = "block";
        } else {
            repo.style.display = "none"; //Hide repo if it doesn't match
        }
    });
});
