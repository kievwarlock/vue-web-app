<template>


    <div  ref="gridContainer" class="grid-container-block" >
        <div class="crop-crop"></div>
        <grid
                ref="gridContainer"
                class="grid-container gridContainer"
                :draggable="true"
                :sortable="true"
                :items="items"
                :cellWidth="cellWidth"
                :cellHeight="cellHeight"


        >

            <template slot="cell" scope="props"  >
                <div class="grid-item" v-scroll-stop >
                    <image-upload-item  :props="props"  ></image-upload-item>
                </div>


            </template>

        </grid>




    </div>

</template>

<script>

    import ImageUploadItem from '@/components/ImageUploadItem.vue'

    export default {
        name: 'ImageUpload',
        data(){
            return {

                isMobile:false,
                cellHeight:150,
                cellWidth:150,
                items: [
                    'image1',
                    'image2',
                    'image3',
                    'image4',
                    'image5',

                ],
            }
        },

        mounted(){

            this.initGridSize();
            window.addEventListener('resize',_.debounce(
                () => {
                    this.handleResize()
                }, 600)
            );
            //document.querySelector('html').classList.add('dragStart');
            //document.querySelector('body').addEventListener('touchmove', function(e){e.preventDefault()}, { passive: false })
        },
        components: {
            ImageUploadItem
        },
        methods:{
            getImage(){
                console.log('this.$refs.gridContainer', this.$refs)
            },
            addImage(){
                this.items.push('image'+(parseInt(this.items.length)+1) );
            },


            handleResize(){
                this.initGridSize();

            },
            initGridSize(){

                if( this.$refs.gridContainer ){

                        let gridWidth = this.$refs.gridContainer.clientWidth;
                        let colCount = 1;

                        switch (true){
                            case (0 <= gridWidth && gridWidth < 450):
                                colCount = 2;

                                break;
                            case (450 <= gridWidth && gridWidth < 600):
                                colCount = 3;

                                break;
                            case (gridWidth < 1000):
                                colCount = 4;

                                break;
                        }
                        let cellWidth = gridWidth/colCount;
                        this.cellHeight = cellWidth;
                        this.cellWidth = cellWidth;


                }


            },

        }

    }
</script>

<style>

/*    .dragStart body  {
        overflow: hidden;
        position: fixed;
        height: 100%;
        width: 100%;
    }*/

    /*html {
        overflow:hidden;
    }
    body {
        height: 100%;
        overflow: hidden;
        width: 100%;
        position: fixed;
    }*/
   /* html.dragStart {
        overflow:hidden;
    }
    .dragStart body {
        height: 100%;
        overflow: hidden;
        width: 100%;
        position: fixed;
    }*/
    .grid-container-block{
        width:100%;
       /* touch-action: none;*/
    }
    .grid-item {
        padding: 10px 10px 10px 10px;
        height:100%;
        position: relative;

    }


</style>