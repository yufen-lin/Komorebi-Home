<template>
  <div class="w-full h-full relative">
    <div class="flex justify-around items-center absolute top-0 right-0 z-10">
      <div class="flex items-center font-bold">
        <div class="text-sm mr-2 text-title">區間:</div>
        <v-chip-group v-model="timeRange" mandatory>
          <v-chip
            color="primary"
            variant="text"
            size="small"
            :ripple="false"
            value="week"
            base-color="title"
            class="font-weight-bold"
            >週</v-chip
          >
          <v-divider vertical :thickness="2" class="mr-2" length="16" inset></v-divider>
          <v-chip
            color="primary"
            variant="text"
            size="small"
            :ripple="false"
            value="month"
            base-color="title"
            class="font-weight-bold"
            >月</v-chip
          >
        </v-chip-group>
      </div>
      <div class="flex items-center font-bold">
        <div class="text-sm mr-2 text-title">統計:</div>
        <v-chip-group v-model="categoryType" mandatory>
          <v-chip
            color="primary"
            variant="text"
            size="small"
            :ripple="false"
            value="location"
            base-color="title"
            class="font-weight-bold"
            >購買地點</v-chip
          >
          <v-divider vertical :thickness="2" class="mr-2" length="16" inset></v-divider>
          <v-chip
            color="primary"
            variant="text"
            size="small"
            :ripple="false"
            value="type"
            base-color="title"
            class="font-weight-bold"
            >種類</v-chip
          >
        </v-chip-group>
      </div>
    </div>
    <v-chart :option="option" autoresize style="height: 430px" />
  </div>
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { PieSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components';
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';

use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

type EChartsOption = ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

const timeRange = ref<'week' | 'month'>('week');
const categoryType = ref<'location' | 'type'>('location');

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

const mockData = {
  week: {
    location: [
      { name: '家樂福', value: 300 },
      { name: '全聯', value: 100 },
      { name: 'Costco', value: 420 },
      { name: 'Lopia', value: 300 },
    ],
    type: [
      { name: '牛肉', value: 385 },
      { name: '蔬菜', value: 263 },
      { name: '海鮮', value: 472 },
    ],
  },
  month: {
    location: [
      { name: '家樂福', value: 1420 },
      { name: '全聯', value: 1200 },
      { name: 'Costco', value: 230 },
      { name: '菜市場', value: 500 },
    ],
    type: [
      { name: '牛肉', value: 223 },
      { name: '水果', value: 2007 },
      { name: '乳製品', value: 725 },
      { name: '蛋豆類', value: 395 },
    ],
  },
};

const getChartOption = (isDark?: boolean): EChartsOption => {
  const data = mockData[timeRange.value][categoryType.value];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return {
    title: [
      {
        text: `本${timeRange.value === 'month' ? '月' : '週'}食材總花費`,
        top: 50,
        right: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          align: 'center',
          color: isDark ? '#fff' : '#4c4c4c',
        },
      },
      {
        text: `Total\n$${total}`,
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: isDark ? '#fff' : '#4c4c4c',
        },
      },
      {
        text: '此圖表目前僅供展示使用，非實際資料',
        left: 'center',
        bottom: 0,
        textStyle: {
          fontSize: 12,
          color: isDark ? '#797979' : '#adadad',
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      // formatter: "{b}: ${c} ({d}%)",
    },
    legend: {
      orient: 'horizontal',
      bottom: 40,
      icon: 'circle',
      textStyle: {
        color: isDark ? '#fff' : '#4c4c4c',
      },
    },
    series: [
      {
        name: 'Cost',
        type: 'pie',
        radius: ['25%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          color: isDark ? '#fff' : '#4c4c4c',
          fontWeight: 'bold',
          // position: "right",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data,
      },
    ],
  };
};

const option = ref(getChartOption(isDark.value));
watch(
  () => isDark.value,
  (isDarkNow) => {
    option.value = getChartOption(isDarkNow);
  },
);

watch(
  () => timeRange.value,
  () => {
    option.value = getChartOption();
  },
);

watch(
  () => categoryType.value,
  () => {
    option.value = getChartOption();
  },
);
</script>
