[Postcss]: https://github.com/postcss/postcss-loader
[Picker]: https://xiecg.github.io/2016/10/23/vue-picker/

# Overview

The picker component based on vue.js

# DEMO

<img src="http://ocm0knkb1.bkt.clouddn.com/demo.gif" width="300px">

<br/>

<img src="https://xiecg.github.io/other/vue-picker/code.png">

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
    onValuesChange(result, pickerEl, reset) {
      let year = result[0], month = result[1];
      // result -> The selected data.
      // pickerEl -> The set of methods.
      // reset -> Reset the item data.  usage: reset(index, newData)
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

# example

```Bash

npm init

npm run dev

```

# prompt

Need [Postcss] support

# 中文

[Picker]
