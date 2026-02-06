// LocalStorage handling for character save/load
const STORAGE_KEY = 'convention-quest-characters';

const Storage = {
    // Get all saved characters
    getCharacters() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save a character (adds to list)
    saveCharacter(character) {
        const characters = this.getCharacters();
        character.id = Date.now(); // Simple unique ID
        character.savedAt = new Date().toISOString();
        characters.push(character);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
        return character.id;
    },

    // Get a specific character by ID
    getCharacter(id) {
        const characters = this.getCharacters();
        return characters.find(c => c.id === id);
    },

    // Delete a character
    deleteCharacter(id) {
        const characters = this.getCharacters();
        const filtered = characters.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    // Clear all saved characters
    clearAll() {
        localStorage.removeItem(STORAGE_KEY);
    }
};
