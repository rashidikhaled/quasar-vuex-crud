<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md q-gutter-md row items-center justify-between">
      <!-- Toolbar with bulk actions -->
      <div class="row">
        <q-btn
          color="primary"
          label="Add Item"
          icon="add"
          @click="openAddDialog" />
        <q-btn
          color="negative"
          icon="delete"
          label="Delete Selected"
          class="q-ml-sm"
          :disable="!selected.length"
          @click="confirmBulkDelete" />
        <q-btn
          color="secondary"
          icon="file_download"
          label="Export"
          class="q-ml-sm"
          @click="exportItems" />
      </div>
      <!-- Filter Controls-->
      <div class="col-auto">
        <q-btn-dropdown color="grey-7" label="Filters" icon="filter_list">
          <q-card class="my-card" style="min-width: 300px">
            <q-card-section>
              <q-input
                v-model="filters.title"
                dense
                clearable
                type="text"
                label="Title Contains" />
              <q-select
                v-model="filters.completed"
                :options="completionOptions"
                label="Completion Status"
                dense
                emit-value
                clearable
                class="q-mt-sm" />
            </q-card-section>
            <q-card-section>
              <q-btn flat label="Reset" @click="resetFilters" />
              <q-btn flat color="primary" label="Apply" @click="applyFilters" />
            </q-card-section>
          </q-card>
        </q-btn-dropdown>
      </div>
    </div>
    <!--Data table-->
    <q-table
      title="Treats"
      :rows="filteredItems"
      :columns="columns"
      :loading="loading"
      row-key="id"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @request="onRequest">
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
            @click="openEditDialog(props.row)" />
          <q-btn
            flat
            round
            color="negative"
            title="Delete"
            icon="delete"
            @click="confirmDelete(props.row)" />
        </q-td>
      </template>
      <!-- Loading state -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </template>
    </q-table>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ isEditing ? "Edit Item" : "Add Item" }}</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              v-model="form.title"
              label="Title"
              :rules="[
                (val) => !!val || 'Title is required',
                (val) =>
                  val.length <= 100 || 'Title must be less than 100 chars',
              ]"
              lazy-rules />
            <q-select
              v-model="form.userId"
              :options="userOptions"
              label="User"
              :rules="[(val) => !!val || 'User is required']"
              emit-value
              map-options />
            <q-toggle v-model="form.completed" label="Completed" />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="Save"
            color="primary"
            @click="onSubmit"
            :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
          <div>
            Are you sure you want to delete
            {{ selected.length > 1 ? "these items" : "this item" }}?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            label="Delete"
            color="negative"
            @click="deleteItems"
            :loading="loading" />
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
      selected: [],
      showAddDialog: false,
      showDeleteConfirm: false,
      isEditing: false,
      currentItem: null,
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      filters: {
        title: "",
        completed: null,
      },
      form: {
        id: null,
        title: "",
        userId: null,
        completed: false,
      },
      userOptions: [
        { label: "User 1", value: 1 },
        { label: "User 2", value: 2 },
        { label: "User 3", value: 3 },
      ],
      completionOptions: [
        { label: "Completed", value: true },
        { label: "Not Completed", value: false },
      ],
    };
  },

  computed: {
    items() {
      return this.$store.getters.allItems;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    filteredItems() {
      let result = this.items;

      if (this.filters.title) {
        result = result.filter((item) =>
          item.title.toLowerCase().includes(this.filters.title.toLowerCase())
        );
      }

      if (this.filters.completed !== null) {
        result = result.filter(
          (item) => item.completed === this.filters.completed
        );
      }

      return result;
    },
  },

  methods: {
    openAddDialog() {
      this.isEditing = false;
      this.form = {
        id: null,
        title: "",
        userId: null,
        completed: false,
      };
      this.showAddDialog = true;
    },

    openEditDialog(item) {
      this.isEditing = true;
      this.currentItem = item;
      this.form = { ...item };
      this.showAddDialog = true;
    },

    async onSubmit() {
      try {
        if (this.isEditing) {
          await this.$store.dispatch("updateItem", {
            id: this.currentItem.id,
            updates: this.form,
          });
          this.$q.notify({
            color: "positive",
            message: "Item updated successfully",
          });
        } else {
          await this.$store.dispatch("addItem", this.form);
          this.$q.notify({
            color: "positive",
            message: "Item added successfully",
          });
        }
        this.showAddDialog = false;
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: error.message || "An error occurred",
        });
      }
    },

    onReset() {
      this.form = {
        id: null,
        title: "",
        userId: null,
        completed: false,
      };
    },

    confirmDelete(item) {
      this.selected = [item];
      this.showDeleteConfirm = true;
    },

    confirmBulkDelete() {
      this.showDeleteConfirm = true;
    },

    async deleteItems() {
      try {
        for (const item of this.selected) {
          await this.$store.dispatch("deleteItem", item.id);
        }
        this.$q.notify({
          color: "positive",
          message: "Items deleted successfully",
        });
        this.selected = [];
        this.showDeleteConfirm = false;
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: error.message || "An error occurred",
        });
      }
    },

    resetFilters() {
      this.filters = {
        title: "",
        completed: null,
      };
    },

    applyFilters() {
      // Filters are applied automatically through computed property
    },

    async exportItems() {
      try {
        const data = await this.$store.dispatch("exportItems");
        // Implement export logic here
        this.$q.notify({
          color: "positive",
          message: "Items exported successfully",
        });
      } catch (error) {
        this.$q.notify({
          color: "negative",
          message: error.message || "An error occurred",
        });
      }
    },

    async onRequest(props) {
      this.pagination = props.pagination;
      await this.$store.dispatch("fetchItems");
    },
  },

  created() {
    this.$store.dispatch("fetchItems");
  },
};
</script>

<style scoped>
.q-table__container {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
