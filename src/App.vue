<template>
  <div id="app">
    <div v-for="player in G.players">
      {{ player.hand }}
    </div>
    {{ ctx.phase }}
    {{ G.match }}
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'


export default {
  created(){
    this.init()
  },
  computed:{
    ...mapState('game',['G','ctx'])
  },
  methods:{
    ...mapActions('game', ['init'])
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
