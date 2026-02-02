<template>
  <div class="office_wrapper">
    <vue-office-docx :src="props.url" v-if="props.ext === 'docx'"/>
    <vue-office-pdf :src="props.url" v-else-if="props.ext === 'pdf'"/>
    <vue-office-excel :src="props.url" v-else-if="props.ext === 'xlsx'"/>
    <vue-office-pptx :src="props.url" v-else-if="props.ext === 'pptx'"/></div>
</template>

<script setup lang="ts">
import VueOfficeDocx from '@vue-office/docx'
import VueOfficePdf from '@vue-office/pdf'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePptx from '@vue-office/pptx'
import '@vue-office/docx/lib/index.css'

const props = defineProps<{
  url: string,
  ext: string
}>();

</script>