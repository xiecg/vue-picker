<template>

    <div id="firstcomponent">

        <h1 @click="visible = true">open</h1>

        <picker v-model="visible" :data-items="dateItems" @change="onDateValuesChange"></picker>

    </div>

</template>

<script type="text/javascript">

export default {

    data () {

        let formatTwoDigitInteger = (value) => {

            value = value.toString();

            return (value.length === 1 ? '0' : '') + value;
        };

        let generateYearData = (thisYear) => {

            var result = [],
                i = thisYear,
                end = thisYear+80;

            for(; i < end; i++) {
                
                result.push({
                    value: formatTwoDigitInteger(i) + '年'
                });
            }

            return result;
        };

        let generateMonthData = () => {

            var result = [],
                i = 1;

            for (; i < 13; ++i) {

                result.push({
                    name: formatTwoDigitInteger(i) + '月'
                });
            }

            return result;
        };

        let generateDateData = () => {

            var result = [],
                i = 1;

            for (; i < 32; ++i) {

                result.push({
                    name: formatTwoDigitInteger(i) + '日'
                });
            }

            return result;
        };

        let today = new Date,
            thisYear = today.getFullYear(),
            thisMonth = today.getMonth() + 1,
            thisDate = today.getDate(),
            thisHour = today.getHours(),
            months = generateMonthData(),
            dates = generateDateData(),
            dayDesc = ['上午', '下午'],
            lastYear = thisYear,
            lastMonth = thisMonth,
            lastDate = thisDate,
            lastDesc = dayDesc[thisHour < 12 ? 0 : 1];

        this.thisYear = thisYear;

        return {
            dateItems: [{
                name: 'value',
                values: generateYearData(thisYear)
            },{
                name: 'name',
                index: thisMonth,
                values: months
            },{
                name: 'name',
                index: thisDate,
                values: dates
            },{
                index: thisHour < 12 ? 1 : 2,
                values: dayDesc
            }],
            visible: false
        }
        return {
            dateItems: [{
                name: 'name',
                index: 1 || thisDate,
                values: dates
            }],
            visible: false
        }
    },

    mounted () {},

    methods : {

        getMaxDate (year, month) {

            return (new Date(new Date(year, month + 1, 1) - 1)).getDate();
        },

        onDateValuesChange (result, pickerEl, reset) {

            let year = result[0], month = result[1], date = result[2], desc = result[3];

            let lastYear = parseInt(year ? year.value : this.thisYear);
            let lastMonth = month ? month.$key : 0;
            let lastDate = date ? date.$key : 0;
            let lastDesc = desc ? desc : 0;

            let maxDate = this.getMaxDate(lastYear, lastMonth - 1);
            
            if (lastDate > maxDate) {

                pickerEl.value3 = maxDate;
            }

            // console.log(lastYear, lastMonth, lastDate, lastDesc);
        }
    }
}

</script>

<style>
</style>
