const defaultUsers = [

    {
        id: 1,
        name: "Andi Pratama",
        username: "andi",
        email: "andi@gmail.com",
        password: "123456789"
    },

    {
        id: 2,
        name: "Budi Santoso",
        username: "budi",
        email: "budi@gmail.com",
        password: "123456789"
    },

    {
        id: 3,
        name: "Citra Lestari",
        username: "citra",
        email: "citra@gmail.com",
        password: "123456789"
    },

    {
        id: 4,
        name: "Dina Amelia",
        username: "dina",
        email: "dina@gmail.com",
        password: "123456789"
    },

    {
        id: 5,
        name: "Eko Saputra",
        username: "eko",
        email: "eko@gmail.com",
        password: "123456789"
    },

    {
        id: 6,
        name: "Fajar Ramadhan",
        username: "fajar",
        email: "fajar@gmail.com",
        password: "123456789"
    }

];


function getUsers() {

    const users =
        localStorage.getItem("users");

    if (users) {
        return JSON.parse(users);
    }

    localStorage.setItem(
        "users",
        JSON.stringify(defaultUsers)
    );

    return defaultUsers;
}

function saveUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    const currentUser =
        localStorage.getItem("currentUser");

    if (!currentUser) {
        return null;
    }

    return JSON.parse(currentUser);
}

function getFriends() {

    return JSON.parse(
        localStorage.getItem("friends") || "[]"
    );

}


function saveFriends(friends) {

    localStorage.setItem(
        "friends",
        JSON.stringify(friends)
    );

}


function getInitials(name) {

    const words =
        name.trim().split(" ");

    if (words.length >= 2) {

        return (
            words[0].charAt(0) +
            words[1].charAt(0)
        ).toUpperCase();

    }

    return name
        .charAt(0)
        .toUpperCase();

}

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("loginUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const users =
                getUsers();


            const user =
                users.find(function(item) {

                    return (
                        item.username === username &&
                        item.password === password
                    );

                });


            if (!user) {

                alert(
                    "Username atau password salah!"
                );

                return;
            }


            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );


            alert("Login berhasil!");


            window.location.href =
                "dashboard.html";

        }
    );

}


const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "registerConfirmPassword"
                    )
                    .value;


            if (
                password !== confirmPassword
            ) {

                alert(
                    "Password dan konfirmasi password tidak sama!"
                );

                return;
            }


            const users =
                getUsers();


            const usernameExists =
                users.some(function(user) {

                    return (
                        user.username.toLowerCase() ===
                        username.toLowerCase()
                    );

                });


            if (usernameExists) {

                alert(
                    "Username sudah digunakan!"
                );

                return;
            }


            const newUser = {

                id: Date.now(),

                name: name,

                username: username,

                email: email,

                password: password

            };


            users.push(newUser);

            saveUsers(users);


            alert(
                "Registrasi berhasil! Silakan login."
            );


            window.location.href =
                "login.html";

        }
    );

}


function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}


function checkLogin() {

    const currentUser =
        getCurrentUser();


    const currentPage =
        window.location.pathname;


    const authPage =
        currentPage.includes("login.html") ||
        currentPage.includes("register.html");


    if (
        !currentUser &&
        !authPage
    ) {

        window.location.href =
            "login.html";

    }

}


