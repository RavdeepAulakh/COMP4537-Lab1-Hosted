class Note {
    constructor(content, index, updateCallback, removeCallback) {
        this.content = content || '';
        this.index = index;
        this.updateCallback = updateCallback;
        this.removeCallback = removeCallback;
    }

    createNoteElement() {
        const noteDiv = document.createElement('div');

        const textarea = document.createElement('textarea');
        textarea.value = this.content;
        textarea.addEventListener('input', () => this.updateContent(textarea.value));
        textarea.style.width = 'calc(80% - 5px)'; // Adjust the width of the textarea

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-btn';
        removeBtn.innerText = 'Remove';
        removeBtn.addEventListener('click', () => this.remove());
        removeBtn.style.width = '20%'; // Adjust the width of the remove button

        noteDiv.appendChild(textarea);
        noteDiv.appendChild(removeBtn);

        return noteDiv;
    }

    updateContent(content) {
        this.content = content;
        this.updateCallback(this.index, content);
    }

    remove() {
        this.removeCallback(this.index);
    }
}

class NoteManager {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    }

    updateNotes() {
        const notesContainer = document.getElementById('notes-container');
        notesContainer.innerHTML = '';

        this.notes.forEach((note, index) => {
            const noteObj = new Note(note.content, index, this.updateNoteContent.bind(this), this.removeNote.bind(this));
            const noteElement = noteObj.createNoteElement();
            notesContainer.appendChild(noteElement);
        });

        this.updateLastSaveTime();
    }

    addNote() {
        this.notes.push(new Note());
        this.updateNotes();
        this.saveNotesToLocalStorage();
    }

    removeNote(index) {
        this.notes.splice(index, 1);
        this.updateNotes();
        this.saveNotesToLocalStorage();
    }

    updateNoteContent(index, content) {
        this.notes[index].content = content;
        this.saveNotesToLocalStorage();
    }

    saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.updateLastSaveTime();
    }

    updateLastSaveTime() {
        const lastSaveTimeElement = document.getElementById('last-save-time');
        const currentDate = new Date();
        const formattedTime = currentDate.toLocaleTimeString();
        lastSaveTimeElement.innerText = LAST_SAVED_PREFIX + formattedTime;
    }
}

const noteManager = new NoteManager();
noteManager.updateNotes();

setInterval(() => noteManager.saveNotesToLocalStorage(), 2000);
