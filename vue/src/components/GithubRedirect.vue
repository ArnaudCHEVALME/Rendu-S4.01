<template>
  <div>Loading...</div>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    const code = new URLSearchParams(window.location.search).get('code');
    console.log(code)
    axios.post('http://localhost:3000/auth/github/callback', { code })
        .then(response => {
          localStorage.setItem("user", JSON.stringify(response.data))
          window.location.href = '/artiste';
        })
        .catch(error => {
          console.error(error);
          window.location.href = '/login';
        });
  }
}
</script>
