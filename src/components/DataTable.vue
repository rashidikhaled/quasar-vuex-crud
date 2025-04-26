<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md q-gutter-md row items-center">
      <!-- Toolbar with bulk actions -->
      <div class="row">
        <q-btn color="primary" label="Add Item" icon="add" />
        <q-btn
          color="negative"
          icon="delete"
          label="Delete Selected"
          class="q-ml-sm" />
        <q-btn
          color="secondary"
          icon="file_download"
          label="Export"
          class="q-ml-sm" />
      </div>
      <!-- Filter Controls-->
      <div class="col-auto">
        <q-btn-dropdown color="grey-7" label="Filters" icon="filter_list">
          <q-card class="my-card">
            <q-card-section>
              <q-input dense clearable type="text" label="Title Contains" />
              <q-select label="Completion Status" dense emit-value clearable />
            </q-card-section>
            <q-card-section>
              <q-btn flat label="Reset" />
              <q-btn flat color="primary" label="Apply" />
            </q-card-section>
          </q-card>
        </q-btn-dropdown>
      </div>
    </div>
    <!--Dta table-->
    <q-table title="Treats" :rows="rows" :columns="columns" row-key="name" />
  </q-page>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        { name: "id", label: "ID", field: "id", align: "left", sortable: true },
        {
          name: "title",
          label: "Title",
          field: "title",
          align: "left",
          sortable: true,
        },
        {
          name: "completed",
          label: "Completed",
          field: "completed",
          align: "left",
          sortable: true,
        },
        { name: "actions", label: "Actions", align: "right" },
      ],
      rows: [],
    };
  },
};
</script>
<style lang=""></style>
