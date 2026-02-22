<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 bg-gray-900">
    <div class="text-center max-w-md">
      <div class="text-6xl mb-6">404</div>
      <h1 class="text-2xl font-bold text-gray-800 text-gray-200 mb-4">页面未找到</h1>
      <p class="text-gray-600 text-gray-400 mb-8">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <router-link 
        to="/" 
        class="inline-block px-6 py-3 bg-blue-100 bg-blue-900 text-blue-600 text-blue-400 rounded-lg font-medium hover:bg-blue-200 hover:bg-blue-800 transition-colors"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 404页面组件
</script>
