<template>
  <div class="preview_wrapper">
    <Image :url="props.url" :name="props.name" v-if="type === 'image'"/>
    <Office :url="props.url" :ext="props.ext" v-else-if="type === 'office'" />
    <Markdown :url="props.url" v-else-if="type === 'md'" />
    <Code :url="props.url" :ext="props.ext" v-else-if="type === 'code'" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Image from './filetype/Image.vue';
import Office from './filetype/Office.vue';
import Markdown from './filetype/Markdown.vue';
import Code from './filetype/Code.vue';

const props = defineProps<{
  url: string,
  ext: string,
  name: string
}>();

const codeArr = [
    "1C", "ABAP", "Ada", "Apache", "AppleScript", "Arduino", "ARMAssembly", "AVRAssembly",
    "ActionScript", "AutoHotkey", "AutoIt", "Awk", "Bash", "Basic", "C", "C#", "C++",
    "CMake", "Clojure", "CoffeeScript", "Crystal", "CSS", "D", "Dart", "Delphi", "Diff",
    "Django", "DNSZone", "Dockerfile", "DOS", "Elixir", "Elm", "Erlang", "Fortran", "F#",
    "Go", "GraphQL", "Groovy", "HTML", "HTTP", "Haskell", "Ini", "Java", "JavaScript",
    "JSON", "Julia", "Kotlin", "LaTeX", "Less", "Lisp", "Lua", "Makefile", "Markdown",
    "Matlab", "Nginx", "Objective-C", "OCaml", "Perl", "PHP", "Plaintext", "PowerShell",
    "Prolog", "Properties", "Python", "R", "Ruby", "Rust", "Scala", "Scheme", "SCSS",
    "ShellSession", "Smalltalk", "SQL", "Swift", "Tcl", "TOML", "TypeScript", "VBScript",
    "VisualBasic.NET", "XML", "YAML", "TS"
];

const type = computed(() => {
  if(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(props.ext)) {
    return 'image';
  } else if(['docx', 'pptx', 'pdf', 'xlsx'].includes(props.ext)) {
    return 'office';
  } else if(props.ext === 'md') {
    return 'md';
  } else if(codeArr.includes(props.ext.toUpperCase())) {
    return 'code';
  }
  else {
    return '';
  }
})
</script>
