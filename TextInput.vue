<template>
  <div class="input-wrapper">
    <label v-if="merged.display?.text">{{ merged.display.text }}</label>
    <input
      :value="modelValue"
      :type="merged.directives?.type"
      :class="merged.directives?.class"
      :placeholder="merged.directives?.placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "TextInput",
  props: {
    item: { type: Object, required: true },
    modelValue: { type: [String, Number], default: "" },
  },
  computed: {
    merged() {
      return {
        directives: this.item.directives || {},
        display: this.item.display || {},
      };
    },
  },
};
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
.input-wrapper label {
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
}
</style>
s