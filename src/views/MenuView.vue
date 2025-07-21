<template>
  <div class="max-w-3xl mx-auto px-6 mt-4 noto-serif-tc-bold pb-10">
    <h2 class="text-2xl font-bold text-center mb-1">Komorebi 特製餐點 🍽️</h2>
    <p class="text-sm font-bold text-center mb-10 text-title">
      每一道都是一份陽光的心意 / A Taste of Sunlight in Every Dish ✨
    </p>

    <div v-for="(section, index) in menuSections" :key="index" class="mb-12">
      <h3 class="text-xl font-semibold border-b pb-1 mb-4">
        {{ section.title }}
      </h3>
      <ul class="space-y-3">
        <li v-for="item in section.items" :key="item.name">
          <div class="font-medium noto-serif-tc-bold mb-0.5">{{ item.name }}</div>
          <div class="text-title text-sm mb-2">{{ item.englishName }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const menuSections = [
  {
    title: '🍜 中式料理 | Chinese Dishes',
    items: [
      { name: '紅燒牛肉麵', englishName: 'Braised Beef Noodle Soup' },
      { name: '特製醬油蛋炒飯', englishName: 'Signature Soy Sauce Fried Rice with Egg' },
      { name: '鍋燒意麵', englishName: 'Nabeyaki egg noodles' },
      { name: '麻辣火鍋', englishName: 'Spicy Sichuan Hot Pot' },
    ],
  },
  {
    title: '🍝 西式料理 | Western Cuisine',
    items: [
      { name: '香料烤雞腿排', englishName: 'Herb-Grilled Chicken Thigh' },
      { name: '奶油野干貝燉飯', englishName: 'Creamy Scallop Risotto' },
      { name: '蛤蠣青醬義大利麵', englishName: 'Clam Pesto Spaghetti' },
    ],
  },
  {
    title: '🍰 甜點 | Desserts',
    items: [
      { name: '鮮奶麻糬', englishName: 'Fresh Milk Mochi' },
      { name: '提拉米蘇', englishName: 'Tiramisu' },
      { name: '焦糖烤布蕾', englishName: 'Caramel Crème Brûlée' },
      { name: '古早味綜合豆花', englishName: 'Traditional Tofu Pudding with Mixed Toppings' },
    ],
  },
  {
    title: '🍹 飲品 | Drinks',
    items: [
      { name: '蜂蜜柚子氣泡飲', englishName: 'Honey Yuzu Sparkling Drink' },
      { name: '伯爵鮮奶茶', englishName: 'Earl Grey Milk Tea' },
      { name: '特濃焦糖那堤', englishName: 'Rich Caramel Latte' },
    ],
  },
];
</script>
<style scoped>
h2,
h3,
span {
  font-family: 'Noto Serif TC', serif;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}
</style>
