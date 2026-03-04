<script lang="ts">
import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { extraStoriesData } from '$lib/data/stories-extra'
import { getStoryProgress, updateStoryProgress } from '$lib/supabase/api'

// 前16个故事数据
const first16StoriesData: Record<
  string,
  {
    id: number
    gua: string
    title: string
    summary: string
    content: string[]
    emoji: string
    level: 'beginner' | 'explorer' | 'advanced'
    lesson: string
  }
> = {
  '1': {
    id: 1,
    gua: '乾',
    title: '龙的故事',
    summary: '一条小龙如何成长为天空之王',
    emoji: '🐉',
    level: 'beginner',
    content: [
      '在很久很久以前，有一只小龙住在一座高高的山上。',
      '小龙每天都看着天空，心想："我要飞到最高最高的地方去！"',
      '但是小龙还太小了，翅膀也不够强壮。它决定每天练习飞翔。',
      '第一天，小龙从一块小石头上跳下来，摔了个屁股蹲儿。但它不放弃！',
      '第二天，小龙从一块大石头上跳下来，这次飞了一小段！',
      '一个月过去了，小龙越飞越高。它飞过了山头，飞过了云彩。',
      '终于有一天，小龙飞到了最高最高的天空，成为了天空之王！',
      '乾卦告诉我们：要像龙一样勇敢，坚持不懈，就一定能成功！',
    ],
    lesson: '天行健，君子以自强不息。意思是：要像天一样刚强，永不放弃！',
  },
  '2': {
    id: 2,
    gua: '坤',
    title: '大地的礼物',
    summary: '大地母亲如何滋养万物生长',
    emoji: '🌍',
    level: 'beginner',
    content: [
      '很久很久以前，大地妈妈刚刚诞生。',
      '她看着空荡荡的世界，心想："我要让这里变得生机勃勃！"',
      '于是，大地妈妈开始工作了。她让土地变得肥沃，让河流开始流淌。',
      '春天来了，大地妈妈轻轻地唤醒沉睡的小种子。',
      '"醒醒啦，小宝贝们！"她说。小种子们伸伸懒腰，从泥土里探出头来。',
      '夏天到了，大地妈妈给小苗们浇水、送养分。小苗们越长越高。',
      '秋天来了，小苗们结出了果实。大地妈妈笑着说："真棒！"',
      '坤卦告诉我们：要像大地一样温柔，帮助身边的人成长！',
    ],
    lesson: '地势坤，君子以厚德载物。意思是：要像大地一样包容，帮助别人！',
  },
  '3': {
    id: 3,
    gua: '屯',
    title: '种子发芽',
    summary: '一颗小种子的冒险旅程',
    emoji: '🌱',
    level: 'beginner',
    content: [
      '有一颗小种子，躺在泥土里睡觉。',
      '春天来了，小种子听到了雷声。"轰隆隆！"',
      '小种子醒了过来，它想："我要出去看看外面的世界！"',
      '小种子开始努力往外钻。泥土有点硬，但它不放弃。',
      '终于，小种子探出了小脑袋。"哇，外面的世界好大啊！"',
      '阳光照在小种子身上，暖暖的。雨水滋润着它，甜甜的。',
      '小种子越长越高，变成了一棵小苗，然后变成了一棵大树。',
      '屯卦告诉我们：万事开头难，但只要坚持，就一定能成功！',
    ],
    lesson: '刚柔始交而难生。意思是：开始的时候会有些困难，但不要害怕！',
  },
  '4': {
    id: 4,
    gua: '蒙',
    title: '小明求学',
    summary: '聪明的小明如何学习知识',
    emoji: '📚',
    level: 'beginner',
    content: [
      '小明是个爱学习的孩子，但他不知道该学什么。',
      '有一天，一位智者路过。"小朋友，你想学什么呀？"智者问。',
      '小明说："我想学所有的东西！但太多了，我不知道从哪里开始。"',
      '智者笑着说："那就从最简单的开始吧。学会一样，再学下一样。"',
      '小明听了，决定先学认字。他每天认一个字，从不间断。',
      '一年过去了，小明认识了好几百个字！他开始学算术。',
      '又过了一年，小明学会了加减乘除。他开始学画画。',
      '蒙卦告诉我们：学习要一步一步来，不要着急，总会成功的！',
    ],
    lesson: '匪我求童蒙，童蒙求我。意思是：要主动学习，不懂得就要问！',
  },
  '5': {
    id: 5,
    gua: '需',
    title: '等待的智慧',
    summary: '学会耐心等待的小兔子',
    emoji: '🐰',
    level: 'beginner',
    content: [
      '小兔子是个急性子，做什么都想马上完成。',
      '春天到了，小兔子种下了一颗胡萝卜种子。',
      '第一天，小兔子去看，没有发芽。第二天，还是没有。',
      '小兔子急了，想把种子挖出来看看。兔妈妈阻止了它。',
      '"孩子，种子需要时间才能发芽。你要学会等待。"',
      '小兔子听了妈妈的话，每天浇水、晒太阳，耐心地等待。',
      '终于有一天，小绿芽冒出来了！小兔子高兴地跳了起来。',
      '需卦告诉我们：好的事情需要时间，学会等待很重要！',
    ],
    lesson: '需于郊，利用恒。意思是：耐心等待，坚持就会成功！',
  },
  '6': {
    id: 6,
    gua: '讼',
    title: '和为贵',
    summary: '两个小朋友如何化解矛盾',
    emoji: '🤝',
    level: 'beginner',
    content: [
      '小明和小红是最好的朋友，但有一天他们吵架了。',
      '"这个玩具是我的！""不，是我先看到的！"他们争得面红耳赤。',
      '老师看见了，走过来说："你们这样吵下去，谁也玩不了。"',
      '小明和小红想了想，觉得老师说得对。',
      '老师说："不如你们轮流玩？每人玩十分钟，怎么样？"',
      '小明和小红同意了。他们轮流玩玩具，玩得很开心。',
      '从此以后，他们遇到问题都会好好商量，再也不吵架了。',
      '讼卦告诉我们：遇到矛盾要好好沟通，和气才能生财！',
    ],
    lesson: '君子以作事谋始。意思是：做事要先想清楚，避免发生矛盾！',
  },
  '7': {
    id: 7,
    gua: '师',
    title: '勇敢的将军',
    summary: '一位智慧的将军带领军队',
    emoji: '⚔️',
    level: 'explorer',
    content: [
      '在古代，有一位智慧的将军，名叫韩信。',
      '韩信的军队人数很少，但每个人都非常信任他。',
      '有一次，敌人来了十倍于韩信的兵力！大家都害怕极了。',
      '韩信说："不要怕，打仗不只是看人数，更要看智慧！"',
      '韩信想出了一个妙计。他让士兵们背对着河流列阵。',
      '士兵们想："没有退路了，只能拼命！"于是他们变得无比勇敢。',
      '最后，韩信的军队竟然赢了！这就是著名的"背水一战"。',
      '师卦告诉我们：好的领导很重要，团结才能胜利！',
    ],
    lesson: '师出以律，否臧凶。意思是：做事要有纪律，才能成功！',
  },
  '8': {
    id: 8,
    gua: '比',
    title: '团结就是力量',
    summary: '小动物们如何互相帮助',
    emoji: '🦊',
    level: 'explorer',
    content: [
      '森林里住着很多小动物，但它们平时各玩各的。',
      '有一天，一场大暴雨来了！河水上涨，淹没了森林。',
      '小兔子被困在一棵树上，它大声呼救。',
      '小松鼠听见了，但一只松鼠救不了小兔子。',
      '于是小松鼠去找其他动物帮忙。小熊、小鹿、小猴都来了。',
      '大家手拉手，形成了一条"生命线"，把小兔子救了出来。',
      '从那以后，小动物们明白了团结的力量，成了最好的朋友。',
      '比卦告诉我们：团结在一起，就没有克服不了的困难！',
    ],
    lesson: '地上有水，比。意思是：像水渗入大地一样，要和别人亲近！',
  },
  '9': {
    id: 9,
    gua: '小畜',
    title: '积少成多',
    summary: '小松鼠的存粮故事',
    emoji: '🐿️',
    level: 'explorer',
    content: [
      '秋天到了，森林里的小动物们都在准备过冬的食物。',
      '小松鼠每天只收集一小堆坚果，其他动物都笑话它。',
      '大熊说："我一次就能找到好多食物，你太慢了！"',
      '但小松鼠不在意，它每天都坚持收集一小堆。',
      '冬天来了，大熊很快就吃完了所有食物，饿得直叫。',
      '而小松鼠呢？它的洞穴里堆满了坚果，足够吃整个冬天！',
      '小松鼠还分享了一些给大熊，大熊感激地说："谢谢你！"',
      '小畜卦告诉我们：一点点积累，终会变成大财富！',
    ],
    lesson: '密云不雨，自我西郊。意思是：准备充分了，成功自然会来！',
  },
  '10': {
    id: 10,
    gua: '履',
    title: '小心走路',
    summary: '踩着石头过河的智慧',
    emoji: '🦶',
    level: 'explorer',
    content: [
      '小羊要过河，但河水很急，桥又很远。',
      '小羊看到河里有一些大石头，心想："我可以踩着石头过去！"',
      '它小心翼翼地踏上第一块石头，稳稳地站住了。',
      '接着是第二块、第三块...小羊走得很慢，但很稳。',
      '突然，一块石头晃了一下！小羊差点摔倒。',
      '但小羊没有慌张，它稳住身体，换了一块更稳的石头。',
      '终于，小羊安全地到达了对岸！它开心地跳了起来。',
      '履卦告诉我们：做事要小心谨慎，一步一步来才安全！',
    ],
    lesson: '履虎尾，不咥人，亨。意思是：小心谨慎，就能避开危险！',
  },
  '11': {
    id: 11,
    gua: '泰',
    title: '春天来了',
    summary: '万物复苏的美好时光',
    emoji: '🌸',
    level: 'beginner',
    content: [
      '寒冷的冬天终于过去了，春天悄悄地来了。',
      '小草从泥土里探出头来，好奇地看着这个世界。',
      '花儿们竞相开放，红的、黄的、紫的...好漂亮啊！',
      '小鸟们从南方飞回来了，叽叽喳喳地唱着歌。',
      '小动物们也从冬眠中醒来，伸伸懒腰，走出洞穴。',
      '阳光变得温暖了，微风变得柔和了，一切都充满了生机。',
      '农民伯伯开始播种，期待着秋天的收获。',
      '泰卦告诉我们：顺境的时候要好好珍惜，努力创造美好！',
    ],
    lesson: '天地交，泰。意思是：天地和谐，万物才能茁壮成长！',
  },
  '12': {
    id: 12,
    gua: '否',
    title: '乌云散去',
    summary: '困难总会过去的',
    emoji: '⛅',
    level: 'explorer',
    content: [
      '有一段时间，天空总是灰蒙蒙的，好像永远不会放晴。',
      '小动物们都闷闷不乐，没有精神玩耍。',
      '小兔子问妈妈："太阳公公是不是不回来了？"',
      '兔妈妈笑着说："傻孩子，乌云总会散去的，太阳会回来的！"',
      '小兔子每天早上都跑到山顶去看天空。',
      '终于有一天，它看到了一缕阳光从云缝里透出来！',
      '慢慢地，乌云散去了，太阳重新照耀大地。',
      '否卦告诉我们：困难只是暂时的，坚持下去，光明终会到来！',
    ],
    lesson: '否极泰来。意思是：坏运气到了尽头，好运气就会来！',
  },
  '13': {
    id: 13,
    gua: '同人',
    title: '志同道合',
    summary: '寻找志趣相投的朋友',
    emoji: '👫',
    level: 'explorer',
    content: [
      '小明很喜欢画画，但他的朋友们都不太感兴趣。',
      '小明有点失落，他很想找到一个能一起画画的朋友。',
      '有一天，学校举办了美术比赛。小明去参加了。',
      '在那里，他遇到了小红，小红也超级喜欢画画！',
      '他们聊了很久，发现彼此都喜欢画小动物。',
      '从那以后，小明和小红经常一起画画，互相学习。',
      '他们还一起办了一个小画展，很多同学都来参观。',
      '同人卦告诉我们：找到志同道合的朋友，一起进步更快乐！',
    ],
    lesson: '同人于野，亨。意思是：和大家和睦相处，就能顺利成功！',
  },
  '14': {
    id: 14,
    gua: '大有',
    title: '丰收的季节',
    summary: '农民伯伯的快乐收获',
    emoji: '🌾',
    level: 'beginner',
    content: [
      '秋天到了，田野里的庄稼都成熟了。',
      '金灿灿的麦子，红彤彤的苹果，紫莹莹的葡萄...',
      '农民伯伯们忙着收割，脸上洋溢着幸福的笑容。',
      '小明问："爷爷，为什么今年的收成这么好呀？"',
      '爷爷说："因为我们春天认真播种，夏天努力浇水施肥呀！"',
      '"一分耕耘，一分收获。付出多少努力，就会有多少回报。"',
      '小明听了，决定以后也要认真学习，像爷爷种地一样努力。',
      '大有卦告诉我们：付出努力，终会有丰盛的收获！',
    ],
    lesson: '元亨。意思是：大丰收，一切顺利！',
  },
  '15': {
    id: 15,
    gua: '谦',
    title: '谦虚的小象',
    summary: '骄傲使人落后，谦虚使人进步',
    emoji: '🐘',
    level: 'explorer',
    content: [
      '小象是森林里最强壮的动物，它能举起很重的木头。',
      '一开始，小象很骄傲，总是在其他动物面前炫耀。',
      '"看我多厉害！"小象说。其他动物都不太喜欢它。',
      '有一天，森林里举办运动会。小象觉得自己肯定能拿第一。',
      '但是比赛的时候，小象发现小猴子比它更灵活，小马比它跑得更快。',
      '小象很惊讶："原来我并不是什么都最厉害的呀！"',
      '从那以后，小象变得谦虚了。它向小猴子学爬树，向小马学跑步。',
      '谦卦告诉我们：骄傲使人落后，谦虚使人进步！',
    ],
    lesson: '谦谦君子，用涉大川。意思是：谦虚的人，能成就大事！',
  },
  '16': {
    id: 16,
    gua: '豫',
    title: '快乐的歌声',
    summary: '用音乐传递快乐',
    emoji: '🎵',
    level: 'explorer',
    content: [
      '森林里有一只小夜莺，它的歌声特别好听。',
      '每天晚上，小夜莺都会站在树枝上唱歌。',
      '小动物们听到它的歌声，都会感到非常快乐。',
      '有一天，小夜莺问妈妈："为什么我的歌声能让人快乐呢？"',
      '妈妈说："因为你唱歌的时候很开心，这份快乐传给了大家。"',
      '"快乐是可以传染的。当你快乐的时候，身边的人也会快乐。"',
      '小夜莺明白了，它更加努力地练习唱歌，希望能让更多动物开心。',
      '豫卦告诉我们：保持快乐的心情，并把快乐分享给身边的人！',
    ],
    lesson: '豫，利建侯行师。意思是：做好准备，快乐地迎接挑战！',
  },
}

