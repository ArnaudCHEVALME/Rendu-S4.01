<template>
  <v-container class="form-center">
    <v-form>
      <v-row>
        <v-col cols="12">
          <v-card-title>
            <h1 class="display-1">Ajouter une scène</h1>
          </v-card-title>
          <v-card-text>
            <v-text-field
                v-model="scene.libelle"
                label="Nom de la scène"
                required
            ></v-text-field>
            <v-select
                v-model="scene.typesceneId"
                :items="typescenesSelect"
                label="Type de scène"
                required
            ></v-select>
            <v-text-field
                v-model="scene.latitude"
                label="Latitude"
                required
            ></v-text-field>
            <v-text-field
                v-model="scene.longitude"
                label="Longitude"
                required
            ></v-text-field>
            <v-text-field
                v-if="scene.id_typescene === 2"
                  v-model="scene.jauge"
                  label="Jauge maximum"
                  required
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="addScene">Ajouter</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import {post} from "@/services/axios.service.js";
import {mapState} from "vuex";
export default {
  name: "SceneAddView",
  data: () => ({
    scene: {
      libelle: null,
      latitude: null,
      longitude: null,
      typesceneId: null,
      jauge: null
    }
  }),
  methods: {
    async addScene() {
      if (this.scene.id_typescene === 1) {
        this.scene.jauge = null;
      }
      this.scene.jauge = parseInt(this.scene.jauge);
      this.scene.latitude = parseFloat(this.scene.latitude);
      this.scene.longitude = parseFloat(this.scene.longitude);
      post(`/scene`, this.scene, {headers: {'saison': this.$store.state.saisonSelected}})
          .then(() => {
            this.$store.dispatch("getScenes");
            this.$router.push("/scene")
          })
          .catch(error => {
            alert(error.response.data.message);
          });
    },
  },
  computed: {
    ...mapState(["typescenes"]),
    typescenesSelect() {
      return this.typescenes.map(typescene => {
        return {
          text: typescene.libelle,
          value: typescene.id
        }
      })
    }
  },
  mounted() {
    if (this.$store.state.typescenes.length === 0) {
      this.$store.dispatch("getTypescenes");
    }
  },

}
</script>

<style scoped>
@import '@/../public/css/show.css';
</style>