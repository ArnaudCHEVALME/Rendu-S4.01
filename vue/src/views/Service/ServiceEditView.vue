<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols = "12">
          <v-card>
            <v-card-title>
              <h1 class="display-1">Modifier une service</h1>
            </v-card-title>
            <v-card-text>
              <v-text-field
                  v-model="service.libelle"
                  label="Nom de la service"
                  required
              ></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="editService">Modifier</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {get, put} from "@/services/axios.service.js";
export default {
  name: "ServiceEditView",
  data: () => {
    return {
      service: {
        libelle: "",
      }
    }
  },
  methods: {
    async getService() {
      await get('service/' + this.$route.params.id)
        .then((response) => {
          this.service = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editService() {
      put('service/' + this.$route.params.id, this.service)
        .then(() => {
          this.$store.dispatch('getServices');
          this.$store.dispatch('getStands');
          this.$router.push('/service');
        })
          .catch(error => {
            alert(error.response.data.message);
          });
    }
  },
  mounted() {
    this.getService();
  },

}
</script>

<style scoped>

</style>