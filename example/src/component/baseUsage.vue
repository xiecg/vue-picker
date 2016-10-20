<template>
  <div>
    <h1 @click="visible1 = true">base</h1>
    <h1 @click="visible2 = true">slot</h1>
    <h1 @click="visible3 = true">width</h1>
    <picker v-model="visible1" :data-items="baseItems" @change="onBaseValuesChange"></picker>
    <picker v-model="visible2" :data-items="slotItems">
        <div class="top-content" slot="top-content">Top of the content.</div>
        <div class="bottom-content" slot="bottom-content">Bottom of the content.</div>
    </picker>
    <picker v-model="visible3" :data-items="widthItems"></picker>
  </div>
</template>

<script>

export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      visible3: false,
      baseItems: [{
        values: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007']
      }, {
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      }],
      slotItems: [{
        values: ['top', 'bottom']
      }],
      widthItems: [{
        width: '70%',
        values: ['2008', '2009', '2010']
      },{
        width: '30%',
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      }]
    }
  },
  mounted: function() {

  },
  methods: {

    onBaseValuesChange (result) {

      console.log(result);
    }
  }
}
</script>

<style></style>
