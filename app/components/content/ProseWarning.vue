<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <OrgCallout kind="warning" :title="title"><slot mdc-unwrap="p" /></OrgCallout>
</template>
