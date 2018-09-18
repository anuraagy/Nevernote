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

  update(id, title, content) {
    this.list = this.list.map((obj) => {
      if(obj.id === id) {
        return {
          id: id,
          title: title,
          content: content, 
          timestamp: new Date().toLocaleString()
        };
      } else {
        return obj;
      }
    })
    localStorage.setItem("notes", JSON.stringify(this.list));
  }

  add(title, content) {
    const id = Math.random().toString(36).substr(2, 15)
    
    this.list.unshift({
      id: id,
      title: title,
      content: content,
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
    const note = {title: "", content: "", id: "", timestamp: ""};
    this.updateNote(note)
  }

  static updateSidebar(list) {
    let sidebar = document.getElementById("noteList")
    sidebar.innerHTML = '';

    if(list.length > 0) {
      list.forEach(note => {
        let sidebar = document.getElementById("noteList")
        let noteElement = document.createElement("div")

        noteElement.setAttribute("class", "note-preview")
        noteElement.setAttribute("id", `note-${note.id}`)

        let title = note.title || "Untitled note";

        let noteInterior = `<div class='note-preview-header'>
                          <p>${title}</p>
                          <p class='date'>${note.timestamp}</p>
                        </div> 
                        <div class='note-preview-content'> 
                          <p class='note-interior'>${note.content.substring(0,250)}</p> 
                        </div> `

        noteElement.innerHTML = noteInterior;


        noteElement.addEventListener("click", (event) => {
          this.updateNote(note)
        })

        sidebar.appendChild(noteElement)
      })

      this.updateNote(list[0]);
    } else {
      sidebar.innerHTML = "<p style='text-align: center; margin-top: 15px;'>You don't have any notes</p>"
    }
  }

  static updateNote(note) {
    let noteId = document.getElementById("note-id");
    noteId.value = note.id

    let noteTitle = document.getElementById("note-title");
    noteTitle.value = note.title

    let noteText = document.getElementById("note-text");
    noteText.value = note.content;

    let noteTimestamp = document.getElementById("note-timestamp");
    noteTimestamp.innerHTML = note.timestamp; 

    let deleteNoteButton = document.getElementById("remove-btn");
    deleteNoteButton.setAttribute("data-id", note.id);
  }
}

// Initialize notes
let notes = new Notes();
NoteUI.updateSidebar(notes.getList())

let searchBar = document.getElementById("searchInput");

searchBar.addEventListener("keyup", (event) => {
  const query = searchBar.value

  if(query !== "") {
    list = notes.getList().filter(obj => obj.title.toLowerCase().trim() === query.toLowerCase().trim())  
    NoteUI.updateSidebar(list);
  } else {
    NoteUI.updateSidebar(notes.list);
  }
})

// Add listeners
let addNoteButton = document.getElementById("add-note");
addNoteButton.addEventListener("click", event => NoteUI.addNote())

let deleteNoteButton = document.getElementById("remove-btn");
deleteNoteButton.addEventListener("click", (event) => {
  const id = deleteNoteButton.getAttribute("data-id");
  
  let confirmDelete = confirm("Are you sure you want to delete this note?")

  if(confirmDelete) {
    notes.delete(id);
    NoteUI.updateSidebar(notes.getList());
  }
})

if(notes.list.length === 0) {
  NoteUI.addNote()
}

let noteTitle = document.getElementById("note-title");
let noteId = document.getElementById("note-id");
let noteContent = document.getElementById("note-text");


noteContent.addEventListener("keyup", (event) => {
  id = noteId.getAttribute("value");
  
  if(id === "") {
    const content = noteContent.value;
    const newId = notes.add("", content);
    console.log("there");

    noteId.setAttribute("value", newId);
  } else {
    console.log("here");
    const title = noteTitle.value
    const content = noteContent.value;

    notes.update(id, title, content)
  }

  NoteUI.updateSidebar(notes.getList())
  searchBar.value = "";
  console.log("hello")
});
 
noteTitle.addEventListener("keyup", (event) => {
  id = noteId.getAttribute("value");
  
  if(id === "") {
    const title = noteTitle.value
    const newId = notes.add(title, "");

    noteId.setAttribute("value", newId);
  } else {
    // debugger
    const title = noteTitle.value;
    const content = noteContent.value;

    notes.update(id, title, content)
  }

  NoteUI.updateSidebar(notes.getList());
  searchBar.value = "";
  console.log("helloa");
});


