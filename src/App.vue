<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar CRUD with vuex</q-toolbar-title>
        <q-space />
        <q-btn flat round icon="help" @click="showHelp = true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <data-table />
    </q-page-container>

    <q-dialog v-model="showHelp">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Help</div>
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>
<script>
import DataTable from "./components/DataTable.vue";
export default {
  name: "App",
  components: { DataTable },
  data() {
    return {
      showHelp: false,
    };
  },
};
</script>
<style lang=""></style>
