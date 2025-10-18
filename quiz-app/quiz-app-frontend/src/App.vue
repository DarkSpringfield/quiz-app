<template>
    <div class="min-h-screen bg-brand-grayDark text-white">
      <AppHeader />
      <router-view />
    </div>
</template>

<script setup lang="ts">
import AppHeader from './components/Header.vue'
</script>

<style>
</style>