const storiesData = { ...first16StoriesData, ...extraStoriesData }
const storyId = $derived($page.params.id)
const story = $derived(storiesData[storyId])

let read = $state(false)
let currentIndex = $state(0)
let showCelebration = $state(false)
let isSaving = $state(false)

async function loadProgress() {
  if (!browser || !$auth.user || !storyId) return
  try {
    const progress = await getStoryProgress($auth.user.id)
    const found = progress.find((p) => p.story_id === parseInt(storyId, 10))
    read = found?.read || false
  } catch (error) {
    console.error('Error loading progress:', error)
  }
}

function nextPage() {
  if (story && currentIndex < story.content.length - 1) currentIndex++
}

function prevPage() {
  if (currentIndex > 0) currentIndex--
}

async function markAsRead() {
  if (!browser || !$auth.user || !story || isSaving) return
  isSaving = true
  try {
    await updateStoryProgress($auth.user.id, story.id, story.gua, true)
    read = true
    showCelebration = true
    setTimeout(() => {
      showCelebration = false
    }, 3000)
  } catch (error) {
    console.error('Error saving progress:', error)
  }
  isSaving = false
}

function goBack() {
  goto('/stories')
}

function getLevelInfo(level: string) {
  switch (level) {
    case 'beginner':
      return { label: '启蒙', color: '#22C55E', bg: '#DCFCE7' }
    case 'explorer':
      return { label: '探索', color: '#3B82F6', bg: '#DBEAFE' }
    default:
      return { label: '进阶', color: '#8B5CF6', bg: '#EDE9FE' }
  }
}

