<template>
  <div>
    <!-- 每天重复-->
    <div v-if="durationType === '02'">
      <div v-for="(item, index) in state.everyDays" :key="index">
        <div class="time-wrap">
          <el-time-picker
            v-model="item.startTime"
            style="width: 120px"
            placeholder="开始时间"
            value-format="HH:mm"
            format="HH:mm"
          />
          <div style="margin: 0 10px">-</div>
          <el-time-picker
            v-model="item.endTime"
            style="width: 120px"
            placeholder="结束时间"
            value-format="HH:mm"
            format="HH:mm"
          />
          <i
            v-if="index === 0 && state.everyDays.length < 3"
            class="iconfont icon-xinzengmian"
            @click="addTime(item, state.everyDays)"
          ></i>
          <i
            v-else-if="index > 0"
            class="iconfont icon-jianshao1"
            @click="removeTime(state.everyDays, index)"
          ></i>
        </div>
      </div>
    </div>
    <!-- 每周重复-->
    <div v-if="durationType === '03'">
      <div v-for="(item, index) in state.everyWeek" :key="index" class="week-wrap">
        <div class="time-wrap">
          <el-checkbox-group v-model="item.checkList">
            <el-checkbox
              v-for="(el, i) in item.weeks"
              :key="i"
              :label="el.value"
              :disabled="el.disabled"
              @change="changeCheckBox(item, index)"
              >{{ el.label }}</el-checkbox
            >
          </el-checkbox-group>
          <i
            v-if="index === 0 && state.everyWeek.length < 3"
            class="iconfont icon-xinzengmian"
            @click="addWeekTime(item, index)"
          ></i>
          <i v-else-if="index > 0" class="iconfont icon-jianshao1" @click="removeWeekTime(item, index)"></i>
        </div>
        <div v-for="(it, j) in item.times" :key="j">
          <div class="time-wrap">
            <el-time-picker
              v-model="it.startTime"
              style="width: 120px"
              placeholder="开始时间"
              value-format="HH:mm"
              format="HH:mm"
            />
            <div style="margin: 0 10px">-</div>
            <el-time-picker
              v-model="it.endTime"
              style="width: 120px"
              placeholder="结束时间"
              value-format="HH:mm"
              format="HH:mm"
            />
            <i
              v-if="j === 0 && item.times.length < 3"
              class="iconfont icon-xinzengmian"
              @click="addTime(it, item.times)"
            ></i>
            <i v-else-if="j > 0" class="iconfont icon-jianshao1" @click="removeTime(item.times, j)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="DurationSet">