function UsersDirectory(
    searchText = ""
) {

    const container =
        document.getElementById(
            "usersList"
        );


    if (!container) {
        return;
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const users =
        getUsers();


    const friends =
        getFriends();


    const filteredUsers =
        users.filter(function(user) {


            if (
                user.id === currentUser.id
            ) {

                return false;

            }


            const text =
                searchText
                    .toLowerCase()
                    .trim();


            return (

                user.name
                    .toLowerCase()
                    .includes(text)

                ||

                user.username
                    .toLowerCase()
                    .includes(text)

            );

        });


    container.innerHTML = "";


    if (
        filteredUsers.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No users found
                </h3>

                <p>
                    Try another name
                    or username.
                </p>

            </div>

        `;

        return;
    }


    filteredUsers.forEach(
        function(user) {

            const isFriend =
                friends.some(
                    function(friend) {

                        return (

                            (
                                friend.user1 ===
                                currentUser.id

                                &&

                                friend.user2 ===
                                user.id
                            )

                            ||

                            (
                                friend.user1 ===
                                user.id

                                &&

                                friend.user2 ===
                                currentUser.id
                            )

                        );

                    }
                );


            let button = "";


            if (isFriend) {

                button = `

                    <button
                        class="card-btn remove-btn"
                        onclick="removeFriend(${user.id})"
                    >

                        Remove Friend

                    </button>

                `;

            }

            else {

                button = `

                    <button
                        class="card-btn add-btn"
                        onclick="addFriend(${user.id})"
                    >

                        + Add Friend

                    </button>

                `;

            }


            container.innerHTML += `

                <div class="user-card">

                    <div class="avatar">

                        ${getInitials(
                            user.name
                        )}

                    </div>


                    <h3>
                        ${user.name}
                    </h3>


                    <p class="username">
                        @${user.username}
                    </p>


                    <p class="status">
                        ● Online
                    </p>


                    ${button}

                </div>

            `;

        }
    );

}


function searchUsers() {

    const searchInput =
        document.getElementById(
            "userSearch"
        );


    if (!searchInput) {
        return;
    }


    UsersDirectory(
        searchInput.value
    );

}

function addFriend(userId) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const friends =
        getFriends();



    const alreadyFriend =
        friends.some(
            function(friend) {

                return (

                    (
                        friend.user1 ===
                        currentUser.id

                        &&

                        friend.user2 ===
                        userId
                    )

                    ||

                    (
                        friend.user1 ===
                        userId

                        &&

                        friend.user2 ===
                        currentUser.id
                    )

                );

            }
        );


    if (alreadyFriend) {

        alert(
            "User sudah menjadi teman."
        );

        return;

    }


    friends.push({

        id: Date.now(),

        user1: currentUser.id,

        user2: userId

    });


    saveFriends(friends);


    const users =
        getUsers();


    const friendUser =
        users.find(
            function(user) {

                return (
                    user.id === userId
                );

            }
        );


    if (friendUser) {

        alert(
            friendUser.name +
            " berhasil ditambahkan sebagai teman!"
        );

    }


    UsersDirectory();

}


function displayFriends() {

    const container =
        document.getElementById(
            "friendsList"
        );


    if (!container) {
        return;
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    const users =
        getUsers();


    const friends =
        getFriends();

    const friendIds = [];


    friends.forEach(
        function(friend) {


            if (
                friend.user1 ===
                currentUser.id
            ) {

                friendIds.push(
                    friend.user2
                );

            }


            else if (
                friend.user2 ===
                currentUser.id
            ) {

                friendIds.push(
                    friend.user1
                );

            }

        }
    );

    const friendUsers =
        users.filter(
            function(user) {

                return friendIds.includes(
                    user.id
                );

            }
        );


    container.innerHTML = "";

    if (
        friendUsers.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Friends Yet
                </h3>

                <p>
                    Go to User Directory
                    and add some friends.
                </p>

            </div>

        `;

        return;

    }

    friendUsers.forEach(
        function(user) {


            container.innerHTML += `

                <div class="user-card">

                    <div class="avatar">

                        ${getInitials(
                            user.name
                        )}

                    </div>


                    <h3>
                        ${user.name}
                    </h3>


                    <p class="username">
                        @${user.username}
                    </p>


                    <p class="status">
                        ● Online
                    </p>


                    <button
                        class="card-btn remove-btn"
                        onclick="removeFriend(${user.id})"
                    >

                        Remove Friend

                    </button>

                </div>

            `;

        }
    );

}



function removeFriend(userId) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    let friends =
        getFriends();

    friends =
        friends.filter(
            function(friend) {


                const relationship =
                    (

                        friend.user1 ===
                        currentUser.id

                        &&

                        friend.user2 ===
                        userId

                    )

                    ||

                    (

                        friend.user1 ===
                        userId

                        &&

                        friend.user2 ===
                        currentUser.id

                    );


                return !relationship;

            }
        );


    saveFriends(friends);


    alert(
        "Friend removed."
    );

    UsersDirectory();

    displayFriends();

}
/* =====================================================
   ACTIVE NAVBAR
===================================================== */

