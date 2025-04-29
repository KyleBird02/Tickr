<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <img
      class="landing-background"
      src="../assets/background.png"
    />
    <div class="max-w-6xl mx-auto px-4 md:px-8 z-100">
      <h2 class="text-4xl md:text-5xl text-center mb-16 promo-text">
        The App Wall Street Uses
      </h2>
    </div>
    
    <router-link 
      v-if="!isLoggedIn" 
      to="/login" 
      class="try-button"
    >
      Try It Out
    </router-link>
  </div>
</template>
<style scoped>
.promo-text{
  font-famil: 'Montserrat'
}
  .landing-background {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .try-button { /* blue-500 */
    color: black;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 3px solid black;
    width: 18rem;
    text-align: center;
    z-index: 100;
    transition: background-color 0.3s ease;
  }

  .try-button:hover {
    background-color: white; /* blue-600 */
  }
</style>
