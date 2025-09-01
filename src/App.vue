<template>
  <div class="main-container">
    <!-- Header -->
    <div class="header">
      <h2>Machine Configuration System</h2>
      <p>Configure your machines with precision and reliability</p>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Profile Section -->
        <ProfileSection
          :profiles="profiles"
          v-model:selectedProfile="selectedProfile"
          @deleteProfile="deleteProfile"
          @createNewProfile="createNewProfile"
        />

        <!-- Divider -->
        <Divider/>

        <!-- Machines List -->
        <MachineList
          :machines="machines"
          :selectedMachine="selectedMachine"
          @update:selectedMachine="selectMachine" />
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <div v-if="selectedMachine" class="config-panel">
          <h2>Configure {{ selectedMachine.name }}</h2>

          <!-- Form fields -->
          <FormFields :config="config" />

          <!-- Action Buttons -->
          <div class="config-actions">
            <Button
                label="Save Configuration"
                icon="pi pi-check"
                @click="saveConfiguration"
                :disabled="!isConfigValid"
            />
            <Button
                label="Reset"
                icon="pi pi-refresh"
                class="p-button-secondary"
                @click="resetConfiguration"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <i class="pi pi-cog"></i>
          <h3>No Machine Selected</h3>
          <p>Please select a machine from the sidebar to configure its settings.</p>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>

<script setup>
import {ref, computed, watch, onBeforeMount} from 'vue'
import { useToast } from 'primevue/usetoast'
import {useConfigStore} from "./services/storageService.js";
import FormFields from "./components/FormFields.vue";
import ProfileSection from "./components/ProfileSection.vue";
import MachineList from "./components/MachineList.vue";

const toast = useToast()
const configStore = useConfigStore()

//------------------------------------------------------------
// Reactive data
const selectedProfile = ref('default')
const selectedMachine = ref(null)
const config = ref({
  productType: null,
  pieceCount: 0,
  tolerance: 0.03
})

// Static data
const profiles = ref([])
const machines = ref([])

// Computed properties
const isConfigValid = computed(() => {
  return config.value.productType &&
      config.value.pieceCount > 0 &&
      config.value.tolerance >= 0.01 &&
      config.value.tolerance <= 0.05
})

//------------------------------------------------------------
// Methods
const selectMachine = (machine) => {
  selectedMachine.value = machine
}

// Create a new configuration profile
const createNewProfile = () => {
  const profileName = prompt('Enter new profile name:')

  if (profileName && profileName.trim()) {
    const newProfile = { id:  `profile_${Date.now()}`, name: profileName.trim() }
    configStore.addProfile(newProfile)
    profiles.value = configStore.profiles

    toast.add({
      severity: 'success',
      summary: 'Profile Created',
      detail: `New profile "${profileName}" has been created`,
      life: 3000
    })

    selectedProfile.value = newProfile.id
  }
}

// Delete an existing configuration profile
const deleteProfile = (profile) => {
  if (confirm(`Are you sure you want to delete the profile "${profile.name}"? This action cannot be undone.`)) {
    configStore.removeProfile(profile.id)
    profiles.value = configStore.profiles

    // If the deleted profile was selected, revert to default
    if (selectedProfile.value === profile.id) {
      selectedProfile.value = 'default'
      loadMachineConfig()
    }

    toast.add({
      severity: 'success',
      summary: 'Profile Deleted',
      detail: `Profile "${profile.name}" has been deleted`,
      life: 3000
    })
  }
}

// Save configuration for selected machine and profile
const saveConfiguration = () => {
  if (!isConfigValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Invalid Configuration',
      detail: 'Please fill all required fields correctly',
      life: 3000
    })
    return
  }

  configStore.updateSettings(selectedProfile.value, selectedMachine.value.id, { ...config.value })

  toast.add({
    severity: 'success',
    summary: 'Configuration Saved',
    detail: `Settings for ${selectedMachine.value.name} have been saved`,
    life: 3000
  })
}

// Load configuration for selected machine and profile
const loadMachineConfig = () => {
  if (!selectedMachine.value || !selectedProfile.value) return

  try {
    const configData = configStore.getProfileSettings(selectedProfile.value, selectedMachine.value.id)
    config.value = { ...configData }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Load Error',
      detail: 'Failed to load machine configuration',
      life: 3000
    })
  }
}

// Reset configuration to defaults for selected machine and profile
const resetConfiguration = () => {
  if (selectedMachine.value) {
    config.value = {
      productType: 'A',
      pieceCount: 1,
      tolerance: 0.03
    }

    configStore.resetSettings(selectedProfile.value, selectedMachine.value.id)
  }
}

//------------------------------------------------------------
// Watchers
watch(() => selectedMachine.value, (newMachine) => {
  if (newMachine) {
    loadMachineConfig()
  }
})

watch(() => selectedProfile.value, () => {
  loadMachineConfig()
})
// Lifecycle
onBeforeMount(() => {
  try{
    configStore.loadSettings()
    machines.value = configStore.machines
    profiles.value = configStore.profiles
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Initialization Error',
      detail: 'Failed to load initial configuration data',
      life: 3000
    })
  }

  // Auto-select first machine for better UX
  if (machines.value.length > 0) {
    selectMachine(machines.value[0])
  }
})
</script>

<style scoped>
.form-group label {
  display: block;
  font-weight: 600;
  color: var(--surface-700);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

select, input, button {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--surface-200);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

select:hover, input:hover {
  border-color: var(--primary-300);
}

select:focus, input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.2);
}

button {
  background: var(--primary-500);
  color: white;
  border: 2px solid var(--primary-500);
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.config-panel h2 {
  color: var(--surface-800);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.config-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-200);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--surface-500);
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
</style>