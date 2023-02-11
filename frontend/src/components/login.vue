<script setup>
    import axios from 'axios';
</script>
<template>
  <div class="d-flex align-items-center" >
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mx-auto">
          <div class="card mt-5">
            <div class="card-header">
              <h3 class="text-center">Login</h3>
            </div>
            <div class="card-body">
              <form>
                <div class="form-group">
                  <label for="keyInput">Security Key</label>
                  <input v-model="key" type="password" class="form-control" id="keyInput" placeholder="Enter security key">
                </div>
                <br>
                <button @click.prevent="submit" class="btn btn-primary btn-block">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: ''
    };
  },
  methods: {
    submit() {
      // Check if the provided key is correct
      if (this.key === '77812') {
        // Redirect to the main page if the key is correct
        this.$router.push('/homeiswhatsomethingcantcontrols');
      } else {
        // Show an error message if the key is incorrect
        alert('Incorrect security key!');
      }
    }
  }
};
</script>

<style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
