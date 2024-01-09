const LAST_RETRIEVED_PREFIX = 'Last retrieved: ';

class Note {
    constructor(content) {
        this.content = content || '';
        this.noteDiv = document.createElement('div');
        this.textarea = document.createElement('textarea');
        this.textarea.value = this.content;
        this.textarea.readOnly = true;
        this.noteDiv.appendChild(this.textarea);
    }

    addToContainer(container) {
        container.appendChild(this.noteDiv);
    }

    static updateNotes(notes) {
        const notesContainer = document.getElementById('notes-container');
        const retrievedTimeElement = document.getElementById('retrieved-time');

        notesContainer.innerHTML = '';

        notes.forEach(note => {
            note.addToContainer(notesContainer);
        });

        const currentDate = new Date();
        const formattedTime = currentDate.toLocaleTimeString();
        retrievedTimeElement.innerText = LAST_RETRIEVED_PREFIX + formattedTime;
    }

    static retrieveNotes() {
        const retrievedNotesData = JSON.parse(localStorage.getItem('notes')) || [];
        const retrievedNotes = retrievedNotesData.map(noteData => new Note(noteData.content));
        this.updateNotes(retrievedNotes);
    }

    static startAutoUpdate() {
        setInterval(() => {
            this.retrieveNotes();
        }, 2000);
    }
}


Note.retrieveNotes();
Note.startAutoUpdate();
