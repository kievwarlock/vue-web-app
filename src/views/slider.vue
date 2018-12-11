<template>

    <v-app>
        <v-subheader class="pl-0">Выберите превью картинку</v-subheader>
        <v-slider
                v-model="rangeSlider.slider"
                :max="rangeSlider.max"
                :min="rangeSlider.min"
                :step="rangeSlider.step"
                :always-dirty="true"
                thumb-label="always"
        ></v-slider>
    </v-app>


</template>

<script>
    export default {
        data () {
            return {
                rangeSlider:{
                    slider:1,
                    max:30,
                    min:1,
                    step:0.1
                }

            }
        },


    }
</script>