function setActiveNavbar() {

    const navLinks =
        document.querySelectorAll(
            ".navbar nav a"
        );


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    navLinks.forEach(
        function(link) {

            const linkPage =
                link
                    .getAttribute("href")
                    .split("/")
                    .pop();
            if (
                linkPage === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }
            else {

                link.classList.remove(
                    "active"
                );

            }

        }
    );

}

/* =====================================================
   START APPLICATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkLogin();

        setActiveNavbar();

        UsersDirectory();

        displayFriends();

    }
);


/* HOME, PROFILE & CREATE POST */

const oldPosts = [

    {
        user: "rido90",
        img: "images/postingan1.png",
        caption: "post photo",
        likes: 100
    },

    {
        user: "tm_giska",
        img: "images/postingan2.png",
        caption: "Daily Quote",
        likes: 40
    },

    {
        user: "eko2006",
        img: "images/postingan3.png",
        caption: "Life",
        likes: 100
    }

];

function showPosts() {

    const feed =
        document.getElementById("feed");

    if (!feed) {
        return;
    }

    const newPosts =
        JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

    const allPosts =
        newPosts.concat(oldPosts);

    feed.innerHTML = "";

    allPosts.forEach(
        function(post) {

            feed.innerHTML += `

                <div class="post-card">

                    <div class="post-header">
                        <span class="post-username">${post.user}</span>
                    </div>

                    <img src="${post.img}" alt="Postingan" class="post-image">

                    <div class="post-actions">
                        <button class="post-action-btn" onclick="likePost(this)">Like</button>
                        <a href="comments.html" class="post-action-btn">Comment</a>
                    </div>

                    <div class="post-likes">${post.likes} likes</div>

                    <div class="post-caption-box">
                        <span class="caption-username">${post.user}</span>
                        ${post.caption}
                    </div>

                </div>

            `;

        }
    );

}

function likePost(button) {

    button.classList.toggle("liked");

}

function showProfile() {

    const box =
        document.getElementById("profileInfo");

    const currentUser =
        getCurrentUser();

    if (!box || !currentUser) {
        return;
    }

    box.innerHTML = `

        <div class="avatar profile-avatar">
            ${getInitials(currentUser.name)}
        </div>

        <h3>${currentUser.name}</h3>

        <p class="username">@${currentUser.username}</p>

    `;

}

let selectedImage = "";

function previewImage(input) {

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            selectedImage =
                event.target.result;

            const preview =
                document.getElementById("imagePreview");

            preview.src = selectedImage;

            preview.style.display = "block";

        };

    reader.readAsDataURL(
        input.files[0]
    );

}

function sharePost() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }

    if (selectedImage === "") {

        alert("Pilih foto terlebih dahulu!");

        return;
    }

    const posts =
        JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

    posts.unshift({

        user: currentUser.username,

        img: selectedImage,

        caption:
            document
                .getElementById("caption")
                .value,

        likes: 0

    });

    try {

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );

        window.location.href =
            "index.html";

    }

    catch (error) {

        alert("Foto terlalu besar, coba foto yang lebih kecil.");

    }

}

function logoToHome() {

    const logos =
        document.querySelectorAll(
            ".navbar .logo"
        );

    logos.forEach(
        function(logo) {

            logo.addEventListener(
                "click",
                function() {

                    window.location.href =
                        "index.html";

                }
            );

        }
    );

}

function addNavbarLinks() {

    const nav =
        document.querySelector(
            ".navbar nav"
        );

    if (!nav) {
        return;
    }

    const hasCreate =
        nav.querySelector(
            'a[href="create.html"]'
        );

    const hasProfile =
        nav.querySelector(
            'a[href="profile.html"]'
        );

    if (!hasCreate) {

        nav.innerHTML +=
            '<a href="create.html">Create</a>';

    }

    if (!hasProfile) {

        nav.innerHTML +=
            '<a href="profile.html">Profile</a>';

    }

}

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPosts();

        showProfile();

        logoToHome();

        addNavbarLinks();

        setActiveNavbar();

    }
);
