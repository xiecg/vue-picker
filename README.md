# Overview
The picker component based on vue.js

# Install

```Bash
npm install vue-3d-picker --save
```

```JavaScript
import Picker from 'picker';
```

# Base Usage
```HTML
<picker v-model="visible" :data-items="items" @change="onValuesChange">
	<div class="top-content" slot="top-content">At the top of the content</div>
	<div class="bottom-content" slot="bottom-content">At the bottom of the content</div>
</picker>
```

```JavaScript
export default {
  methods: {
    onValuesChange(result, pickerEl, reset) {
      let year = result[0], month = result[1];
      // result -> The selected data
      // pickerEl -> DOM ?
      // reset -> Reset the data on the picker component ?
    }
  },

  data() {
    return {
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