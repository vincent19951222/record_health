#!/bin/bash

# Web 网站冒烟测试脚本
# 使用方法: ./scripts/smoke-test.sh
# 在每次提交前运行此脚本进行快速验收

set -e  # 遇到错误立即退出

# 确保在项目根目录执行
cd "$(dirname "$0")/.."

echo "🚀 开始执行冒烟测试..."
echo "=================================="

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 错误计数
ERRORS=0

# 测试结果记录
TESTS_PASSED=0
TESTS_TOTAL=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -n "🔍 测试: $test_name ... "
    TESTS_TOTAL=$((TESTS_TOTAL + 1))

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ 失败${NC}"
        echo -e "${RED}   命令: $test_command${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# 警告测试函数（不阻止提交但需要关注）
run_warning_test() {
    local test_name="$1"
    local test_command="$2"

    echo -n "⚠️  检查: $test_name ... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 正常${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  需要关注${NC}"
        echo -e "${YELLOW}   提示: $test_command${NC}"
        return 1
    fi
}

echo ""
echo "📋 第一步: 代码质量检查"
echo "----------------------------------"

# TypeScript 类型检查
run_test "TypeScript 类型检查" "npm run check"

# ESLint 代码规范检查
run_test "ESLint 代码规范检查" "npm run lint"

echo ""
echo "🏗️  第二步: 构建测试"
echo "----------------------------------"

# 生产构建测试
run_test "生产构建" "npm run build"

# 检查构建产物
run_test "构建产物存在" "test -d dist"

echo ""
echo "📦 第三步: 依赖检查"
echo "----------------------------------"

# 检查关键依赖文件
run_test "package.json 存在" "test -f package.json"
run_test "package-lock.json 存在" "test -f package-lock.json"
run_test "node_modules 存在" "test -d node_modules"

echo ""
echo "🔧 第四步: 项目结构检查"
echo "----------------------------------"

# 检查关键源码文件
run_test "主应用文件存在" "test -f src/App.tsx"
run_test "入口文件存在" "test -f src/main.tsx"
run_test "首页组件存在" "test -f src/pages/HomePage.tsx"
run_test "导航组件存在" "test -f src/components/NavigationBar.tsx"

# 检查配置文件
run_test "Vite 配置文件" "test -f vite.config.ts"
run_test "TypeScript 配置" "test -f tsconfig.json"
run_test "ESLint 配置" "test -f eslint.config.js"
run_test "Tailwind 配置" "test -f tailwind.config.js"

echo ""
echo "🎨 第五步: 样式和资源检查"
echo "----------------------------------"

# 检查样式文件
run_test "主样式文件存在" "test -f src/index.css"
run_warning_test "Tailwind CSS 基础样式" "grep -q 'tailwind' src/index.css"

# 检查 UI 组件
run_test "UI 组件目录存在" "test -d src/components/ui"
run_test "SketchButton 组件" "test -f src/components/ui/SketchButton.tsx"

echo ""
echo "📊 第六步: 服务和类型检查"
echo "----------------------------------"

# 检查服务层文件
run_test "健康数据服务" "test -f src/services/healthDataService.ts"
run_warning_test "语音识别服务" "test -f src/services/voiceRecognitionService.ts"

# 检查类型定义
run_test "健康数据类型定义" "test -f src/types/health.ts"

echo ""
echo "📱 第七步: 页面组件检查"
echo "----------------------------------"

# 检查所有页面组件
PAGES=("HomePage" "WeightDetailPage" "ExerciseDetailPage" "BloodPressureDetailPage" "BloodSugarDetailPage")

for page in "${PAGES[@]}"; do
    run_test "页面组件: $page" "test -f src/pages/${page}.tsx"
done

echo ""
echo "=================================="
echo "📊 测试结果统计"
echo "=================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 所有必测项目通过! ($TESTS_PASSED/$TESTS_TOTAL)${NC}"
    echo ""
    echo "✅ 冒烟测试完成 - 可以安全提交!"
    echo ""
    echo "📝 提交前建议手动检查:"
    echo "   • 启动开发服务器: npm run dev"
    echo "   • 访问所有路由页面"
    echo "   • 测试核心功能添加记录"
    echo "   • 检查移动端显示效果"

    exit 0
else
    echo -e "${RED}❌ 发现 $ERRORS 个问题! ($TESTS_PASSED/$TESTS_TOTAL)${NC}"
    echo ""
    echo -e "${RED}🚫 请修复上述问题后再提交代码${NC}"
    echo ""
    echo "💡 常见解决方案:"
    echo "   • 运行 'npm install' 安装缺失依赖"
    echo "   • 检查 TypeScript 类型错误"
    echo "   • 修复 ESLint 代码规范问题"
    echo "   • 确保所有必需文件存在"

    exit 1
fi
