<!-- src/components/AppHeader.vue -->
<template>
  <header class="w-full bg-brand-black text-white shadow">
    <div class="w-full px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo / Startseite -->
        <router-link to="/" class="text-xl font-bold text-brand-violet hover:text-brand-violetDark">
          QuizApp
        </router-link>

        <!-- Rechts: Profilbild + Dropdown -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="toggle()"
            class="flex items-center focus:outline-none"
            :aria-expanded="dropdownOpen.toString()"
            aria-haspopup="true"
            aria-label="Profil Menü"
            type="button"
          >
            <img
              class="h-10 w-10 rounded-full border-2 border-brand-violet"
              src="https://i.pravatar.cc/40"
              alt="Profilbild"
            />
          </button>

          <transition
            enter-from-class="opacity-0 scale-95"
            enter-active-class="transition ease-out duration-100"
            enter-to-class="opacity-100 scale-100"
            leave-from-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-10"
              role="menu"
              aria-orientation="vertical"
            >
              <router-link
                to="/admin"
                class="block px-4 py-2 text-sm hover:bg-brand-violetDark"
                role="menuitem"
                @click="close()"
              >
                Admin
              </router-link>

              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm hover:bg-brand-violetDark"
                role="menuitem"
                @click="close()"
              >
                Profil
              </router-link>

              <button
                @click="onLogout"
                class="block w-full text-left px-4 py-2 text-sm hover:bg-brand-violetDark"
                role="menuitem"
                type="button"
              >
                Abmelden
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside, useToggle } from '@vueuse/core'

const router = useRouter()

// Toggle-Logik
const dropdownOpen = ref(false)
const toggle = useToggle(dropdownOpen)
const close = () => (dropdownOpen.value = false)

const dropdownRef = ref<HTMLElement | null>(null)
onClickOutside(dropdownRef, () => {
  close()
})

function onLogout() {
  close()
  // hier deine Logout-Logik
  router.push('/')
}
</script>