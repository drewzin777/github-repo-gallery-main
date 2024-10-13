//Select the div with a class of "overview" where profile info will appear
const overviewDiv = document.querySelector(".overview"); 
//Your GitHub username
const username ="drewzin777"; 
//Select the ul where repos will be displayed
const repoList = document.querySelector('.repo-list');

async function getGitHubProfile() {
    const url = `https://api.github.com/users/${username}`

    try {
        const response = await fetch(url); //Fetch data from GitHub API
        const data = await response.json(); //Resolve the json response
        console.log(data);         //see profile info
        displayUserInfo(data);
    } catch (error) {
        console.error("Error fetching GitHub profile:", error);  //error handling during fetch
    }
}

//Function to display fetched data
function displayUserInfo(data) {
    const userInfoDiv = document.createElement("div");
    userInfoDiv.classList.add("user-info"); 

    userInfoDiv.innerHTML = `
        <figure>
            <img alt="user avatar" src="${data.avatar_url}" />
        </figure>
        <div>
        <p><strong>Name:</strong> ${data.name ? data.name :'No name available'}</p>
        <p><strong>Bio:</strong> ${data.bio ? data.bio : 'No bio available'}</p>
        <p><strong>Location:</strong> ${data.location ? data.location : 'No location available'}</p>
        <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
        </div>`;

        //Append the new div to the overview element
        overviewDiv.appendChild(userInfoDiv); 

//call the funciton to fetch repos 
fetchRepos(); 
}

//Async function to fetch Github repos
async function fetchRepos() {
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

    try {
        const response = await fetch(apiUrl); 

        //Check if response is ok
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const repos = await response.json(); //Return json response
        displayRepos(repos);        //Call functions to display repos

    } catch (error) {
        console.error('Failed to fetch repos:', error);
    }
}

//Function to desplay repo info
function displayRepos(repos) {
    repoList.innerHTML = '';  //Clear previous list

    repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.classList.add('repo');

        const repoName = document.createElement('h3');
        repoName.textContent = repo.name;

        listItem.appendChild(repoName);
        repoList.appendChild(listItem);
    });
}
 //Call the function to fetech profile info
 getGitHubProfile();