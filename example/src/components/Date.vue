<template>

    <div id="firstcomponent">

        <touch tag="h1" v-on:tap="open">open</touch>

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
            var result = [], i = 1;
            for (; i < 13; ++i) {
                result.push({
                    name: formatTwoDigitInteger(i) + '月'
                });
            }
            return result;
        };

        let generateDateData = () => {
            var result = [], i = 1;
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
                values: generateYearData(thisYear),
            },{
                name: 'name',
                index: thisMonth - 1,
                values: months,
            },{
                 name: 'name',
                index: thisDate - 1,
                values: dates,
            },{
                index: thisHour < 12 ? 0 : 1,
                values: dayDesc,
            }],
            visible: false
        }
    },
    mounted () {
    },
    methods : {
        open () {
            this.visible = true;
        },
        getMaxDate (year, month) {
            return (new Date(new Date(year, month, 1) - 1)).getDate();
        },
        onDateValuesChange (year, month, date, desc) {
            year = year.value;
            month = month.name;
            date = date.name;

            var maxDate = this.getMaxDate(parseInt(year), parseInt(month));
            
            this.dateItems[2].maxScrollValue = maxDate;
            console.log('user ----->', year, month, date, desc);
        }
    }
}

</script>

<style>
</style>
