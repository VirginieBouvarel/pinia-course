<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useProductStore } from "@/stores/ProductStore";
import { useCartStore } from "@/stores/CartStore";
import { ref, reactive } from "vue";

const productStore = useProductStore();
const cartStore = useCartStore();

cartStore.$subscribe((mutation, state) => {
  console.log(mutation);
  if (!manualEditingHistory.value) {
    history.push(JSON.stringify(state));
    future.splice(0, future.length);
  }
});
cartStore.$onAction(({ name, args, after, onError }) => {
  if (name === "addItems") {
    console.log("before");
    after(() => console.log(args[0]));
    onError((error) => console.log("Action error: ", error.message));
  }
});

const history = reactive([]);
const future = reactive([]);

const manualEditingHistory = ref(false);
history.push(JSON.stringify(cartStore.$state));

const undo = () => {
  if (history.length === 1) return;
  manualEditingHistory.value = true;
  future.push(history.pop());
  cartStore.$state = JSON.parse(history.at(-1));
  manualEditingHistory.value = false;
};
const redo = () => {
  const latestState = future.pop();
  if (!latestState) return;
  manualEditingHistory.value = true;
  history.push(latestState);
  cartStore.$state = JSON.parse(latestState);
  manualEditingHistory.value = false;
};

productStore.fill();
</script>

<template>
  <div class="container">
    {{ history }}
    {{ future }}
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="undo">Undo</AppButton>
      <AppButton class="ml-2" @click="redo">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
