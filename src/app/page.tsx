import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          반려동물의 새로운 미래,<br />
          <span className={styles.highlight}>AI와 함께 시작됩니다</span>
        </h1>
        <p className={styles.subtitle}>
          최첨단 AI 기술로 당신의 소중한 가족에게<br />
          더 나은 삶의 질을 제공합니다
        </p>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>AI 맞춤 케어</h2>
          <p>
            개별 반려동물의 특성을 딥러닝으로 분석하여
            최적화된 일상 케어 가이드를 제공합니다.
            24/7 실시간 모니터링으로 안전하고
            건강한 생활을 보장합니다.
          </p>
        </div>

        <div className={styles.feature}>
          <h2>스마트 건강 관리</h2>
          <p>
            AI 영상 분석으로 반려동물의 행동 패턴을
            실시간 분석하고, 이상 징후를 조기에
            감지하여 예방적 건강 관리를
            가능하게 합니다.
          </p>
        </div>

        <div className={styles.feature}>
          <h2>맞춤형 영양 설계</h2>
          <p>
            연령, 체중, 활동량, 건강 상태를 고려한
            AI 기반 맞춤형 식단을 추천합니다.
            최적의 영양 섭취로 건강한
            생활을 지원합니다.
          </p>
        </div>
      </section>

      <section className={styles.description}>
        <p>
          OneBite는 인공지능 기술로 반려동물 케어의 새로운 기준을 제시합니다.
          더 이상 막연한 걱정은 그만, 이제 AI와 함께
          과학적이고 체계적인 반려동물 케어를 시작하세요.
        </p>
      </section>
    </div>
  )
}
