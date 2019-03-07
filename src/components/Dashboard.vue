<template>
  <div class="dashboard">
    <b-navbar type="dark" variant="info" fixed="top">
        <h3>My Music Admin</h3>
    </b-navbar>
    <div class="container">
          <AddStatus></AddStatus>
    </div>

  </div>
</template>


<script>
  import AddStatus from "./AddStatus.vue";
  
  export default {
    name: "Dashboard",
    props: [],
    data() {
        return {

        }
    },
    components: {
      AddStatus: AddStatus
    },
    methods: {
     
      init() {
        
      },
    
    }
  };
</script>

