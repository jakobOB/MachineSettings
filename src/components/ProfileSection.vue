<template>
  <div class="profile-section">
    <h3>Configuration Profile</h3>
    <div class="form-group">
      <label>Select Profile</label>
      <Select
          v-model="activeProfile"
          :options="profiles"
          optionLabel="name"
          optionValue="id"
          placeholder="Choose Profile"
          @change="onProfileChange"
          class="w-full"
          style="margin-bottom: 1rem"
      >
        <template #option="{ option }">
          <div class="option-row">
            <div class="option-text">{{ option.name }}</div>
            <Button
                v-if="option.id !== 'default'"
                icon="pi pi-trash"
                class="p-button-text p-button-danger p-button-sm"
                style="color: red"
                @click="deleteProfile(option)" />
          </div>
        </template>
      </Select>
      <Button
          label="Create New Profile"
          icon="pi pi-plus"
          class="p-button-sm p-button-outlined mt-2 w-full"
          @click="createNewProfile"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  profiles: {
    type: Array,
    required: true
  },
  selectedProfile: {
    type: String,
    required: false
  }
});

const activeProfile = ref(props.selectedProfile || null);

const emit = defineEmits(['update:selectedProfile', 'deleteProfile', 'createNewProfile']);

const onProfileChange = (value) => {
  emit('update:selectedProfile', value.value);
};

const deleteProfile = (profile) => {
  emit('deleteProfile', profile);
};

const createNewProfile = () => {
  emit('createNewProfile');
};

watch(() => props.selectedProfile, () => {
  activeProfile.value = props.selectedProfile;
})
</script>

<style scoped>
.option-row {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* text left, button right */
  width: 100%;
  gap: .5rem;
}
.option-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.form-group {
  margin-bottom: 1rem;
}
</style>