/**
 * 语音识别功能测试脚本
 * 用于测试增强的语音识别服务
 */

import { voiceRecognitionService } from '../services/voiceRecognitionService';

/**
 * 测试用例定义
 */
interface TestCase {
  name: string;
  input: string;
  expected: {
    weight?: number;
    bloodPressure?: { systolic: number; diastolic: number };
    bloodSugar?: number;
    exercise?: { type: string; duration: number };
    sleep?: { duration: number; quality?: string };
  };
}

/**
 * 测试用例集合
 */
const testCases: TestCase[] = [
  // 体重识别测试
  {
    name: '体重公斤识别',
    input: '我今天体重75公斤',
    expected: { weight: 75 }
  },
  {
    name: '体重磅转换',
    input: '体重165磅',
    expected: { weight: 74.8 } // 165 * 0.453592 ≈ 74.8
  },
  {
    name: '体重斤转换',
    input: '重了150斤',
    expected: { weight: 75 } // 150 / 2 = 75
  },

  // 血压识别测试
  {
    name: '血压斜杠格式',
    input: '血压120/80',
    expected: { bloodPressure: { systolic: 120, diastolic: 80 } }
  },
  {
    name: '血压中文格式',
    input: '血压高压120低压80',
    expected: { bloodPressure: { systolic: 120, diastolic: 80 } }
  },
  {
    name: '收缩压舒张压格式',
    input: '收缩压115舒张压75',
    expected: { bloodPressure: { systolic: 115, diastolic: 75 } }
  },

  // 血糖识别测试
  {
    name: '血糖基本识别',
    input: '血糖5.8',
    expected: { bloodSugar: 5.8 }
  },
  {
    name: '空腹血糖识别',
    input: '空腹血糖5.2mmol',
    expected: { bloodSugar: 5.2 }
  },

  // 运动识别测试
  {
    name: '跑步时长识别',
    input: '今天跑步了30分钟',
    expected: { exercise: { type: '跑步', duration: 30 } }
  },
  {
    name: '健身时长识别',
    input: '健身1小时',
    expected: { exercise: { type: '健身', duration: 60 } }
  },
  {
    name: '游泳时长识别',
    input: '游泳45分钟',
    expected: { exercise: { type: '游泳', duration: 45 } }
  },

  // 睡眠识别测试
  {
    name: '睡眠时间识别',
    input: '昨晚11点睡觉，早上7点起床',
    expected: { sleep: { duration: 480 } } // 8小时 = 480分钟
  },
  {
    name: '睡眠质量好',
    input: '昨晚11点睡到早上7点，睡得很好',
    expected: { sleep: { duration: 480, quality: 'good' } }
  },
  {
    name: '睡眠质量差',
    input: '昨晚12点半睡的，早上6点半醒，睡得不好',
    expected: { sleep: { duration: 360, quality: 'poor' } }
  },
  {
    name: '睡眠时长直接描述',
    input: '睡了7个小时',
    expected: { sleep: { duration: 420 } } // 7小时 = 420分钟
  },

  // 复合语句测试
  {
    name: '复合健康数据',
    input: '体重70kg，血压118/78，早上跑步20分钟，昨晚10点半睡觉',
    expected: {
      weight: 70,
      bloodPressure: { systolic: 118, diastolic: 78 },
      exercise: { type: '跑步', duration: 20 },
      sleep: { duration: 510 } // 10:30-7:00 = 8.5小时 = 510分钟
    }
  }
];

/**
 * 运行单个测试用例
 */
