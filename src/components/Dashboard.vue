<template>
  <div class="dashboard">
    <b-navbar type="dark" variant="info" fixed="top">
        <h3>My Music Admin</h3>
    </b-navbar>
    <b-container>
        <b-col sm="12"> <AddStatus></AddStatus></b-col>
    </b-container>
  </div>
</template>


<script>
import AddStatus from "./AddStatus.vue";

export default {
  name: "Dashboard",
  props: [],
  data() {
    return {};
  },
  components: {
    AddStatus: AddStatus
  },
  methods: {
    init() {}
  }
};
</script>

<style>
.containerB {
  background: #0a182a;
}
</style>

