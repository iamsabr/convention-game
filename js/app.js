// Main wizard application
const App = {
    currentStep: 0,
    character: {
        name: '',
        ancestry: '',
        background: '',
        talent: '',
        flaw: '',
        stats: null,
        bonuses: null,
        spells: [],
        useMagic: false,
        coins: 0,
        gear: ['Clothing (0 armor)', 'Shabby weapon (+0 damage)'],
        health: 3
    },

    // Initialize the app
    init() {
        this.character.stats = Stats.createEmpty();
        this.bindEvents();
        this.showStep(0);
        this.loadSavedCharacters();
    },

    // Bind all event handlers
    bindEvents() {
        // Navigation buttons
        document.querySelectorAll('[data-action="next"]').forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });
        document.querySelectorAll('[data-action="prev"]').forEach(btn => {
            btn.addEventListener('click', () => this.prevStep());
        });
        document.querySelectorAll('[data-action="start"]').forEach(btn => {
            btn.addEventListener('click', () => this.showStep(1));
        });
        document.querySelectorAll('[data-action="restart"]').forEach(btn => {
            btn.addEventListener('click', () => this.restart());
        });

        // Name and ancestry inputs
        const nameInput = document.getElementById('char-name');
        const ancestryInput = document.getElementById('char-ancestry');
        if (nameInput) nameInput.addEventListener('input', (e) => {
            this.character.name = e.target.value;
        });
        if (ancestryInput) ancestryInput.addEventListener('input', (e) => {
            this.character.ancestry = e.target.value;
        });

        // Background and talent inputs
        const bgInput = document.getElementById('char-background');
        const talentInput = document.getElementById('char-talent');
        if (bgInput) bgInput.addEventListener('input', (e) => {
            this.character.background = e.target.value;
        });
        if (talentInput) talentInput.addEventListener('input', (e) => {
            this.character.talent = e.target.value;
        });

        // Flaw input
        const flawInput = document.getElementById('char-flaw');
        if (flawInput) flawInput.addEventListener('input', (e) => {
            this.character.flaw = e.target.value;
            this.updateSentencePreview();
        });

        // Magic toggle
        const magicToggle = document.getElementById('use-magic');
        if (magicToggle) magicToggle.addEventListener('change', (e) => {
            this.character.useMagic = e.target.checked;
            this.toggleSpellSelection(e.target.checked);
        });

        // Stat roll input
        const rollInput = document.getElementById('stat-roll-value');
        if (rollInput) {
            rollInput.addEventListener('input', () => this.updateStatButtons());
        }

        // Coins roll input
        const coinsInput = document.getElementById('coins-roll-value');
        if (coinsInput) {
            coinsInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 2 && value <= 12) {
                    this.character.coins = value;
                    this.updateCoinsDisplay();
                }
            });
        }

        // Save and print buttons
        const saveBtn = document.getElementById('save-character');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveCharacter());

        const printBtn = document.getElementById('print-character');
        if (printBtn) printBtn.addEventListener('click', () => window.print());
    },

    // Show a specific step
    showStep(stepNum) {
        // Hide all steps
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show the requested step
        const step = document.querySelector(`[data-step="${stepNum}"]`);
        if (step) {
            step.classList.add('active');
            this.currentStep = stepNum;
            this.updateProgress();
            this.onStepEnter(stepNum);
        }
    },

    // Handle entering a step
    onStepEnter(stepNum) {
        switch(stepNum) {
            case 3: // Stats
                this.renderStatAssignment();
                break;
            case 5: // Flaw
                this.updateSentencePreview();
                break;
            case 6: // Spells
                this.renderSpellSelection();
                break;
            case 7: // Gear
                this.renderGearStep();
                break;
            case 8: // Summary
                this.renderSummary();
                break;
        }
    },

    // Go to next step
    nextStep() {
        if (this.validateCurrentStep()) {
            this.showStep(this.currentStep + 1);
        }
    },

    // Go to previous step
    prevStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    },

    // Validate the current step before proceeding
    validateCurrentStep() {
        switch(this.currentStep) {
            case 2: // Name & Ancestry
                if (!this.character.name.trim()) {
                    this.showError('Please enter a character name');
                    return false;
                }
                if (!this.character.ancestry.trim()) {
                    this.showError('Please enter an ancestry');
                    return false;
                }
                return true;

            case 3: // Stats
                if (!Stats.isComplete(this.character.stats)) {
                    this.showError('Please assign all stats');
                    return false;
                }
                return true;

            case 4: // Background & Talent
                if (!this.character.background.trim()) {
                    this.showError('Please enter a background');
                    return false;
                }
                if (!this.character.talent.trim()) {
                    this.showError('Please enter a talent');
                    return false;
                }
                return true;

            case 5: // Flaw
                if (!this.character.flaw.trim()) {
                    this.showError('Please enter a flaw');
                    return false;
                }
                return true;

            case 6: // Spells
                if (this.character.useMagic && this.character.spells.length !== 3) {
                    this.showError('Please select exactly 3 spells');
                    return false;
                }
                return true;

            case 7: // Gear
                if (this.character.coins === 0) {
                    this.showError('Please roll for starting coins');
                    return false;
                }
                return true;

            default:
                return true;
        }
    },

    // Show error message
    showError(message) {
        const errorDiv = document.querySelector('.wizard-step.active .error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
            setTimeout(() => errorDiv.classList.remove('show'), 3000);
        } else {
            alert(message);
        }
    },

    // Update progress indicator
    updateProgress() {
        const totalSteps = 8;
        const progress = Math.round((this.currentStep / totalSteps) * 100);
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Step ${this.currentStep} of ${totalSteps}`;
    },

    // Render stat assignment UI
    renderStatAssignment() {
        const container = document.getElementById('stat-assignment');
        if (!container) return;

        const assigned = Stats.getAssigned(this.character.stats);
        const unassigned = Stats.getUnassigned(this.character.stats);

        // Check if all stats are assigned
        if (Stats.isComplete(this.character.stats)) {
            this.character.bonuses = Stats.calculateBonuses(this.character.stats);
            this.character.health = Stats.calculateHealth(this.character.bonuses);
            container.innerHTML = this.renderCompletedStats();
            return;
        }

        // Render current assignment UI
        let html = '<div class="assigned-stats">';
        if (assigned.length > 0) {
            html += '<h4>Assigned Stats:</h4><div class="stat-list">';
            assigned.forEach(({name, value}) => {
                html += `<div class="stat-chip">${name}: ${value}</div>`;
            });
            html += '</div>';
        }
        html += '</div>';

        html += `
            <div class="roll-input-section">
                <p class="instruction">Roll <strong>3d6</strong>, add them up, and enter the total:</p>
                <input type="number" id="stat-roll-value" min="3" max="18" placeholder="3-18" class="roll-input">
            </div>
            <div class="stat-buttons">
                <p class="instruction">Assign to:</p>
                <div class="button-grid" id="stat-button-grid">
        `;

        unassigned.forEach(name => {
            html += `<button class="stat-btn" data-stat="${name}" disabled>${name}</button>`;
        });

        html += '</div></div>';

        container.innerHTML = html;

        // Re-bind the roll input
        const rollInput = document.getElementById('stat-roll-value');
        if (rollInput) {
            rollInput.addEventListener('input', () => this.updateStatButtons());
            rollInput.focus();
        }

        // Bind stat buttons
        document.querySelectorAll('.stat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const statName = e.target.dataset.stat;
                this.assignStat(statName);
            });
        });
    },

    // Update stat buttons based on roll input
    updateStatButtons() {
        const rollInput = document.getElementById('stat-roll-value');
        const value = rollInput ? rollInput.value : '';
        const isValid = Stats.isValidRoll(value);

        document.querySelectorAll('.stat-btn').forEach(btn => {
            btn.disabled = !isValid;
        });
    },

    // Assign a stat value
    assignStat(statName) {
        const rollInput = document.getElementById('stat-roll-value');
        const value = parseInt(rollInput.value, 10);

        if (!Stats.isValidRoll(value)) return;

        this.character.stats[statName] = value;

        // Re-render
        this.renderStatAssignment();
    },

    // Render completed stats with bonuses
    renderCompletedStats() {
        let html = '<h4>Your Stats:</h4><div class="completed-stats">';

        STAT_NAMES.forEach(name => {
            const value = this.character.stats[name];
            const bonus = this.character.bonuses[name];
            const bonusStr = Stats.formatBonus(bonus);
            const bonusClass = bonus > 0 ? 'positive' : (bonus < 0 ? 'negative' : 'neutral');

            html += `
                <div class="stat-complete">
                    <span class="stat-name">${name}</span>
                    <span class="stat-value">${value}</span>
                    <span class="stat-bonus ${bonusClass}">(${bonusStr})</span>
                </div>
            `;
        });

        html += '</div>';
        html += `<p class="health-preview">Health: ${this.character.health} hearts</p>`;
        html += '<button class="btn-secondary" onclick="App.resetStats()">Reroll Stats</button>';

        return html;
    },

    // Reset stats to start over
    resetStats() {
        this.character.stats = Stats.createEmpty();
        this.character.bonuses = null;
        this.renderStatAssignment();
    },

    // Update the sentence preview
    updateSentencePreview() {
        const preview = document.getElementById('sentence-preview');
        if (!preview) return;

        const { name, ancestry, background, talent, flaw } = this.character;
        let sentence = `"I am a${ancestry ? ' ' + ancestry : ''} ${background || '[background]'} who is good at ${talent || '[talent]'}, BUT ${flaw || '[flaw]'}."`;

        preview.textContent = sentence;
    },

    // Toggle spell selection visibility
    toggleSpellSelection(show) {
        const spellSection = document.getElementById('spell-selection');
        if (spellSection) {
            spellSection.style.display = show ? 'block' : 'none';
        }
        if (!show) {
            this.character.spells = [];
        }
    },

    // Render spell selection
    renderSpellSelection() {
        const container = document.getElementById('spell-list');
        if (!container) return;

        let html = '';
        SPELLS.forEach(spell => {
            const isSelected = this.character.spells.includes(spell.id);
            html += `
                <label class="spell-option ${isSelected ? 'selected' : ''}">
                    <input type="checkbox" value="${spell.id}"
                        ${isSelected ? 'checked' : ''}
                        ${!isSelected && this.character.spells.length >= 3 ? 'disabled' : ''}>
                    <span class="spell-name">${spell.name}</span>
                    <span class="spell-effect">${spell.effect}</span>
                </label>
            `;
        });

        container.innerHTML = html;

        // Bind checkboxes
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => this.toggleSpell(e.target.value, e.target.checked));
        });

        // Update count
        const countDisplay = document.getElementById('spell-count');
        if (countDisplay) {
            countDisplay.textContent = `${this.character.spells.length}/3 selected`;
        }
    },

    // Toggle a spell selection
    toggleSpell(spellId, selected) {
        if (selected) {
            if (this.character.spells.length < 3) {
                this.character.spells.push(spellId);
            }
        } else {
            this.character.spells = this.character.spells.filter(id => id !== spellId);
        }
        this.renderSpellSelection();
    },

    // Render gear step
    renderGearStep() {
        this.updateCoinsDisplay();
    },

    // Update coins display
    updateCoinsDisplay() {
        const display = document.getElementById('coins-display');
        if (display) {
            display.textContent = `${this.character.coins} coins`;
        }
    },

    // Render final summary
    renderSummary() {
        const container = document.getElementById('character-summary');
        if (!container) return;

        const { name, ancestry, background, talent, flaw, stats, bonuses, spells, health, coins, gear } = this.character;

        // Build the sentence
        const sentence = `I am a ${ancestry} ${background} who is good at ${talent}, BUT ${flaw}.`;

        // Get spell names
        const spellNames = spells.map(id => {
            const spell = SPELLS.find(s => s.id === id);
            return spell ? spell.name : id;
        });

        let html = `
            <div class="summary-section">
                <h3>${name}</h3>
                <p class="character-sentence">${sentence}</p>
            </div>

            <div class="summary-section">
                <h4>Stats</h4>
                <div class="summary-stats">
        `;

        STAT_NAMES.forEach(statName => {
            const value = stats[statName];
            const bonus = bonuses[statName];
            const bonusStr = Stats.formatBonus(bonus);
            const bonusClass = bonus > 0 ? 'positive' : (bonus < 0 ? 'negative' : 'neutral');

            html += `
                <div class="summary-stat">
                    <span class="stat-name">${statName}</span>
                    <span class="stat-value">${value}</span>
                    <span class="stat-bonus ${bonusClass}">${bonusStr}</span>
                </div>
            `;
        });

        html += `
                </div>
            </div>

            <div class="summary-section">
                <h4>Health</h4>
                <p>${health} hearts</p>
            </div>
        `;

        if (spellNames.length > 0) {
            html += `
                <div class="summary-section">
                    <h4>Spells</h4>
                    <p>${spellNames.join(', ')}</p>
                </div>
            `;
        }

        html += `
            <div class="summary-section">
                <h4>Gear</h4>
                <ul>
                    ${gear.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <p><strong>Coins:</strong> ${coins}</p>
            </div>
        `;

        container.innerHTML = html;
    },

    // Save character to localStorage
    saveCharacter() {
        const charData = { ...this.character };

        // Check if character with same name already exists
        const existing = Storage.findByName(charData.name);

        if (existing) {
            const update = confirm(
                `A character named "${charData.name}" already exists.\n\n` +
                `Click OK to update the existing character, or Cancel to save as a new character.`
            );

            if (update) {
                Storage.updateCharacter(existing.id, charData);
                alert('Character updated!');
            } else {
                Storage.saveCharacter(charData);
                alert('New character saved!');
            }
        } else {
            Storage.saveCharacter(charData);
            alert('Character saved!');
        }

        this.loadSavedCharacters();
    },

    // Load and display saved characters
    loadSavedCharacters() {
        const container = document.getElementById('saved-characters');
        if (!container) return;

        const characters = Storage.getCharacters();
        if (characters.length === 0) {
            container.innerHTML = '<p class="no-saves">No saved characters yet.</p>';
            return;
        }

        let html = '<h4>Saved Characters</h4><ul class="saved-list">';
        characters.forEach(char => {
            html += `
                <li>
                    <span class="saved-name">${char.name}</span>
                    <span class="saved-ancestry">${char.ancestry} ${char.background}</span>
                    <button class="btn-small" onclick="App.loadCharacter(${char.id})">Load</button>
                    <button class="btn-small btn-danger" onclick="App.deleteCharacter(${char.id})">Delete</button>
                </li>
            `;
        });
        html += '</ul>';

        container.innerHTML = html;
    },

    // Load a saved character
    loadCharacter(id) {
        const char = Storage.getCharacter(id);
        if (char) {
            this.character = { ...char };
            this.showStep(8); // Go to summary
        }
    },

    // Delete a saved character
    deleteCharacter(id) {
        if (confirm('Delete this character?')) {
            Storage.deleteCharacter(id);
            this.loadSavedCharacters();
        }
    },

    // Restart character creation
    restart() {
        this.character = {
            name: '',
            ancestry: '',
            background: '',
            talent: '',
            flaw: '',
            stats: Stats.createEmpty(),
            bonuses: null,
            spells: [],
            useMagic: false,
            coins: 0,
            gear: ['Clothing (0 armor)', 'Shabby weapon (+0 damage)'],
            health: 3
        };

        // Clear form inputs
        document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
            input.value = '';
        });
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        this.showStep(0);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
