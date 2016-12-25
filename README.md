[postcss-salad]: https://github.com/ElemeFE/postcss-salad
[Picker]: https://xiecg.github.io/2016/10/23/vue-picker/
[vue-picker]: https://xiecg.github.io/other/vue-picker/#/date

# Overview

The picker component based on vue.js

# DEMO

[vue-picker]

# Install

```Bash
npm install vue-3d-picker --save
```

```JavaScript
import picker from 'vue-3d-picker';
```

Register component:
```JavaScript
Vue.component(picker.name, picker);
```

# Base Usage
```HTML
<picker v-model="visible" :data-items="items" @change="onValuesChange">
	<div class="top-content" slot="top-content">Top of the content.</div>
	<div class="bottom-content" slot="bottom-content">Bottom of the content.</div>
</picker>
```

```JavaScript
export default {
  methods: {
    onValuesChange(result1, result2, ... ) {
      console.log(result1, result2)
    }
  },
  data() {
    return {
      visible: true,
      items: [
        {
          values: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007'],
        }, {
          values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        }
      ]
    }
  }
}
```

# Options

Picker Options:

| Option | Description |
| ----- | ----- |
| v-model | Boolean(default: false) Picker show and hide. |
| :data-items | Array(default: []) The configuration on the items. |
| @change | Function() Listening when data changes. |


Picker Items Options:

| Option | Description | Type | Default |
| ----- | ----- | ----- | ----- |
| index | item default index position. | Number | 0 | 
| values | values of this item. | Array | [] |
| width | The width of the item. The unit is %.| String | 'flex' |
| name | If values is an object. set the displayed key.| String | 'value' |
| maxScrollValue | The maximum value for scrolling.| Number | values.length |

# example

```Bash

npm install

npm run dev

```

# prompt

Need [postcss-salad] support

# 中文

[Picker]
