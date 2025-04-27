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
    <q-table
      title="Treats"
      :rows="items"
      :columns="columns"
      :loading="loading"
      row-key="name">
      <!--Custom for header section-->
      <template v-slot:header-selection="scope">
        <q-checkbox v-model="scope.selected" />
      </template>
      <!-- Actions column -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            title="Edit"
            icon="edit"
            @click="showAddDialog = true" />
          <q-btn
            flat
            round
            color="negative"
            title="Delete"
            icon="delete"
            @click="showAddDialog = true" />
        </q-td>
      </template>
      <!-- Loading state -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </template>
      <!-- <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <div>ADD-EDit</div>
          </q-card-section>
          <q-card-actions align="right"> </q-card-actions>
        </q-card>
      </q-dialog> -->
    </q-table>
    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">Edit - Delete</div>
        </q-card-section>
        <q-card-actions class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div>
              <q-input
                label="Reset"
                lazy-rules
                :rules="[
                  (val) => !!val || 'Title is required',
                  (val) =>
                    val.length <= 10 || 'Title must be less than 100 chars',
                ]" />
              <q-select
                v-model="model"
                :options="options"
                label="User"
                :rules="[(val) => !!val || 'User is required']" />
              <q-toggle label="Complete" />
            </div>
          </q-form>
        </q-card-actions>
        <q-card-actions align="right">
          <q-btn flat round color="primary" label="Cancel" v-close-popup />
          <q-btn label="Save" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteConfirm">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
          <div>Are you sure you want to delete this item?</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Delete" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      slected: [],
      showAddDialog: false,
      showDeleteConfirm: false,
    };
  },
  computed: {
    items() {
      return this.$store.getters.allItems;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
  },
  created() {
    this.$store.dispatch("fetchItems");
  },
};
</script>
<style scope></style>
