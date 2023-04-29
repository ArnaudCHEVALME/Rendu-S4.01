<template>
  <div class="player-container">
    <h3>{{ this.blocked ? "Loading..." : "Music Player" }}</h3>
    <div class="player">
      <v-text-field
          label="Youtube ID"
          placeholder="jfKfPfyJRdk"
          outlined
          :disabled="this.blocked"
          v-model="videoId"
          :append-outer-icon="this.playing ? 'mdi-pause' : 'mdi-play'"
          @click:append-outer="toggle"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import {Howl} from 'howler';

export default {
  data() {
    return {
      playing: false,
      audio: null,
      videoId: 'jfKfPfyJRdk',
      blocked: false,
    };
  },
  methods: {
    toggle() {
      if (this.playing) {
        this.stop();
      } else {
        this.play();
      }
    },
    play() {
      if (!this.videoId) {
        return;
      }
      this.blocked = true;
      this.audio = new Howl({
        src: `http://localhost:3000/music/${this.videoId}`,
        html5: true,
        format: ['mp3'],
        buffer:4900,
        onplay: () => {
          this.playing = true;
          this.blocked = false;
        },
        onstop: () => {
          this.playing = false;
        },
        onend: () => {
          this.playing = false;
        },
        onloaderror: (err) => {
          console.error('Failed to load audio stream', err);
          this.blocked = false;
        },
      });
      this.audio.play();
    },
    stop() {
      this.audio.stop();
      this.playing = false;
    },
  },
};
</script>

<style>
.player {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 10px;
}

.player-container {
  background: #ff5252;
  border: #3c3c3c solid 1px;
  border-radius: 5px;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: -15px;
}
</style>