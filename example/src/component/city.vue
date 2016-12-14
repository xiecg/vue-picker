<template>

  <div>
    <h1 @click="visible = true">{{prompt}}</h1>
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
    
    onCityValuesChange (result) {
      let province = result[0], city = result[1].name;
      // console.log(province, city.name);
      // console.log(this.citys[province]);

      this.cityItems[1].values = this.citys[province];
      console.log(province, city);
      /*
      let thisProvince = province ? province : lastProvince,
          thisCity = city ? city : citys[lastProvince][0];

      this.text = `${thisProvince}, ${thisCity.name}`;

      if (lastProvince !== thisProvince) {

        lastProvince = thisProvince;

        reset(2, citys[lastProvince]);
      }
      */
    }
  }
}
</script>

<style></style>
