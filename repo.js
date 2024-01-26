const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
let currentPage = 1;
let totalPage;


let form = document.getElementById("Reposeach");

form.addEventListener('submit', function (e) {
    e.preventDefault();
  
    let repoName = document.getElementById('repo').value.trim();
    if (repoName) {
        searchRepository(repoName);
    } else {
        console.error('Repository name is empty.');
    }
});

function showRepoLoader() {
    document.getElementById("repocard").innerHTML = '<div class="loader">Loading repositories...</div>';
}

function hideRepoLoader() {
    document.getElementById("repocard").innerHTML = '';
}

function fetchRepositories(username, page = 1, perPage = 10) {
    showRepoLoader();

    fetch(`https://api.github.com/users/${username}/repos?public&per_page=${perPage}&page=${page}`)
        .then((result) => result.json())
        .then((repoData) => {
            hideRepoLoader();

            const repoCards = repoData.map((repo) => {
                const topics = repo.topics.map(topic => `<span class="topic">${topic}</span>`);
                const description = repo.description ?? '';
                return `
                    <div class="repocard inter">
                        <p class="reponame">${repo.name}</p>
                        <p class="repodiscription">${description}</p>
                        <div>${topics}</div>
                    </div>`;
            }).join('');

            document.getElementById("repocard").innerHTML = repoCards;
        })
        .catch((error) => {
            hideRepoLoader();
            console.error('Error fetching repositories:', error);
        });
}


function fetchUserInfo(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then((result) => result.json())
        .then((userData) => {
            const bio = userData.bio ?? '';
            const userInfo = `
                <div class="row d-flex justify-content-center userdata inter ">
                    <div class="col col-md-3 userprofile">
                        <div>
                            <img class="d-flex justify-content-center userimg" src="${userData.avatar_url}" alt="Image" />
                        </div>
                    </div>
                    <div class="col col-md-7 userinfo inter">
                        <div class="row">
                            <p class="username">${userData.login}</p>
                        </div>
                        <div class="row">
                            <p>${bio}</p>
                        </div>
                        <div class="row">
                            <p>${userData.html_url}</p>
                        </div>
                        <div class="row">
                            <p>${userData.public_repos} Public Repositories</p>
                        </div>
                    </div>
                </div>`;

            totalPage = Math.ceil(userData.public_repos / 10); // Assuming 10 repositories per page
            updatePageNumber();
            document.getElementById("userInfoContainer").innerHTML = userInfo;
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
}


function searchRepository(repoName)
{
    fetch(`https://api.github.com/users/${username}/repos?public`)
    .then((result) => result.json())
        .then((repoData) => {
            hideRepoLoader();

            const filteredRepoData = repoData.filter(repo => {
               
                return repo.name.toLowerCase().includes(repoName.toLowerCase());
            });

            const repoCards = filteredRepoData.map(repo => {
                const topics = repo.topics.map(topic => `<span class="topic">${topic}</span>`);
                const description = repo.description ?? '';

                return `
                    <div class="repocard inter">
                        <p class="reponame">${repo.name}</p>
                        <p class="repodescription">${description}</p>
                        <div>${topics}</div>
                    </div>`;
            }).join('');

            document.getElementById("repocard").innerHTML = repoCards;
        })
    .catch((error) => {
        console.error('Error fetching user data:', error);
    });
}

function handlePaginationButtonClick(direction) {
    if (direction === 'next' && currentPage < totalPage) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    }

    fetchRepositories(username, currentPage);
    updatePageNumber();
}

function updatePageNumber() {
    const repopagenumber = `<p class='numbering'>${currentPage} / ${totalPage}</p>`;
    document.getElementById("repopagenumber").innerHTML = repopagenumber;
}

// Usage
fetchRepositories(username);
fetchUserInfo(username);
