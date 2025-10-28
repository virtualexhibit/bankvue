<template>
  <button
    :type="merged.directives?.type || 'button'"
    :class="merged.directives?.class"
    @click="$emit('action', merged.on?.action)"
  >
    {{ merged.display?.text }}
  </button>
</template>

<script>
export default {
  name: "CommonButtons",
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    merged() {
      return {
        directives: this.item.directives || {},
        display: this.item.display || {},
        on: this.item.on || {},
      };
    },
  },
};
</script>
