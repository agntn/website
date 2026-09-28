<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <OrgCallout kind="tip" :title="title"><slot mdc-unwrap="p" /></OrgCallout>
</template>