import { useProxy } from '@/utils/proxy'
const { proxy } = useProxy()
/*
营业时间设置：无论每天重复和每周重复
1：最多添加3个时间段
2：时间段之间不能重叠/重复
3：默认时间段：00:00-00:00
*/
const state = reactive({
  everyDays: [] as any,
  everyWeek: [] as any
})
const props = defineProps({
  durationType: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['emitEveryDay', 'emitEveryWeek'])
// 每天重复的+
const addTime = (li: any, arr: any) => {
  arr.push({
    startTime: null,
    endTime: null
  })
}
// 每周重复的+
const addWeekTime = async (item: any, index: number) => {
  let weeks = [
    {
      label: '周一',
      value: 'mon',
      disabled: false
    },
    {
      label: '周二',
      value: 'tue',
      disabled: false
    },
    {
      label: '周三',
      value: 'wed',
      disabled: false
    },
    {
      label: '周四',
      value: 'thu',
      disabled: false
    },
    {
      label: '周五',
      value: 'fri',
      disabled: false
    },
    {
      label: '周六',
      value: 'sat',
      disabled: false
    },
    {
      label: '周日',
      value: 'sun',
      disabled: false
    }
  ]
  let lastIndex = state.everyWeek.length - 1
  let lastData = state.everyWeek[lastIndex]
  if (!lastData.checkList.length) return proxy.$message.msgWarning('请先选择周信息')
  if (lastData.checkList.length >= 7) {
    return proxy.$message.msgWarning('已全部选择周信息，无需再次添加')
  }

  // 重置状态为false,默认就是false
  weeks.forEach((ele: any) => {
    ele.disabled = false
  })
  // 然后禁用掉之前所有已经勾选过的，剩下的就是能选的
  weeks.forEach((self) => {
    state.everyWeek.forEach((el: any) => {
      el.checkList.forEach((li: any) => {
        if (self.value === li) {
          self.disabled = true
        }
      })
    })
  })
  // if (!lastData.times.length) return proxy.$message.msgWarning('请选添加时间')
  // let lastTimeIndex = lastData.times.length - 1
  // let lastTimeData = lastData.times[lastTimeIndex]
  // if (lastTimeData.time == null) {
  //   lastTimeData.time = []
  // }
  // if (!lastTimeData.time.length) return proxy.$message.msgWarning('请选择时间')

  // 把最外层数组中最后一项全部禁用
  lastData.weeks.forEach((it: any) => {
    if (!it.disabled) {
      it.disabled = true
    }
  })
  state.everyWeek.push({
    times: [
      {
        startTime: null,
        endTime: null
      }
    ],
    checkList: [],
    weeks
  })
}
// 每天重复的—
const removeTime = (arr: any, index: number) => {
  arr.splice(index, 1)
}
const removeWeekTime = (item: any, index: number) => {
  if (state.everyWeek.length) {
    state.everyWeek.splice(index, 1)
    let lastIndex = state.everyWeek.length - 1
    let lastData = state.everyWeek[lastIndex]
    lastData.weeks.forEach((ele: any) => {
      ele.disabled = false
    })
  }
}
// change 去重 每一组的周选择，其他周的不能重复选择，比如第一组选择了周一周二，其他组不能再重复选择
const changeCheckBox = (item: any, index: number) => {
  let allWeeks = state.everyWeek
  item.checkList.forEach((el: string) => {
    allWeeks.forEach((obj: any, i: number) => {
      if (i === index) return
      obj.weeks.forEach((li: any) => {
        if (el === li.value) {
          li.disabled = true
        }
      })
    })
  })
}
const makeRangeTime = (start: number, end: number) => {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
const filterTimeStr = (timeArr: any) => {
  let timeStr = ''
  let arr = [] as any
  timeArr.forEach((item: any) => {
    const values = Object.values(item)
    const str = values.join('-')
    arr.push(str)
  })
  timeStr = arr.join(';')
  return timeStr
}
// 传递处理好的时间数据
const emitsTimeData = () => {
  if (props.durationType === '02') {
    // 传参格式：0:00-0:00;0:00-0:00;0:00-0:00
    let str = filterTimeStr(state.everyDays)
    emits('emitEveryDay', str)
  } else if (props.durationType === '03') {
    let weekParam = {} as any
    let weeks = state.everyWeek
    weeks.forEach((item: any) => {
      let str = filterTimeStr(item.times)
      item.checkList.forEach((li: any) => {
        weekParam[li] = str
      })
    })
    emits('emitEveryWeek', weekParam)
  }
}
watch(
  () => props.durationType,
  (val: string) => {
    if (val === '02') {
      state.everyWeek = []
      state.everyDays.push({
        startTime: null,
        endTime: null
      })
    }
    if (val === '03') {
      state.everyDays = []
      state.everyWeek.push({
        times: [
          {
            startTime: null,
            endTime: null
          }
        ],
        checkList: [],
        weeks: [
          {
            label: '周一',
            value: 'mon',
            disabled: false
          },
          {
            label: '周二',
            value: 'tue',
            disabled: false
          },
          {
            label: '周三',
            value: 'wed',
            disabled: false
          },
          {
            label: '周四',
            value: 'thu',
            disabled: false
          },
          {
            label: '周五',
            value: 'fri',
            disabled: false
          },
          {
            label: '周六',
            value: 'sat',
            disabled: false
          },
          {
            label: '周日',
            value: 'sun',
            disabled: false
          }
        ]
      })
    }
  }
)
defineExpose({
  emitsTimeData,
  state
})
</script>

<style scoped lang="scss">
.iconfont {
  cursor: pointer;
  margin-left: 10px;
  color: #666666;
}
.week-wrap {
  margin-bottom: 25px;
}
.time-wrap {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
</style>