$effect(() => {
  if (browser && $auth.user && storyId) loadProgress()
})
</script>

<svelte:head>
  <title>{story?.title || '故事'} - 易经小课堂</title>
</svelte:head>

{#if !story}
  <div class="not-found">
    <span class="icon">📖</span>
    <h2>找不到这个故事</h2>
    <button class="btn btn-primary" onclick={goBack}>返回故事列表</button>
  </div>
{:else}
  {@const levelInfo = getLevelInfo(story.level)}
  
  <div class="story-detail">
    <!-- 顶部导航 -->
    <header class="nav">
      <button class="back-btn" onclick={goBack}>←</button>
      <h1>{story.gua}卦</h1>
      <div class="placeholder"></div>
    </header>

    <!-- 故事标题 -->
    <div class="story-header">
      <span class="emoji">{story.emoji}</span>
      <h2>{story.title}</h2>
      <p class="summary">{story.summary}</p>
      <span class="level-badge" style="background: {levelInfo.bg}; color: {levelInfo.color}">
        {levelInfo.label}
      </span>
    </div>

    <!-- 进度指示 -->
    <div class="progress-dots">
      {#each story.content as _, i}
        <span class="dot {i === currentIndex ? 'active' : ''} {i < currentIndex ? 'completed' : ''}"></span>
      {/each}
    </div>

    <!-- 故事内容 -->
    <div class="content-card">
      <p class="story-text">{story.content[currentIndex]}</p>
      
      <div class="nav-buttons">
        <button class="btn btn-secondary" onclick={prevPage} disabled={currentIndex === 0}>
          ← 上一页
        </button>
        <span class="page-indicator">{currentIndex + 1} / {story.content.length}</span>
        
        {#if currentIndex < story.content.length - 1}
          <button class="btn btn-primary" onclick={nextPage}>
            下一页 →
          </button>
        {:else}
          <button class="btn btn-success" onclick={markAsRead} disabled={isSaving || read}>
            {#if read}✓ 已读完{:else if isSaving}保存中...{:else}完成 🎉{/if}
          </button>
        {/if}
      </div>
    </div>

    <!-- 故事启示 -->
    <section class="lesson-card">
      <h3>💡 故事启示</h3>
      <p>{story.lesson}</p>
    </section>

    <!-- 更多故事 -->
    <section class="more-stories">
      <h3>更多故事</h3>
      <div class="story-list">
        {#each Object.entries(storiesData).filter(([id, _]) => id !== storyId).slice(0, 6) as [id, s]}
          <a href="/stories/{id}" class="story-item">
            <span class="item-emoji">{s.emoji}</span>
            <div class="item-info">
              <span class="item-title">{s.title}</span>
              <span class="item-gua">{s.gua}卦</span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </div>

  <!-- 庆祝动画 -->
  {#if showCelebration}
    <div class="celebration">
      <span class="celebration-emoji">🎉</span>
      <div class="celebration-card">
        <span class="celebration-title">太棒了！</span>
        <span class="celebration-text">你读完了《{story.title}》</span>
      </div>
    </div>
  {/if}
{/if}

<style>
  /* 未找到页面 */
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 24px;
    text-align: center;

    .icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 18px;
      color: #8E8E93;
      margin-bottom: 24px;
    }
  }

  .btn {
    padding: 12px 20px;
    border-radius: 12px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.btn-primary {
      background: #F97316;
      color: white;

      &:hover:not(:disabled) {
        background: #EA580C;
      }
    }

    &.btn-secondary {
      background: #F2F2F7;
      color: #8E8E93;
    }

    &.btn-success {
      background: #22C55E;
      color: white;
    }
  }

  /* 详情页 */
  .story-detail {
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top));
    /* 底部间距由布局统一处理 */
  }

  /* 导航 */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: #F2F2F7;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s ease;

      &:active {
        background: #E5E5EA;
      }
    }

    h1 {
      font-size: 17px;
      font-weight: 600;
      color: #1C1C1E;
    }

    .placeholder {
      width: 40px;
    }
  }

  /* 故事头部 */
  .story-header {
    text-align: center;
    margin-bottom: 20px;

    .emoji {
      font-size: 56px;
      display: block;
      margin-bottom: 12px;
    }

    h2 {
      font-size: 22px;
      font-weight: 700;
      color: #1C1C1E;
      margin: 0 0 6px 0;
    }

    .summary {
      font-size: 14px;
      color: #8E8E93;
      margin: 0 0 12px 0;
    }

    .level-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
  }

  /* 进度点 */
  .progress-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-bottom: 16px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #E5E5EA;
      transition: all 0.2s ease;

      &.completed {
        background: #22C55E;
      }

      &.active {
        background: #F97316;
        transform: scale(1.3);
      }
    }
  }

  /* 内容卡片 */
  .content-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .story-text {
      font-size: 16px;
      color: #1C1C1E;
      line-height: 1.8;
      margin: 0 0 24px 0;
      min-height: 100px;
    }

    .nav-buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      .page-indicator {
        font-size: 13px;
        color: #8E8E93;
      }
    }
  }

  /* 启示卡片 */
  .lesson-card {
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 20px;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #92400E;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #78350F;
      line-height: 1.6;
      margin: 0;
    }
  }

  /* 更多故事 */
  .more-stories {
    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #1C1C1E;
      margin: 0 0 12px 0;
    }

    .story-list {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 8px;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .story-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      background: white;
      border-radius: 14px;
      text-decoration: none;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      flex-shrink: 0;
      transition: transform 0.15s ease;

      &:active {
        transform: scale(0.98);
      }

      .item-emoji {
        font-size: 28px;
      }

      .item-info {
        display: flex;
        flex-direction: column;

        .item-title {
          font-size: 13px;
          font-weight: 600;
          color: #1C1C1E;
        }

        .item-gua {
          font-size: 11px;
          color: #8E8E93;
        }
      }
    }
  }

  /* 庆祝动画 */
  .celebration {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.3s ease;

    .celebration-emoji {
      font-size: 72px;
      animation: bounce 0.6s ease;
    }

    .celebration-card {
      background: white;
      padding: 24px 32px;
      border-radius: 20px;
      text-align: center;
      margin-top: 16px;
      animation: slideUp 0.4s ease;

      .celebration-title {
        display: block;
        font-size: 26px;
        font-weight: 700;
        color: #1C1C1E;
        margin-bottom: 8px;
      }

      .celebration-text {
        font-size: 15px;
        color: #8E8E93;
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
