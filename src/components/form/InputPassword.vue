<template>
  <q-input
    :type="hidden ? 'password' : 'text'"
  >
    <template #append>
      <q-icon
        :class="hidden ? 'fas fa-eye' : 'fas fa-eye-slash'"
        class="cursor-pointer"
        @click="hidden = !hidden"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const hidden = ref(true);
</script>
