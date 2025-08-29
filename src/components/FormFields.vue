<template>
  <div class="config-form">
    <!-- Product Type -->
    <div class="form-group">
      <label>Product Type</label>
      <Select
          v-model="config.productType"
          :options="productTypes"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Product Type (A-F)"
          class="w-full"
      />
    </div>

    <!-- Piece Count -->
    <div class="form-group">
      <label>Piece Count (1 - 9999)</label>
      <InputNumber
          v-model="config.pieceCount"
          :min="1"
          :max="9999"
          placeholder="Enter piece count"
          class="w-full"
      />
    </div>

    <!-- Tolerance -->
    <div class="form-group">
      <label>Tolerance ({{ config.tolerance }})</label>
      <Slider
          v-model="config.tolerance"
          :min="0.01"
          :max="0.05"
          :step="0.001"
          class="w-full"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:config'])

const productTypes = ref([
  { label: 'Type A - Standard', value: 'A' },
  { label: 'Type B - Premium', value: 'B' },
  { label: 'Type C - Heavy Duty', value: 'C' },
  { label: 'Type D - Precision', value: 'D' },
  { label: 'Type E - Custom', value: 'E' },
  { label: 'Type F - Experimental', value: 'F' }
])

watch(() => props.config, (newConfig) => {
  emit('update:config', { ...newConfig })
}, { deep: true });

</script>

<style scoped>

</style>