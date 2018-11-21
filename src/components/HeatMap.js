import {MapElementFactory} from 'vue2-google-maps'

export default MapElementFactory({
    name: 'heatmapLayer',
    events: [],
    mappedProps: {
        data: {type: Array},
        map: {type: Object},
    },
    ctr: () => google.maps.visualization.HeatmapLayer,
})