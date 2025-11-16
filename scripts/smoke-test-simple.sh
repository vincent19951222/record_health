#!/bin/bash

echo "🚀 开始执行冒烟测试..."
echo "=================================="

# 确保在项目根目录
cd "$(dirname "$0")/.."

echo ""
echo "📋 代码质量检查"
echo "----------------------------------"

# TypeScript 检查
echo -n "🔍 TypeScript 类型检查 ... "
if npm run check > /dev/null 2>&1; then
    echo "✅ 通过"
else
    echo "❌ 失败"
    echo "请运行 'npm run check' 查看具体错误"
    exit 1
fi

# ESLint 检查
echo -n "🔍 ESLint 代码规范检查 ... "
if npm run lint > /dev/null 2>&1; then
    echo "✅ 通过"
else
    echo "❌ 失败"
    echo "请运行 'npm run lint' 查看具体错误"
    exit 1
fi

echo ""
echo "🏗️ 构建测试"
echo "----------------------------------"

echo -n "🔍 生产构建测试 ... "
if npm run build > /dev/null 2>&1; then
    echo "✅ 通过"
else
    echo "❌ 失败"
    echo "请运行 'npm run build' 查看具体错误"
    exit 1
fi

echo ""
echo "📁 文件结构检查"
echo "----------------------------------"

# 检查关键文件
critical_files=(
    "src/App.tsx"
    "src/main.tsx"
    "src/pages/HomePage.tsx"
    "src/components/NavigationBar.tsx"
    "package.json"
    "vite.config.ts"
)

all_files_exist=true
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ 缺失: $file"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo "发现缺失的关键文件，请检查项目结构"
    exit 1
fi

echo ""
echo "=================================="
echo "🎉 所有检查通过!"
echo "✅ 冒烟测试完成 - 可以安全提交!"
echo ""
echo "📝 提交前建议手动检查:"
echo "   • npm run dev 启动开发服务器"
echo "   • 访问所有路由页面"
echo "   • 测试核心功能"
echo "   • 检查移动端显示效果"