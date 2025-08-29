import { defineStore } from 'pinia'

const STORAGE_KEY = 'machine-config-v1'
const DEFAULT_ENTRY = { productType: "A", pieceCount: 1, tolerance: 0.03 }
const DEFAULT_PROFILE = Object.freeze({ id: 'default', name: 'Default' });
const DEFAULT_MACHINES = Object.freeze([
    { id: 'm-001', name: 'Machine 001' },
    { id: 'm-002', name: 'Machine 002' },
    { id: 'm-003', name: 'Machine 003' },
    { id: 'm-004', name: 'Machine 004' }
]);

export const useConfigStore = defineStore('config', {
    state: () => ({
        profiles: [],
        machines: [...DEFAULT_MACHINES],
        settings: {},
    }),
    actions: {
        // Initialize with default profile and settings
        initialize() {
            this.profiles = [ { ...DEFAULT_PROFILE } ];
            // set for all machines the settings
            this.settings = {
                [this.profiles[0].id]: this.machines.reduce((acc, machine) => {
                    acc[machine.id] = { ...DEFAULT_ENTRY };
                    return acc;
                }, {})
            };

            this.saveSetting();
        },

        // Retrieve settings for a specific profile and machine
        getProfileSettings(profileId, machineId) {
            return this.settings[profileId]?.[machineId];
        },

        // Add a new profile with default settings for all machines
        addProfile(profile) {
            this.profiles.push(profile);
            // Initialize settings for the new profile
            this.settings[profile.id] = this.machines.reduce((acc, machine) => {
                acc[machine.id] = { ...DEFAULT_ENTRY };
                return acc;
            }, {});

            this.saveSetting()
        },

        // Update settings for a specific profile and machine
        updateSettings(profileId, machineId, newSettings) {
            try {
                this.settings[profileId][machineId] = { ...newSettings };
                this.saveSetting()
            } catch (error) {
                throw new Error('Failed to update settings: ' + error.message)
            }
        },

        saveSetting() {
            // Save the whole dataset to localStorage
            const payload = {
                profiles: this.profiles,
                settings: this.settings
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        },

        loadSettings() {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return this.initialize()

            try {
                const data = JSON.parse(raw)

                if (Array.isArray(data.profiles) && data.profiles.length) this.profiles = data.profiles
                if (data.settings && typeof data.settings === 'object') this.settings = data.settings
            } catch (e) {
                throw new Error('Failed to parse stored settings: ' + e.message)
            }
        },

        resetSettings(profileId, machineId) {
            this.settings[profileId][machineId] = { ...DEFAULT_ENTRY }
            this.saveSetting()
        },

        clearAll() {
            localStorage.removeItem(STORAGE_KEY);
            this.loadSettings()
        }
    }
})