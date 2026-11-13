// app/not-found/layout.tsx
export const instant = false; // 👈 核心：告诉 Next.js 此布局下的页面跳过预渲染校验

export default function NotFoundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}