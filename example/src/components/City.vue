<template>

  <div>
    <touch tag="h1" v-on:tap="open">{{prompt}}</touch>
    <p>{{text}}</p>
    <picker v-model="visible" :data-items="cityItems" @change="onCityValuesChange"></picker>
  </div>

</template>

<script>

export default {
  data() {
    return {
      visible: false,
      cityItems: [],
      text: '',
      prompt: 'Being loaded...'
    }
  },
  mounted () {

    let provinces = [], lastProvince;

    this.$http.get('https://xiecg.github.io/other/vue-picker/city.json').then((result) => {

      let city = result.data.result.city;

      this.prompt = 'open';

      for (name in city) {

        if (city.hasOwnProperty(name)) {

          provinces.push(name);
        }
      }

      lastProvince = provinces[0];
      
      this.cityItems = [{
        width: '20%',
        values: provinces
      },{
        name: 'name',
        width: '80%',
        values: city[lastProvince]
      }];

      this.citys = city;

      this.lastProvince = lastProvince;
    });

  },
  methods: {
    open () {
      this.visible = true;
    },
    onCityValuesChange (province, city) {
      city = city.name;
      this.cityItems[1].values = this.citys[province];
      this.text = `${province}, ${city}`;
    }
  }
}
</script>

<style></style>
