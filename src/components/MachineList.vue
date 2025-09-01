<template>
  <div class="machines-section">
    <h3>Available Machines</h3>
    <div
        v-for="machine in machines"
        :key="machine.id"
        class="machine-item"
        :class="{ active: selectedMachine?.id === machine.id }"
        @click="selectMachine(machine)"
    >
      <div class="machine-name">{{ machine.name }}</div>
      <div class="machine-id">ID: {{ machine.id }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  machines: {
    type: Array,
    required: true
  },
  selectedMachine: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:selectedMachine']);

const selectMachine = (machine) => {
  emit('update:selectedMachine', machine);
};
</script>

<style scoped>
.machines-section h3 {
  color: var(--surface-700);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.machine-item {
  background: white;
  border: 2px solid var(--surface-200);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.machine-item:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.machine-item.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.machine-name {
  font-weight: 600;
  color: var(--surface-800);
  margin-bottom: 0.25rem;
}

.machine-id {
  font-size: 0.875rem;
  color: var(--surface-500);
}
</style>