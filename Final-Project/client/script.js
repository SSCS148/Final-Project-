document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const postForm = document.getElementById("postForm");
    const commentForm = document.getElementById("commentForm");
  
    // Gérer les soumissions du formulaire d'enregistrement
    if (registerForm) {
      registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const age = document.getElementById("age").value;
  
        try {
          const response = await fetch(
            "http://localhost:5002/api/user/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password, age }),
            }
          );
  
          if (response.ok) {
            const data = await response.json();
            console.log("User registered:", data);
            document.getElementById("message").textContent =
              "Registration successful!";
            document.getElementById("message").style.color = "green";
            window.location.href = "main.html";
          } else {
            const errorData = await response.json();
            console.error("Error registering user:", errorData);
            document.getElementById("message").textContent =
              "Error: " + errorData.error;
            document.getElementById("message").style.color = "red";
          }
        } catch (error) {
          console.error("Error:", error);
          document.getElementById("message").textContent =
            "Error: " + error.message;
          document.getElementById("message").style.color = "red";
        }
      });
    }
  
    // Gérer les soumissions du formulaire de connexion
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
  
        try {
          const response = await fetch("http://localhost:5002/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("User logged in:", data);
            document.getElementById("message").textContent = "Login successful!";
            document.getElementById("message").style.color = "green";
            localStorage.setItem("token", data.token);
            window.location.href = "main.html";
          } else {
            const errorData = await response.json();
            console.error("Error logging in user:", errorData);
            document.getElementById("message").textContent =
              "Error: " + errorData.error;
            document.getElementById("message").style.color = "red";
          }
        } catch (error) {
          console.error("Error:", error);
          document.getElementById("message").textContent =
            "Error: " + error.message;
          document.getElementById("message").style.color = "red";
        }
      });
    }
  
    // Gérer les soumissions des messages
    if (postForm) {
      postForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const message = document.getElementById("message").value;
        const photo = document.getElementById("photo").files[0];
        const formData = new FormData();
        formData.append("message", message);
        formData.append("photo", photo);
  
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5002/api/posts", {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
            body: formData,
          });
  
          if (response.ok) {
            const data = await response.json();
            displayPost(data);
          } else {
            console.error("Error posting message:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }
  
    // Gérer les soumissions des commentaires
    if (commentForm) {
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const comment = document.getElementById("comment").value;
  
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:5002/api/comments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ comment }),
          });
  
          if (response.ok) {
            const data = await response.json();
            displayComment(data);
          } else {
            console.error("Error posting comment:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }
  
    // Charger les commentaires au chargement de la page
    async function loadComments() {
      try {
        const response = await fetch("http://localhost:5002/api/comments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const comments = await response.json();
          comments.forEach(displayComment);
        } else {
          console.error("Error fetching comments:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    loadComments();
  
    // Gérer les likes
    async function likeComment(commentId) {
      try {
        const response = await fetch("http://localhost:5002/api/comments/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId }),
        });
    
        if (response.ok) {
          const data = await response.json();
          document.getElementById(`likeCount-${commentId}`).textContent = data.likes;
        } else {
          console.error("Error liking comment:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    
    function displayComment(comment) {
      const commentsSection = document.getElementById("commentsSection");
      const commentDiv = document.createElement("div");
      commentDiv.classList.add('comment-container');
      commentDiv.innerHTML = `
        <p>${comment.comment}</p>
        <p>Likes: <span id="likeCount-${comment.id}">${comment.likes}</span></p>
        <button onclick="likeComment(${comment.id})">Like</button>
      `;
      commentsSection.appendChild(commentDiv);
    }
    
    function displayPost(post) {
      const postsDiv = document.getElementById("posts");
      const postDiv = document.createElement("div");
      postDiv.classList.add('post-container');
      postDiv.innerHTML = `
        <p>${post.message}</p>
        ${post.photo ? `<img src="/uploads/${post.photo}" alt="Post photo" style="max-width:100%; height:auto;">` : ""}
      `;
      postsDiv.appendChild(postDiv);
    }
  
    function displayComment(comment) {
      const commentsSection = document.getElementById("commentsSection");
      const commentDiv = document.createElement("div");
      commentDiv.classList.add('comment-container'); // Ajouter la classe CSS
      commentDiv.innerHTML = `
        <p>${comment.comment}</p>
        <p>Likes: <span id="likeCount-${comment.id}">${comment.likes}</span></p>
        <button onclick="likeComment(${comment.id})">Like</button>
      `;
      commentsSection.appendChild(commentDiv);
    }
  
    // Charger les utilisateurs au chargement de la page
    async function loadUsers() {
      try {
        const response = await fetch("http://localhost:5002/api/user/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const users = await response.json();
          displayUsers(users);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    function displayUsers(users) {
      const usersList = document.getElementById("usersList");
      usersList.innerHTML = ""; // Clear existing users
      users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.innerHTML = `
                  <p>Name: ${user.name}</p>
                  <p>Email: ${user.email}</p>
                  <p>Age: ${user.age}</p>
                  <hr>
              `;
        usersList.appendChild(userDiv);
      });
    }
  
    loadUsers();
  
    // Affichage/Masquage du mot de passe
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
      togglePassword.addEventListener("click", () => {
        const passwordInput = document.getElementById("password");
        const type =
          passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        const toggleButtonText = type === "password" ? "Show" : "Hide";
        togglePassword.textContent = toggleButtonText;
      });
    }
  
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");
    if (toggleLoginPassword) {
      toggleLoginPassword.addEventListener("click", () => {
        const passwordInput = document.getElementById("loginPassword");
        const type =
          passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        const toggleButtonText = type === "password" ? "Show" : "Hide";
        toggleLoginPassword.textContent = toggleButtonText;
      });
    }
  });
  async function loadPosts() {
    try {
      const response = await fetch("http://localhost:5002/api/posts");
      const posts = await response.json();
      const postsContainer = document.getElementById("postsContainer");
  
      posts.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `
            <p>${post.message}</p>
            ${
              post.photo
                ? `<img src="uploads/${post.photo}" alt="Post photo">`
                : ""
            }
          `;
        postsContainer.appendChild(postDiv);
      });
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }
  
  loadPosts();
  