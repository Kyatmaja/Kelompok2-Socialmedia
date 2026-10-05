const defaultUsers = [
    { id: 1, name: "Andi Pratama", username: "andi", email: "andi@gmail.com", password: "123456789" },
    { id: 2, name: "Budi Santoso", username: "budi", email: "budi@gmail.com", password: "123456789" },
    { id: 3, name: "Citra Lestari", username: "citra", email: "citra@gmail.com", password: "123456789" },
    { id: 4, name: "Dina Amelia", username: "dina", email: "dina@gmail.com", password: "123456789" },
    { id: 5, name: "Eko Saputra", username: "eko", email: "eko@gmail.com", password: "123456789" },
    { id: 6, name: "Fajar Ramadhan", username: "fajar", email: "fajar@gmail.com", password: "123456789" }
];

const oldPosts = [
    { user: "rido90", img: "images/postingan1.png", caption: "post photo", likes: 100 },
    { user: "tm_giska", img: "images/postingan2.png", caption: "Daily Quote", likes: 40 },
    { user: "eko2006", img: "images/postingan3.png", caption: "Life", likes: 100 }
];


function getUsers() {
    const users = localStorage.getItem("users");
    if (users) {
        return JSON.parse(users);
    }
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
    const currentUser = localStorage.getItem("currentUser");
    return currentUser ? JSON.parse(currentUser) : null;
}

function getFriends() {
    return JSON.parse(localStorage.getItem("friends") || "[]");
}

function saveFriends(friends) {
    localStorage.setItem("friends", JSON.stringify(friends));
}

function getRequests() {
    return JSON.parse(localStorage.getItem("friendRequests") || "[]");
}

function saveRequests(requests) {
    localStorage.setItem("friendRequests", JSON.stringify(requests));
}

function getNotifications() {
    return JSON.parse(localStorage.getItem("notifications") || "[]");
}

