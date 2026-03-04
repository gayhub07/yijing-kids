<script lang="ts">
  interface Feature {
    title: string
    description: string
    icon: string
    color: string
    href: string
  }

  interface Props {
    feature: Feature
  }

  let { feature }: Props = $props()
</script>

<a
  href={feature.href}
  class="feature-card"
>
  <span class="icon">{feature.icon}</span>
  <h3>{feature.title}</h3>
  <p>{feature.description}</p>
</a>

<style>
  .feature-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 110px;
    padding: 16px;
    border-radius: 16px;
    text-decoration: none;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    position: relative;
    overflow: hidden;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1C1C1E;
      margin: 0 0 2px 0;
    }

    p {
      font-size: 12px;
      color: #8E8E93;
      margin: 0;
      line-height: 1.4;
    }

    /* 不同功能卡片的强调色 */
    &:nth-child(1) {
      background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
      border-left: 3px solid #F97316;
    }

    &:nth-child(2) {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
      border-left: 3px solid #3B82F6;
    }

    &:nth-child(3) {
      background: linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%);
      border-left: 3px solid #A855F7;
    }

    &:nth-child(4) {
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border-left: 3px solid #F59E0B;
    }
  }
</style>
