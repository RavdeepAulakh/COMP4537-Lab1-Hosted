const LAST_SAVED_PREFIX = 'Last saved: ';

function Note(content, index, updateCallback, removeCallback) {
    this.content = content || '';
    this.index = index;
    this.updateCallback = updateCallback;
    this.removeCallback = removeCallback;

    this.createNoteElement = function () {
        const textarea = document.createElement('textarea');
        textarea.value = this.content;
        textarea.addEventListener('input', () => this.updateContent(textarea.value));

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-btn';
        removeBtn.innerText = 'Remove';
        removeBtn.addEventListener('click', () => this.remove());

        const noteDiv = document.createElement('div');
        noteDiv.appendChild(textarea);
        noteDiv.appendChild(removeBtn);

        return noteDiv;
    };

    this.updateContent = function (content) {
        this.content = content;
        this.updateCallback(this.index, content);
    };

    this.remove = function () {
        this.removeCallback(this.index);
    };
}

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function updateNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';

    notes.forEach((note, index) => {
        const noteObj = new Note(note.content, index, updateNoteContent, removeNote);
        const noteElement = noteObj.createNoteElement();
        notesContainer.appendChild(noteElement);
    });

    updateLastSaveTime();
}

function addNote() {
    notes.push(new Note());
    updateNotes();
    saveNotesToLocalStorage();
}

function removeNote(index) {
    notes.splice(index, 1);
    updateNotes();
    saveNotesToLocalStorage();
}

function updateNoteContent(index, content) {
    notes[index].content = content;
    saveNotesToLocalStorage();
}

function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
    updateLastSaveTime();
}

function updateLastSaveTime() {
    const lastSaveTimeElement = document.getElementById('last-save-time');
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleTimeString();
    lastSaveTimeElement.innerText = LAST_SAVED_PREFIX + formattedTime;
}

updateNotes();

setInterval(saveNotesToLocalStorage, 2000);

