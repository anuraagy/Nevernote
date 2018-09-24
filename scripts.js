class Notes {
  constructor() {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));

    if(savedNotes !== null) {
      this.list = savedNotes;
    } else {
      this.list = [];
    }
  }

  delete(id) {
    this.list = this.list.filter(obj => obj.id !== id);
    localStorage.setItem("notes", JSON.stringify(this.list));
  }

  update(id, name, description) {
    this.list = this.list.map((obj) => {
      if(obj.id === id) {
        return {
          id: id,
          name: name,
          description: description, 
          timestamp: new Date().toLocaleString()
        };
      } else {
        return obj;
      }
    })
    localStorage.setItem("notes", JSON.stringify(this.list));
  }

  add(name, description) {
    const id = Math.random().toString(36).substr(2, 15);
    
    this.list.unshift({
      id: id,
      name: name,
      description: description,
      timestamp: new Date().toLocaleString()
    })
    localStorage.setItem("notes", JSON.stringify(this.list));

    return id;
  }

  getList() {
    return this.list.sort((obj1, obj2) => new Date(obj2.timestamp) - new Date(obj1.timestamp));
  }
}


class NoteUI {
  static addNote() {
    const note = {name: "", description: "", id: "", timestamp: ""};
    this.updateNote(note);
  }

  static updateSidebar(list) {
    let sidebar = document.getElementById("noteList")
    sidebar.innerHTML = '';

    if(list.length > 0) {
      list.forEach(note => {
        let sidebar = document.getElementById("noteList");
        let noteElement = document.createElement("div");

        noteElement.setAttribute("class", "note-preview");
        noteElement.setAttribute("id", `note-${note.id}`);

        let name = note.name || "Unnamed note";

        let noteInterior = `<div class='note-preview-header'>
                          <p>${name}</p>
                          <p class='date'>${note.timestamp}</p>
                        </div> 
                        <div class='note-preview-description'> 
                          <p class='note-interior'>${note.description.substring(0,250)}</p> 
                        </div> `;

        noteElement.innerHTML = noteInterior;


        noteElement.addEventListener("click", (event) => {
          this.updateNote(note);
        })

        sidebar.appendChild(noteElement);
      })

      this.updateNote(list[0]);
    } else {
      sidebar.innerHTML = "<p style='text-align: center; margin-top: 15px;'>You don't have any notes</p>";
    }
  }

  static updateNote(note) {
    let noteId = document.getElementById("note-id");
    noteId.value = note.id;

    let notename = document.getElementById("note-name");
    notename.value = note.name;

    let noteText = document.getElementById("note-text");
    noteText.value = note.description;

    let noteTimestamp = document.getElementById("note-timestamp");
    noteTimestamp.innerHTML = note.timestamp; 

    let deleteNoteButton = document.getElementById("remove-btn");
    deleteNoteButton.setAttribute("data-id", note.id);
  }
}

// Initialize notes
let notes = new Notes();
NoteUI.updateSidebar(notes.getList());

let searchBar = document.getElementById("searchInput");

searchBar.addEventListener("keyup", (event) => {
  const query = searchBar.value;

  if(query !== "") {
    list = notes.getList().filter(obj => obj.name.toLowerCase().trim() === query.toLowerCase().trim())  
    NoteUI.updateSidebar(list);
  } else {
    NoteUI.updateSidebar(notes.list);
  }
})

// Add listeners
let addNoteButton = document.getElementById("add-note");
addNoteButton.addEventListener("click", event => NoteUI.addNote());

let deleteNoteButton = document.getElementById("remove-btn");
deleteNoteButton.addEventListener("click", (event) => {
  const id = deleteNoteButton.getAttribute("data-id");
  
  let confirmDelete = confirm("Are you sure you want to delete this note?");

  if(confirmDelete) {
    notes.delete(id);
    NoteUI.updateSidebar(notes.getList());
  }
})

if(notes.list.length === 0) {
  NoteUI.addNote();
}

let notename = document.getElementById("note-name");
let noteId = document.getElementById("note-id");
let notedescription = document.getElementById("note-text");


notedescription.addEventListener("keyup", (event) => {
  id = noteId.getAttribute("value");
  
  if(id === "") {
    const description = notedescription.value;
    const newId = notes.add("", description);
    console.log("there");

    noteId.setAttribute("value", newId);
  } else {
    console.log("here");
    const name = notename.value;
    const description = notedescription.value;

    notes.update(id, name, description);
  }

  NoteUI.updateSidebar(notes.getList())
  searchBar.value = "";
  console.log("hello")
});
 
notename.addEventListener("keyup", (event) => {
  id = noteId.getAttribute("value");
  
  if(id === "") {
    const name = notename.value;
    const newId = notes.add(name, "");

    noteId.setAttribute("value", newId);
  } else {
    // debugger
    const name = notename.value;
    const description = notedescription.value;

    notes.update(id, name, description)
  }

  NoteUI.updateSidebar(notes.getList());
  searchBar.value = "";
  console.log("helloa");
});


