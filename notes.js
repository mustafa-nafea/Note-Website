// Function to set cookiies 
function setCookie(name, value, time){
    const date = new Date();
    date.setTime(date.getTime() + time * 24 * 60 * 60 * 1000);
    const expire = "expires" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expire}; path=/`;
}

// Function to Get cookies
function getCookie(name){
    const decodedcookies = decodeURIComponent(document.cookie);
    const cookiesarray = decodedcookies.split("; ");
    let result = null ;
    cookiesarray.forEach((cookie) => {
        if (cookie.indexOf(name) === 0) {
            result = cookie.substring(name.length +1);
        }
    });
    return result;
}

// Function to delete cookies
function deleteCookie(name){
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Function to show the notes page 
function showNotesPage(){
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('notes-page').style.display = 'block';
    loadNotes();
}

// Function to show the login page
function showLoginPage(){
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('notes-page').style.display = 'none';
}

// Function that gets the hash of the password to save in the local storage
function hash(passkey){
    const hash = CryptoJS.SHA256(passkey);
    return hash.toString(CryptoJS.enc.Hex);
}

// Function to signup
function signup(){
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    let hashedPass = hash(newPassword);
    if (newPassword !== '' && newUsername !== '' && confirmPassword !== '') {
        if (newPassword === confirmPassword) {
            localStorage.setItem(`user${newUsername}` , newUsername);
            localStorage.setItem(`userpa${newUsername}` , hashedPass);
            alert('Sign Up successful');
        }else{
            alert('Please confirm the password');
        }
    }
    else{
        alert('Please enter the username and password');
    }
}

// Function to login
function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const savedUsername = localStorage.getItem(`user${username}`);
    const savedPassword = localStorage.getItem(`userpa${username}`);
    const hashedPass = hash(password);
    if (username === savedUsername && hashedPass === savedPassword) {
        setCookie("loginuser", username, 2);
        showNotesPage();
    }else{
        alert('Invalid username or password');
    }
}

// Functin to check the autentication 
window.onload = function () {
    const loggedIn = getCookie("loginuser");
  
    if (loggedIn) {
      showNotesPage();
    }
  };

// Function to logout
function logout(){
    deleteCookie("loginuser");
    showLoginPage();
}

 // Functions to add the notes to pagea and save in the local storage
function addNote(){
    const input = document.getElementById('notes-input');
    let noteText = input.value;

    if (noteText !== '') {
        const notesList = document.getElementById('notes-list');
        const listItem = document.createElement('li');
        listItem.innerHTML = 
            `<span>${noteText}</span>
            <button class="edit-btn" onclick="editNote(this)">Edit</button>
            <button class="delete-btn" onclick="deleteNote(this)">Delete</button>`;
        notesList.appendChild(listItem);

        // Save in local storage using Json
        const notes = JSON.parse(localStorage.getItem('note')) || [];
        notes.push(noteText);
        localStorage.setItem('note', JSON.stringify(notes));

        // Clear the note 
        input.value = "";
    }
    
}

// Function to Load the notes
function loadNotes() {
    const notesList = document.getElementById('notes-list');
    const notes = JSON.parse(localStorage.getItem('note'));

    if (notes) {
        notes.forEach((note) => {
            const listItem = document.createElement('li');
            listItem.innerHTML =
                `<span>${note}</span>
                <button class="edit-btn" onclick="editNote(this)">Edit</button>
                <button class="delete-btn" onclick="deleteNote(this)">Delete</button>`;
            notesList.appendChild(listItem);
        });
    } else {
        console.log("No notes found in local storage");
    }
}

// Function to modify notes
function editNote() {
    const button = event.target;  // Assuming this function is called from a button click
    const listItem = button.parentElement;
    const noteText = listItem.querySelector('span');
    const editedNote = prompt('Edit note:', noteText.textContent);

    if (editedNote !== null) {
        noteText.textContent = editedNote;

        // Update note in local storage
        const notes = JSON.parse(localStorage.getItem('note')) || [];
        const index = Array.from(listItem.parentNode.children).indexOf(listItem);
        notes[index] = editedNote;
        localStorage.setItem('note', JSON.stringify(notes));
    }
}

// Function to delete notes
function deleteNote(buttonDelete){
    const list = buttonDelete.parentElement;
    const noteText = list.querySelector('span').textContent;

    //delete the note
    list.remove();

    //delete the note from the local storage
    const notes = JSON.parse(localStorage.getItem('note'));
    const updatedNotes = notes.filter(note => note !== noteText);
    localStorage.setItem('note', JSON.stringify(updatedNotes));
}
