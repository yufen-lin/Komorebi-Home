<template>
  <div class="w-full h-full">
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
import type { Ingredient } from '@/type';

import { useTheme } from 'vuetify';

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);

use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

type EChartsOption = ComposeOption<
  TitleComponentOption | TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

const VALID_TAGS = [
  'beef',
  'pork',
  'chicken',
  'otherMeat',
  'fruit',
  'vegetables',
  'seafood',
  'frozenFood',
  'eggSoy',
  'starch',
  'dairy',
  'other',
];

const TAG_GROUP_MAP: Record<string, string> = {
  beef: 'Meat',
  pork: 'Meat',
  chicken: 'Meat',
  otherMeat: 'Meat',
  fruit: 'Vegetables',
  vegetables: 'Vegetables',
  seafood: 'Seafood',
  frozenFood: 'Frozen',
  eggSoy: 'EggSoy',
  starch: 'Starch',
  dairy: 'Dairy',
  other: 'Other',
};

const GROUP_LABEL_MAP: Record<string, string> = {
  Meat: '肉類',
  Vegetables: '蔬果類',
  Seafood: '海鮮類',
  Frozen: '冷凍食品',
  EggSoy: '蛋豆類',
  Starch: '澱粉類',
  Dairy: '乳製品',
  Other: '其他',
};

const props = defineProps<{
  ingredients: Ingredient[];
}>();

const INGREDIENT_TAG_INFO: Record<
  string,
  { label: string; icon?: string; bg?: string; text?: string }
> = {
  beef: { label: '牛肉', icon: '🥩' },
  pork: { label: '豬肉', icon: '🐖' },
  chicken: { label: '雞肉', icon: '🍗' },
  otherMeat: { label: '其他肉類', icon: '🍖' },
  vegetables: { label: '蔬菜', icon: '🥬' },
  fruit: { label: '水果', icon: '🍎' },
};

const inventoryChartData = computed(() => {
  const groupMap = new Map<string, Map<string, number>>();

  props.ingredients.forEach((item) => {
    const tags = item.tags || [];
    const filteredTags = tags.filter(
      (t) => VALID_TAGS.includes(t) && !['standby', 'frequent'].includes(t),
    );

    if (filteredTags.length === 0) {
      if (!groupMap.has('Other')) groupMap.set('Other', new Map());
      const otherMap = groupMap.get('Other')!;
      otherMap.set('unknown', (otherMap.get('unknown') || 0) + 1);
      return;
    }

    const primaryTag = filteredTags.find((t) => t !== 'frozenFood') || filteredTags[0];
    const group = TAG_GROUP_MAP[primaryTag] || 'Other';

    if (!groupMap.has(group)) groupMap.set(group, new Map());
    const subMap = groupMap.get(group)!;
    subMap.set(primaryTag, (subMap.get(primaryTag) || 0) + 1);
  });

  const chartData = Array.from(groupMap.entries()).map(([group, subMap]) => {
    const total = Array.from(subMap.values()).reduce((sum, v) => sum + v, 0);
    const labelInfo = Array.from(subMap.entries())
      .map(([sub, count]) => `${sub}: ${count}`)
      .join(', ');

    const dataItem: Record<string, unknown> = {
      name: GROUP_LABEL_MAP[group] || group,
      value: total,
      labelInfo,
    };

    if (['Meat', 'Vegetables'].includes(group)) {
      const formatterLines = [
        `{title|${dataItem.name}}{abg|}`,
        ...Array.from(subMap.entries()).map(([sub, count], index) => {
          const tagInfo = INGREDIENT_TAG_INFO[sub]; // 顯示圖示（如 🐖）
          const labelText = tagInfo?.label || sub;
          const icon = tagInfo?.icon || '';
          return `  {${index === 0 ? 'firstValue' : 'nextValue'}|${icon} ${labelText}}{${
            index === 0 ? 'firstValue' : 'nextValue'
          }|${count}}`;
        }),
      ];

      dataItem.label = {
        formatter: formatterLines.join('\n'),
        backgroundColor: '#e4ebf2',
        borderColor: '#456882',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          title: {
            color: '#eee',
            align: 'center',
            fontWeight: 'bold',
          },
          abg: {
            backgroundColor: '#456882',
            width: '100%',
            align: 'right',
            height: 25,
            borderRadius: [4, 4, 0, 0],
          },
          firstValue: {
            color: '#294860',
            padding: [10, 12, 10, 2],
            fontSize: 13,
            align: 'left',
            fontWeight: 'bold',
          },
          nextValue: {
            padding: [0, 12, 10, 2],
            fontSize: 13,
            color: '#294860',
            align: 'right',
            fontWeight: 'bold',
          },
        },
      };
    }

    return dataItem;
  });

  return chartData;
});

const getChartOption = (isDark: boolean): EChartsOption => {
  return {
    title: {
      text: '目前食材庫存',
      top: 40,
      right: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        align: 'center',
        color: isDark ? '#fff' : '#4c4c4c',
      },
    },
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
        radius: '50%',
        selectedMode: 'single',
        avoidLabelOverlap: false,
        label: {
          show: true,
          color: isDark ? '#fff' : '#4c4c4c',
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
        data: inventoryChartData.value,
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
</script>
