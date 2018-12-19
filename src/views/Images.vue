<template>

    <div class="image-page">
        <h1>Image upload</h1>
        <ImageUpload></ImageUpload>
    </div>


</template>

<script>



    import ImageUpload from '@/components/ImageUpload.vue'


    export default {
        name: 'ImagePage',
        data(){
          return {

          }
        },

        components: {
            ImageUpload,
        }
    }
</script>


<style>
    .image-page {
        width:100%;
        max-width: 600px;
        margin: 20px auto;
        position: relative;
    }

</style>