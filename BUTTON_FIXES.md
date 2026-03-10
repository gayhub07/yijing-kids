# 按钮点击效果优化

## 修改内容

### 1. 页面过渡动画
- ✅ 更新 `+layout.svelte`，添加页面切换时的淡入向上滑动效果
- ✅ 在 `app.css` 中添加全局页面过渡动画 `pageEnter`

### 2. 按钮点击效果统一优化
所有按钮和可点击元素现在都有统一的点击反馈：
- **缩放**: `scale(0.92-0.98)` 根据元素类型调整
- **平移**: `translateY(2px)` 模拟按压下沉效果
- **过渡时间**: `0.12s` 快速响应
- **点击高亮移除**: `-webkit-tap-highlight-color: transparent`

### 3. 已更新的组件和页面

#### 核心组件
- ✅ `FeatureCard.svelte` - 功能卡片
- ✅ `BaguaCard.svelte` - 八卦卡片
- ✅ `BottomNav.svelte` - 底部导航栏

#### 页面
- ✅ `+page.svelte` (首页) - 打卡按钮、推荐卡片
- ✅ `+layout.svelte` - 页面过渡容器
- ✅ `stories/+page.svelte` - 筛选标签、故事卡片
- ✅ `stories/[id]/+page.svelte` - 返回按钮、故事导航、爻辞切换
- ✅ `bagua/+page.svelte` - 八卦列表（通过 BaguaCard）
- ✅ `bagua/[name]/+page.svelte` - 返回按钮、学习按钮、其他卦象
- ✅ `divination/+page.svelte` - 占卜按钮、操作按钮
- ✅ `profile/+page.svelte` - 编辑按钮、头像选择、成就卡片、设置项
- ✅ `settings/+page.svelte` - 返回按钮、设置项
- ✅ `help/+page.svelte` - 返回按钮、FAQ 折叠按钮
- ✅ `about/+page.svelte` - 返回按钮

### 4. 具体样式变更

#### 主要按钮类型
```css
/* 主要操作按钮 */
&:active {
  transform: scale(0.96) translateY(2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 卡片类按钮 */
&:active {
  transform: scale(0.97) translateY(2px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 导航按钮 */
&:active {
  transform: scale(0.95);
  background: #E5E5EA;
}

/* 底部导航项 */
&:active {
  transform: scale(0.9);
}
```

### 5. 全局优化
- ✅ 所有 `transition` 时间统一为 `0.12s`（之前是 `0.15s` 或 `0.2s`）
- ✅ 添加 `-webkit-tap-highlight-color: transparent` 移除移动端点击高亮
- ✅ 在 `app.css` 中添加全局样式规则

## 测试建议

1. **页面切换动画**
   - 从首页点击任意功能卡片，观察页面是否有向上滑动淡入效果
   - 在底部导航栏切换不同页面

2. **按钮点击反馈**
   - 首页的打卡按钮
   - 功能卡片（八卦乐园、故事时光等）
   - 底部导航栏各按钮
   - 故事页面的筛选标签
   - 占卜页面的"开始占卜"按钮
   - 个人中心页面的编辑按钮、头像选择
   - 所有页面的返回按钮

3. **移动端测试**
   - 在真实移动设备上测试触摸反馈
   - 确认没有点击高亮残留
   - 检查动画流畅度

## 注意事项

- 所有动画时间保持在 120ms，确保快速响应
- 缩放比例根据元素大小调整，避免过度变形
- 保持了原有的 hover 效果（桌面端）
- 禁用的按钮不会有点击效果

---
**修改时间**: 2026-03-10
**修改人**: Kai