function saveNotifications(notifications) {
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

function addNotification(userId, message, type) {
    const notifications = getNotifications();
    const newNotification = {
        id: Date.now(),
        userId: userId,
        message: message,
        type: type,
        isRead: false,
        createdAt: new Date().toLocaleString()
    };
    notifications.unshift(newNotification);
    saveNotifications(notifications);
}

function getInitials(name) {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
        return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
}

function handleLogin(event) {
    if (event) event.preventDefault();

    const usernameInput = document.getElementById("loginUsername").value.trim();
    const passwordInput = document.getElementById("loginPassword").value;

    const registeredUsers = getUsers();
    const foundUser = registeredUsers.find(
        (user) => user.username === usernameInput && user.password === passwordInput
    );

    if (foundUser) {
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        alert("Login berhasil!");
        window.location.href = "index.html";
    } else {
        alert("Username atau password salah! Silakan periksa kembali.");
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

function checkLogin() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname;
    const authPage = currentPage.includes("login.html") || currentPage.includes("register.html");

    if (!currentUser && !authPage) {
        window.location.href = "login.html";
    }
}

function handleGlobalSearch() {
    const inputElem = document.getElementById("globalSearchInput");
    if (!inputElem) return;

    const keyword = inputElem.value.toLowerCase().trim();
    const filterElem = document.getElementById("searchFilter");
    const filter = filterElem ? filterElem.value : "all";

    const usersSection = document.getElementById("usersResultSection");
    const postsSection = document.getElementById("postsResultSection");

    if (filter === "users") {
        if (usersSection) usersSection.style.display = "block";
        if (postsSection) postsSection.style.display = "none";
    } else if (filter === "posts") {
        if (usersSection) usersSection.style.display = "none";
        if (postsSection) postsSection.style.display = "block";
    } else {
        if (usersSection) usersSection.style.display = "block";
        if (postsSection) postsSection.style.display = "block";
    }

    if (filter === "all" || filter === "users") {
        const users = getUsers();
        const currentUser = getCurrentUser();
        
        const filteredUsers = users.filter(user => {
            if (currentUser && user.id === currentUser.id) return false;
            return user.username.toLowerCase().includes(keyword) || 
                   (user.name && user.name.toLowerCase().includes(keyword));
        });

        const usersListContainer = document.getElementById("usersList");
        if (usersListContainer) {
            if (filteredUsers.length === 0) {
                usersListContainer.innerHTML = "<p>Tidak ada pengguna ditemukan.</p>";
            } else {
                usersListContainer.innerHTML = filteredUsers.map(user => `
                    <div class="user-card">
                        <div class="avatar">${getInitials(user.name || user.username)}</div>
                        <h3>${user.name || user.username}</h3>
                        <p class="username">@${user.username}</p>
                        <p class="status">● Online</p>
                        <button class="card-btn add-btn" onclick="sendFriendRequest(${user.id})">+ Add Friend</button>
                    </div>
                `).join("");
            }
        }
    }

    if (filter === "all" || filter === "posts") {
        const localPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        const allPosts = localPosts.concat(oldPosts);

        const filteredPosts = allPosts.filter(post => {
            const text = (post.caption || post.content || "").toLowerCase();
            const author = (post.user || post.author || "").toLowerCase();
            return text.includes(keyword) || author.includes(keyword);
        });

        const postsListContainer = document.getElementById("postsList");
        if (postsListContainer) {
            if (filteredPosts.length === 0) {
                postsListContainer.innerHTML = "<p>Tidak ada postingan ditemukan.</p>";
            } else {
                postsListContainer.innerHTML = filteredPosts.map(post => `
                    <div class="user-card search-box" style="margin-bottom: 10px; text-align: left;">
                        <h4>@${post.user || post.author || 'Anonim'}</h4>
                        <p style="margin: 8px 0;">${post.caption || post.content}</p>
                        ${post.img ? `<img src="${post.img}" style="max-width: 100%; border-radius: 8px; margin-bottom: 8px;">` : ''}
                        <small style="color: #888;">${post.likes || 0} likes</small>
                    </div>
                `).join("");
            }
        }
    }
}

function UsersDirectory(searchText = "") {
    const container = document.getElementById("usersList");
    if (!container || document.getElementById("globalSearchInput")) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const friends = getFriends();
    const requests = getRequests();

    const filteredUsers = users.filter(function(user) {
        if (user.id === currentUser.id) return false;
        const text = searchText.toLowerCase().trim();
        return user.name.toLowerCase().includes(text) || user.username.toLowerCase().includes(text);
    });

    container.innerHTML = "";

    if (filteredUsers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No users found</h3>
                <p>Try another name or username.</p>
            </div>
        `;
        return;
    }

    filteredUsers.forEach(function(user) {
        const isFriend = friends.some(f => (f.user1 === currentUser.id && f.user2 === user.id) || (f.user1 === user.id && f.user2 === currentUser.id));
        const requestSent = requests.some(r => r.from === currentUser.id && r.to === user.id);
        const requestReceived = requests.some(r => r.from === user.id && r.to === currentUser.id);

        let button = "";
        if (isFriend) {
            button = `<button class="card-btn remove-btn" onclick="removeFriend(${user.id})">Remove Friend</button>`;
        } else if (requestSent) {
            button = `<button class="card-btn request-sent-btn" disabled>Request Sent</button>`;
        } else if (requestReceived) {
            button = `<button class="card-btn add-btn" onclick="goToRequests()">Respond to Request</button>`;
        } else {
            button = `<button class="card-btn add-btn" onclick="sendFriendRequest(${user.id})">+ Add Friend</button>`;
        }

        container.innerHTML += `
            <div class="user-card">
                <div class="avatar">${getInitials(user.name)}</div>
                <h3>${user.name}</h3>
                <p class="username">@${user.username}</p>
                <p class="status">● Online</p>
                ${button}
            </div>
        `;
    });
}

function searchUsers() {
    const searchInput = document.getElementById("userSearch");
    if (searchInput) UsersDirectory(searchInput.value);
}

function sendFriendRequest(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const requests = getRequests();
    const friends = getFriends();

    const alreadyFriend = friends.some(f => (f.user1 === currentUser.id && f.user2 === userId) || (f.user1 === userId && f.user2 === currentUser.id));
    if (alreadyFriend) { alert("User sudah menjadi teman."); return; }

    const alreadySent = requests.some(r => r.from === currentUser.id && r.to === userId);
    if (alreadySent) { alert("Friend request sudah dikirim."); return; }

    const incomingRequest = requests.some(r => r.from === userId && r.to === currentUser.id);
    if (incomingRequest) { alert("User ini sudah mengirim friend request kepada kamu."); return; }

    requests.push({ id: Date.now(), from: currentUser.id, to: userId, createdAt: new Date().toLocaleString() });
    saveRequests(requests);

    const users = getUsers();
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
        addNotification(targetUser.id, currentUser.name + " sent you a friend request.", "friend_request");
        alert("Friend request sent to " + targetUser.name);
    }

    if (document.getElementById("globalSearchInput")) handleGlobalSearch();
    else UsersDirectory();

    updateRequestBadge();
    updateNotificationBadge();
}

function goToRequests() {
    window.location.href = "friend-requests.html";
}

function displayFriendRequests() {
    const container = document.getElementById("friendRequestsList");
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const requests = getRequests();
    const users = getUsers();
    const incomingRequests = requests.filter(r => r.to === currentUser.id);

    container.innerHTML = "";

    if (incomingRequests.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Friend Requests</h3>
                <p>You don't have any friend requests yet.</p>
            </div>
        `;
        return;
    }

    incomingRequests.forEach(function(request) {
        const sender = users.find(u => u.id === request.from);
        if (!sender) return;

        container.innerHTML += `
            <div class="request-card">
                <div class="avatar">${getInitials(sender.name)}</div>
                <div class="request-info">
                    <h3>${sender.name}</h3>
                    <p>@${sender.username}</p>
                    <small>Wants to be your friend</small>
                </div>
                <div class="request-actions">
                    <button class="accept-btn" onclick="acceptFriendRequest(${request.id})">Accept</button>
                    <button class="reject-btn" onclick="rejectFriendRequest(${request.id})">Reject</button>
                </div>
            </div>
        `;
    });
}

function acceptFriendRequest(requestId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const requests = getRequests();
    const request = requests.find(item => item.id === requestId);

    if (!request || request.to !== currentUser.id) return;

    const friends = getFriends();
    friends.push({ id: Date.now(), user1: request.from, user2: request.to });
    saveFriends(friends);

    addNotification(request.from, currentUser.name + " accepted your friend request.", "friend_accepted");
    saveRequests(requests.filter(item => item.id !== requestId));

    alert("Friend request accepted!");
    displayFriendRequests();
    displayFriends();
    UsersDirectory();
    updateRequestBadge();
    updateNotificationBadge();
}

function rejectFriendRequest(requestId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const requests = getRequests();
    const request = requests.find(item => item.id === requestId);

    if (!request || request.to !== currentUser.id) return;

    addNotification(request.from, currentUser.name + " rejected your friend request.", "friend_rejected");
    saveRequests(requests.filter(item => item.id !== requestId));

    alert("Friend request rejected.");
    displayFriendRequests();
    UsersDirectory();
    updateRequestBadge();
    updateNotificationBadge();
}

function displayFriends() {
    const container = document.getElementById("friendsList");
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const friends = getFriends();
    const friendIds = [];

    friends.forEach(function(friend) {
        if (friend.user1 === currentUser.id) friendIds.push(friend.user2);
        else if (friend.user2 === currentUser.id) friendIds.push(friend.user1);
    });

    const friendUsers = users.filter(user => friendIds.includes(user.id));
    container.innerHTML = "";

    if (friendUsers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Friends Yet</h3>
                <p>Go to User Directory and send a friend request.</p>
            </div>
        `;
        return;
    }

    friendUsers.forEach(function(user) {
        container.innerHTML += `
            <div class="user-card">
                <div class="avatar">${getInitials(user.name)}</div>
                <h3>${user.name}</h3>
                <p class="username">@${user.username}</p>
                <p class="status">● Online</p>
                <button class="card-btn remove-btn" onclick="removeFriend(${user.id})">Remove Friend</button>
            </div>
        `;
    });
}

function removeFriend(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    let friends = getFriends();
    friends = friends.filter(f => !((f.user1 === currentUser.id && f.user2 === userId) || (f.user1 === userId && f.user2 === currentUser.id)));
    
    saveFriends(friends);
    alert("Friend removed.");
    UsersDirectory();
    displayFriends();
}

function updateRequestBadge() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const requests = getRequests();
    const requestCount = requests.filter(r => r.to === currentUser.id).length;
    const badges = document.querySelectorAll("#requestBadge");

    badges.forEach(badge => {
        badge.textContent = requestCount;
        badge.style.display = requestCount === 0 ? "none" : "inline-flex";
    });
}

function displayNotifications() {
    const container = document.getElementById("notificationsList");
    if (!container) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const notifications = getNotifications();
    const userNotifications = notifications.filter(n => n.userId === currentUser.id);

    container.innerHTML = "";

    if (userNotifications.length === 0) {
        container.innerHTML = `
            <div class="notification-empty">
                <h3>No Notifications</h3>
                <p>You don't have any notifications yet.</p>
            </div>
        `;
        return;
    }

    userNotifications.forEach(function(notification) {
        let icon = "🔔";
        if (notification.type === "friend_request") icon = "👤";
        if (notification.type === "friend_accepted") icon = "👥";
        if (notification.type === "friend_rejected") icon = "❌";

        let button = !notification.isRead ? `<button class="notification-read-btn" onclick="markNotificationRead(${notification.id})">Mark as read</button>` : "";

        container.innerHTML += `
            <div class="notification-card ${notification.isRead ? "" : "unread"}">
                <div class="notification-icon">${icon}</div>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <span class="notification-time">${notification.createdAt}</span>
                </div>
                ${button}
            </div>
        `;
    });
}

function markNotificationRead(notificationId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const notifications = getNotifications();
    const notification = notifications.find(n => n.id === notificationId && n.userId === currentUser.id);

    if (notification) {
        notification.isRead = true;
        saveNotifications(notifications);
        displayNotifications();
        updateNotificationBadge();
    }
}

function clearNotifications() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const notifications = getNotifications();
    saveNotifications(notifications.filter(n => n.userId !== currentUser.id));
    displayNotifications();
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const unreadCount = getNotifications().filter(n => n.userId === currentUser.id && !n.isRead).length;
    const badges = document.querySelectorAll("#notificationBadge");

    badges.forEach(badge => {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount === 0 ? "none" : "inline-flex";
    });

    const dashboardCount = document.getElementById("notificationsCount");
    if (dashboardCount) dashboardCount.textContent = unreadCount;
}

function showPosts() {
    const feed = document.getElementById("feed");
    if (!feed) return;

    const newPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const allPosts = newPosts.concat(oldPosts);

    feed.innerHTML = "";

    allPosts.forEach(function(post) {
        feed.innerHTML += `
            <div class="post-card">
                <div class="post-header">
                    <span class="post-username">${post.user || post.author}</span>
                </div>
                ${post.img ? `<img src="${post.img}" alt="Postingan" class="post-image">` : ''}
                <div class="post-actions">
                    <button class="post-action-btn" onclick="likePost(this)">Like</button>
                    <a href="comments.html" class="post-action-btn">Comment</a>
                </div>
                <div class="post-likes">${post.likes || 0} likes</div>
                <div class="post-caption-box">
                    <span class="caption-username">${post.user || post.author}</span>
                    ${post.caption || post.content}
                </div>
            </div>
        `;
    });
}

function likePost(button) {
    button.classList.toggle("liked");
}

function showProfile() {
    const box = document.getElementById("profileInfo");
    const currentUser = getCurrentUser();

    if (!box || !currentUser) return;

    box.innerHTML = `
        <div class="avatar profile-avatar">${getInitials(currentUser.name)}</div>
        <h3>${currentUser.name}</h3>
        <p class="username">@${currentUser.username}</p>
    `;
}

let selectedImage = "";

function previewImage(input) {
    if (!input.files || !input.files[0]) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        selectedImage = event.target.result;
        const preview = document.getElementById("imagePreview");
        if (preview) {
            preview.src = selectedImage;
            preview.style.display = "block";
        }
    };
    reader.readAsDataURL(input.files[0]);
}

function sharePost() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    if (selectedImage === "") {
        alert("Pilih foto terlebih dahulu!");
        return;
    }

    const captionInput = document.getElementById("caption");
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");

    posts.unshift({
        user: currentUser.username,
        author: currentUser.username,
        img: selectedImage,
        caption: captionInput ? captionInput.value : "",
        content: captionInput ? captionInput.value : "",
        likes: 0
    });

    try {
        localStorage.setItem("posts", JSON.stringify(posts));
        window.location.href = "index.html";
    } catch (error) {
        alert("Foto terlalu besar, coba foto yang lebih kecil.");
    }
}

function logoToHome() {
    const logos = document.querySelectorAll(".navbar .logo");
    logos.forEach(logo => {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => window.location.href = "index.html");
    });
}

function setActiveNavbar() {
    const navLinks = document.querySelectorAll(".navbar nav a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (!href) return;

        if (href.split("/").pop() === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const chatBox = document.getElementById("chatBox");

    if (!input || !chatBox) return;

    const text = input.value.trim();
    if (text === "") return;

    chatBox.innerHTML += `<div class="message">${text}</div>`;
    input.value = "";
}

function saveSettings() {
    const displayName = document.getElementById("displayName");
    const bio = document.getElementById("bio");
    const privateMode = document.getElementById("privateMode");

    if (!displayName || !bio || !privateMode) return;

    const settings = {
        displayName: displayName.value,
        bio: bio.value,
        privateMode: privateMode.checked
    };

    localStorage.setItem("settings", JSON.stringify(settings));
    alert("Settings saved!");
}

document.addEventListener("DOMContentLoaded", function() {
    checkLogin();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("registerName").value.trim();
            const username = document.getElementById("registerUsername").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("registerConfirmPassword").value;

            if (password !== confirmPassword) {
                alert("Password dan konfirmasi password tidak sama!");
                return;
            }

            const users = getUsers();
            if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
                alert("Username sudah digunakan!");
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

            alert("Registrasi berhasil! Silakan login.");
            window.location.href = "login.html";
        });
    }

    UsersDirectory();
    displayFriends();
    displayFriendRequests();
    displayNotifications();
    updateRequestBadge();
    updateNotificationBadge();
    showPosts();
    showProfile();
    logoToHome();
    setActiveNavbar();

    if (document.getElementById("globalSearchInput")) {
        handleGlobalSearch();
    }
});