<template>

  <div>
    <h1 @click="visible = true">open</h1>
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
      text: ''
    }
  },
  mounted () {

    let provinces = [], lastProvince, cities;

    let getCities = (data, name) => {

      return data[name];
    }

    this.$http.get('https://xiecg.github.io/other/vue-picker/city.json').then((result) => {

      let city = result.data.result.city;

      for (name in city) {

        if (city.hasOwnProperty(name)) {

          provinces.push(name);
        }
      }

      lastProvince = provinces[0];
      
      cities = getCities(city, lastProvince);

      this.cityItems = [{
        width: '20%',
        values: provinces
      },{
        name: 'name',
        width: '80%',
        values: cities
      }];

      window.citys = city;

      window.lastProvince = lastProvince;

      window.cities = cities;

      window.lastCity = cities[0];

      window.getCities = getCities;
    });

  },
  methods: {
    
    onCityValuesChange (result, pickerEl, reset) {

      let province = result[0], city = result[1];
      
      let thisProvince = province ? province : lastProvince,
          thisCity = city ? city : lastCity;

      this.text = `${thisProvince}, ${thisCity.name}`;

      if (lastProvince !== thisProvince) {

        lastProvince = thisProvince;

        cities = getCities(citys, lastProvince);

        reset(2, cities);
      }
    }
  }
}
</script>

<style></style>
