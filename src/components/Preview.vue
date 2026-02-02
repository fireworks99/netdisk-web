<template>
  <div class="preview_wrapper">
    <Image :url="props.url" :name="props.name" v-if="type === 'image'"/>
    <Office :url="props.url" :ext="props.ext" v-else-if="type === 'office'" />
    <Markdown :url="props.url" v-else-if="type === 'md'" />
    <Code :url="props.url" :ext="props.ext" v-else-if="type === 'code'" />
    <Video :url="props.url" :ext="props.ext" v-else-if="type === 'video'" />
    <Audio :url="props.url" :ext="props.ext" v-else-if="type === 'audio'" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
const Image = defineAsyncComponent(() =>
  import('@/components/filetype/Image.vue')
);
const Video = defineAsyncComponent(() =>
  import('@/components/filetype/Video.vue')
);
const Office = defineAsyncComponent(() =>
  import('@/components/filetype/Office.vue')
);
const Markdown = defineAsyncComponent(() =>
  import('@/components/filetype/Markdown.vue')
);
const Code = defineAsyncComponent(() =>
  import('@/components/filetype/Code.vue')
);
const Audio = defineAsyncComponent(() =>
  import('@/components/filetype/Audio.vue')
);

const props = defineProps<{
  url: string,
  ext: string,
  name: string
}>();

const codeArr = ["bsl","os","abap","adb","ads","conf","htaccess","applescript",
  "scpt","ino","s","asm","asm","inc","as","ahk","au3","awk","sh","bash","bas",
  "c","h","cs","cpp","cc","cxx","hpp","hh","hxx","MakeLists.txt","cmake","clj",
  "cljs","cljc","coffee","cr","css","d","dart","pas","dfm","fmx","diff","patch",
  "html","py","zone","dns","ockerfile","dockerfile","bat","cmd","ex","exs","elm",
  "erl","hrl","f","for","f90","f95","fs","fsi","fsx","go","graphql","gql","groovy",
  "gvy","html","htm","http","rest","hs","lhs","ini","cfg","conf","java","js","jsx",
  "mjs","json","jl","kt","kts","tex","sty","cls","less","lisp","lsp","cl","el",
  "lua","akefile","mk","mak","md","markdown","m","mat","conf","m","mm","h","ml",
  "mli","pl","pm","php","phtml","txt","text","ps1","psm1","psd1","pl","pro",
  "properties","py","pyw","pyx","r","R","rb","ruby","rs","scala","sc","scm","ss",
  "scss","sh-session","st","sql","swift","tcl","toml","ts","tsx","vbs","vb","xml",
  "xsl","xslt","xsd","yaml","yml","ts","tsx"];

const type = computed(() => {
  if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(props.ext)) {
    return 'image';
  } else if(['docx', 'pptx', 'pdf', 'xlsx'].includes(props.ext)) {
    return 'office';
  } else if(props.ext === 'md') {
    return 'md';
  } else if(codeArr.includes(props.ext)) {
    return 'code';
  } else if(['mp4', 'webm', 'ogv', 'mov'].includes(props.ext)) {
    return 'video';
  } else if(['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(props.ext)) {
    return 'audio';
  }
  else {
    return '';
  }
})
</script>