async function runTestCase(testCase: TestCase): Promise<{ passed: boolean; result: any; errors: string[] }> {
  const errors: string[] = [];

  try {
    const result = await voiceRecognitionService.recognizeHealthData(testCase.input);

    // 验证体重
    if (testCase.expected.weight !== undefined) {
      if (result.weight?.value !== testCase.expected.weight) {
        errors.push(`体重识别错误: 期望 ${testCase.expected.weight}, 实际 ${result.weight?.value}`);
      }
    }

    // 验证血压
    if (testCase.expected.bloodPressure !== undefined) {
      if (result.bloodPressure?.systolic !== testCase.expected.bloodPressure.systolic ||
          result.bloodPressure?.diastolic !== testCase.expected.bloodPressure.diastolic) {
        errors.push(`血压识别错误: 期望 ${testCase.expected.bloodPressure.systolic}/${testCase.expected.bloodPressure.diastolic}, 实际 ${result.bloodPressure?.systolic}/${result.bloodPressure?.diastolic}`);
      }
    }

    // 验证血糖
    if (testCase.expected.bloodSugar !== undefined) {
      if (result.bloodSugar?.value !== testCase.expected.bloodSugar) {
        errors.push(`血糖识别错误: 期望 ${testCase.expected.bloodSugar}, 实际 ${result.bloodSugar?.value}`);
      }
    }

    // 验证运动
    if (testCase.expected.exercise !== undefined) {
      if (result.exercise?.type !== testCase.expected.exercise.type ||
          result.exercise?.duration !== testCase.expected.exercise.duration) {
        errors.push(`运动识别错误: 期望 ${testCase.expected.exercise.type} ${testCase.expected.exercise.duration}分钟, 实际 ${result.exercise?.type} ${result.exercise?.duration}分钟`);
      }
    }

    // 验证睡眠
    if (testCase.expected.sleep !== undefined) {
      if (result.sleep?.duration !== testCase.expected.sleep.duration) {
        errors.push(`睡眠时长错误: 期望 ${testCase.expected.sleep.duration}分钟, 实际 ${result.sleep?.duration}分钟`);
      }
      if (testCase.expected.sleep.quality && result.sleep?.quality !== testCase.expected.sleep.quality) {
        errors.push(`睡眠质量错误: 期望 ${testCase.expected.sleep.quality}, 实际 ${result.sleep?.quality}`);
      }
    }

    return {
      passed: errors.length === 0,
      result,
      errors
    };

  } catch (error) {
    errors.push(`测试执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
    return {
      passed: false,
      result: null,
      errors
    };
  }
}

/**
 * 运行所有测试用例
 */
export async function runAllTests(): Promise<void> {
  console.log('🚀 开始运行语音识别功能测试...\n');

  let passedCount = 0;
  let totalCount = testCases.length;

  for (const testCase of testCases) {
    console.log(`📝 测试: ${testCase.name}`);
    console.log(`📥 输入: "${testCase.input}"`);

    const testResult = await runTestCase(testCase);

    if (testResult.passed) {
      console.log('✅ 通过');
      passedCount++;
    } else {
      console.log('❌ 失败');
      testResult.errors.forEach(error => {
        console.log(`   💥 ${error}`);
      });
    }

    if (testResult.result) {
      console.log('📤 识别结果:', JSON.stringify(testResult.result, null, 2));
    }

    console.log('---\n');
  }

  // 输出测试总结
  console.log('📊 测试总结:');
  console.log(`✅ 通过: ${passedCount}/${totalCount}`);
  console.log(`❌ 失败: ${totalCount - passedCount}/${totalCount}`);
  console.log(`📈 成功率: ${((passedCount / totalCount) * 100).toFixed(1)}%`);

  if (passedCount === totalCount) {
    console.log('🎉 所有测试用例都通过了！');
  } else {
    console.log('⚠️  有测试用例失败，请检查实现');
  }
}

/**
 * 交互式测试函数
 */
export async function interactiveTest(): Promise<void> {
  console.log('🎙️  交互式语音识别测试');
  console.log('请输入要测试的语音文本（输入 "exit" 退出）：\n');

  // 在Node.js环境中，我们需要模拟输入
  const testInputs = [
    '今天体重72公斤',
    '血压125/82',
    '血糖6.1',
    '游泳30分钟',
    '昨晚11点睡到早上7点，睡得不错'
  ];

  for (const input of testInputs) {
    console.log(`📥 输入: "${input}"`);

    try {
      const result = await voiceRecognitionService.recognizeHealthData(input);
      console.log('📤 识别结果:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('❌ 识别失败:', error instanceof Error ? error.message : error);
    }

    console.log('---\n');
  }
}

// 如果直接运行此文件，执行测试
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().catch(console.error);
}