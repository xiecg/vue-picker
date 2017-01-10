<template>
  <div>
    <h1 @click="visible1 = true">base</h1>
    <h1 @click="visible2 = true">slot</h1>
    <h1 @click="visible3 = true">width</h1>
    <touch tag="h1" v-on:tap="open">{{indexText}}</touch>
    <picker v-model="visible1" :data-items="baseItems" @change="onBaseValuesChange"></picker>
    <picker v-model="visible2" :data-items="slotItems">
        <div class="picker-top-content" slot="top-content">Top of the content.</div>
        <div class="picker-bottom-content" slot="bottom-content">Bottom of the content.</div>
    </picker>
    <picker v-model="visible3" :data-items="widthItems"></picker>
    <picker v-model="visible4" :data-items="indexItems" :callback-arg="'indexItems'" @change="onIndexValuesChange"></picker>
  </div>
</template>

<script>

export default {
  data() {
    return {
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      indexText: 'F',
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
      }],
      indexItems: [{
        values: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      }]
    }
  },
  mounted: function() {
  },
  methods: {
    onBaseValuesChange (year, month) {
      console.log(year, month);
    },
    open () {
      this.visible4 = true;
      let items = this.indexItems[0];
      let index = items.values.indexOf(this.indexText);
      items.index = index;
    },
    onIndexValuesChange (result, arg) {
      this.indexText = result;
    }
  }
}
</script>

<style></style>
