export default function ErrorTestPage() {
  // 故意抛出一个致命错误，打破页面渲染
  throw new Error('这是一个测试错误，用来验证 error.tsx 界面');
}