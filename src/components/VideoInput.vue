<template>
  <div class="video-input">
    <h3>Video input:</h3>
    <input type="file" @change="inputFile" ref="fileinput" accept="video/*" />
    <p>
      <div v-if="filedata.name"  class="btn btn-danger" @click="clearInput" > clear </div>
    </p>
    <p class="input-name" v-if="filedata.name">
      Name: {{filedata.name}} <br>
      Size: {{videoSize}} Mb<br>
      Width: {{previewData.videoWidth}}<br>
      Height: {{previewData.videoHeight}}<br>
      Duration: {{previewData.duration}}
    </p>
    <video  width="400" v-on:loadedmetadata="olol" controls ref="fileVideo" >
      <source :src="demoUrl"  >
      Your browser does not support HTML5 video.
    </video>
  </div>
</template>

<script>
export default {
  name: 'VideoInput',
  data(){
    return {
      previewData:{},
      filedata:{},
      demoUrl:'',
    }
  },
  computed:{
    videoSize(){
      return parseFloat( this.filedata.size/1024/1024).toFixed(2);
    },
    videoWidth(){
      return this.previewData.videoWidth;
    }
  },
  methods: {
    omg(){

    },
    olol(){
      this.previewData = this.$refs.fileVideo;
      console.log('videoHeight', this.$refs.fileVideo.videoHeight);
      console.log('videoWidth' ,  this.$refs.fileVideo.videoWidth);
      console.log('duration' ,  this.$refs.fileVideo.duration);
    },
    demoChange(){
      console.log('olol');
    },
    inputFile(e){
      console.log('FILE:', e.target.files[0]);
      this.demoUrl = URL.createObjectURL(e.target.files[0]);

      this.$refs.fileVideo.load();
      console.log('videoHeight', this.$refs.fileVideo.videoHeight);
      console.log('videoWidth' ,  this.$refs.fileVideo.videoWidth);
      console.log('duration' ,  this.$refs.fileVideo.duration);

      this.filedata = e.target.files[0];


      //video.play()
      //window.URL.revokeObjectURL(obj_url);

    },

    clearInput(){
      console.log('Before FILE:',this.$refs.fileinput.value );
      this.$refs.fileinput.value = '';
      this.filedata = {};
      console.log('FILE:',this.$refs.fileinput.value );
    },
  }
}
</script>

<style scoped>

</style>
